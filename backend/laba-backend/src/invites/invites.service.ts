import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService, TokenPair } from '../auth/auth.service';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { DatabaseService } from '../database/database.service';
import { generateToken } from '../common/utils/token.util';
import { LabRole } from '../../generated/prisma/client.js';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { CreateInviteDto } from './dto/create-invite.dto';

const ACTIVE_SUBSCRIPTION_STATUSES = ['ACTIVE', 'TRIALING'] as const;

/** Кто кого имеет право приглашать. */
const INVITE_PERMISSIONS: Record<LabRole, LabRole[]> = {
  OWNER: ['ADMIN', 'TECHNICIAN'],
  ADMIN: ['TECHNICIAN'],
  TECHNICIAN: [],
};

@Injectable()
export class InvitesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async createInvite(labId: string, dto: CreateInviteDto, inviter: AuthenticatedUser) {
    if (!inviter.role || !INVITE_PERMISSIONS[inviter.role]?.includes(dto.role)) {
      throw new ForbiddenException('Недостаточно прав, чтобы пригласить эту роль');
    }

    await this.assertLabSubscriptionActive(labId);

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

    await this.db.labMembership.upsert({
      where: { userId_labId: { userId: user.id, labId: invite.labId } },
      update: { role: invite.role, status: 'ACTIVE' },
      create: {
        userId: user.id,
        labId: invite.labId,
        role: invite.role,
        status: 'ACTIVE',
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
