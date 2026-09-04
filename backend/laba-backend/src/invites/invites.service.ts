import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService, TokenPair } from '../auth/auth.service';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { DatabaseService } from '../database/database.service';
import { generateToken } from '../common/utils/token.util';
import { canManageRole } from '../common/constants/lab-permissions';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { CreateInviteDto } from './dto/create-invite.dto';

const ACTIVE_SUBSCRIPTION_STATUSES = ['ACTIVE', 'TRIALING'] as const;

@Injectable()
export class InvitesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async createInvite(labId: string, dto: CreateInviteDto, inviter: AuthenticatedUser) {
    // Кто кого имеет право приглашать совпадает с тем, кто кем может управлять
    // после приёма приглашения (см. EmployeesModule) — один источник правды.
    if (!canManageRole(inviter.role, dto.role)) {
      throw new ForbiddenException('Недостаточно прав, чтобы пригласить эту роль');
    }

    await this.assertLabSubscriptionActive(labId);

    // Уже действующего (не уволенного) сотрудника этой лабы приглашать заново
    // некуда — это должно идти через изменение роли (EmployeesModule).
    const existingUser = await this.db.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      const existingMembership = await this.db.labMembership.findUnique({
        where: { userId_labId: { userId: existingUser.id, labId } },
      });
      if (existingMembership && !existingMembership.deletedAt) {
        throw new ConflictException('Этот email уже состоит в лаборатории');
      }
    }

    // Не плодим дубликаты — на один email в лабе может быть только одно
    // ещё не истёкшее активное приглашение одновременно.
    const existingPendingInvite = await this.db.invite.findFirst({
      where: { labId, email: dto.email, status: 'PENDING', expiresAt: { gt: new Date() } },
    });
    if (existingPendingInvite) {
      throw new ConflictException('На этот email уже есть активное приглашение');
    }

    const inviteTtlDays = Number(this.config.get('INVITE_TTL_DAYS') ?? 7);
    const invite = await this.db.invite.create({
      data: {
        email: dto.email,
        labId,
        role: dto.role,
        token: generateToken(),
        expiresAt: new Date(Date.now() + inviteTtlDays * 24 * 60 * 60 * 1000),
        invitedById: inviter.userId,
      },
    });

    const appUrl = this.config.get<string>('APP_URL') ?? '';
    return {
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt,
      acceptUrl: `${appUrl}/invites/${invite.token}/accept`,
    };
  }

  /** Публичная информация об инвайте — чтобы страница показала контекст перед принятием. */
  async getInviteInfo(token: string) {
    const invite = await this.db.invite.findUnique({
      where: { token },
      include: { lab: true },
    });

    if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      throw new NotFoundException('Приглашение не найдено или уже использовано');
    }

    const userExists = (await this.db.user.count({ where: { email: invite.email } })) > 0;

    return {
      email: invite.email,
      labName: invite.lab.name,
      role: invite.role,
      expiresAt: invite.expiresAt,
      userExists,
    };
  }

  async acceptInvite(
    token: string,
    dto: AcceptInviteDto,
    meta: { userAgent?: string; ip?: string },
  ): Promise<TokenPair> {
    const invite = await this.db.invite.findUnique({ where: { token } });
    if (!invite || invite.status !== 'PENDING') {
      throw new NotFoundException('Приглашение не найдено или уже использовано');
    }

    if (invite.expiresAt < new Date()) {
      await this.db.invite.update({
        where: { id: invite.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Срок действия приглашения истёк');
    }

    await this.assertLabSubscriptionActive(invite.labId);

    let user = await this.db.user.findUnique({ where: { email: invite.email } });

    if (!user) {
      if (!dto.password || !dto.firstName || !dto.lastName) {
        throw new BadRequestException(
          'Для нового аккаунта нужны password, firstName, lastName',
        );
      }
      user = await this.db.user.create({
        data: {
          email: invite.email,
          passwordHash: await this.authService.hashPassword(dto.password),
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
    }

    // Существующее (в т.ч. мягко удалённое) членство — на случай повторного
    // приглашения уволенного сотрудника: приём инвайта его восстанавливает.
    const existingMembership = await this.db.labMembership.findUnique({
      where: { userId_labId: { userId: user.id, labId: invite.labId } },
    });

    const membership = await this.db.labMembership.upsert({
      where: { userId_labId: { userId: user.id, labId: invite.labId } },
      update: {
        role: invite.role,
        status: 'ACTIVE',
        deletedAt: null,
        deletedById: null,
      },
      create: {
        userId: user.id,
        labId: invite.labId,
        role: invite.role,
        status: 'ACTIVE',
      },
    });

    await this.db.membershipEvent.create({
      data: {
        membershipId: membership.id,
        labId: invite.labId,
        targetUserId: user.id,
        type: existingMembership?.deletedAt ? 'RESTORED' : 'CREATED',
        actorId: invite.invitedById,
        metadata: existingMembership?.deletedAt
          ? { via: 'invite', previousRole: existingMembership.role }
          : { role: invite.role, via: 'invite' },
      },
    });

    await this.db.invite.update({
      where: { id: invite.id },
      data: { status: 'ACCEPTED' },
    });

    return this.authService.issueTokens(
      user.id,
      { labId: invite.labId, role: invite.role },
      meta,
    );
  }

  /** Все приглашения лабы (для экрана «Сотрудники» — вкладка «Приглашения»). */
  async listInvites(labId: string) {
    const invites = await this.db.invite.findMany({
      where: { labId },
      include: {
        invitedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const appUrl = this.config.get<string>('APP_URL') ?? '';
    const now = new Date();

    return invites.map((invite) => {
      // Статус в БД не обновляется фоново — на лету считаем «просроченным»
      // PENDING, у которого уже прошёл expiresAt (реально помечается EXPIRED
      // только при попытке accept/re-invite).
      const effectiveStatus =
        invite.status === 'PENDING' && invite.expiresAt < now ? 'EXPIRED' : invite.status;

      return {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: effectiveStatus,
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt,
        invitedBy: invite.invitedBy
          ? {
              id: invite.invitedBy.id,
              firstName: invite.invitedBy.firstName,
              lastName: invite.invitedBy.lastName,
              email: invite.invitedBy.email,
            }
          : null,
        acceptUrl: effectiveStatus === 'PENDING' ? `${appUrl}/invites/${invite.token}/accept` : null,
      };
    });
  }

  /** Отзыв ещё не принятого приглашения — ссылка перестаёт работать. */
  async revokeInvite(labId: string, inviteId: string, actor: AuthenticatedUser) {
    const invite = await this.db.invite.findUnique({ where: { id: inviteId } });
    if (!invite || invite.labId !== labId) {
      throw new NotFoundException('Приглашение не найдено');
    }
    if (invite.status !== 'PENDING') {
      throw new ConflictException('Отозвать можно только ещё не принятое приглашение');
    }
    if (!canManageRole(actor.role, invite.role)) {
      throw new ForbiddenException('Недостаточно прав для отзыва этого приглашения');
    }

    return this.db.invite.update({
      where: { id: inviteId },
      data: { status: 'REVOKED' },
    });
  }

  private async assertLabSubscriptionActive(labId: string): Promise<void> {
    const subscription = await this.db.subscription.findUnique({ where: { labId } });
    const active =
      subscription &&
      ACTIVE_SUBSCRIPTION_STATUSES.includes(
        subscription.status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number],
      );
    if (!active) {
      throw new ForbiddenException(
        'Подписка лаборатории неактивна — регистрация/приглашения заблокированы',
      );
    }
  }
}
