import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { generateToken } from '../common/utils/token.util';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';

interface LabWithActiveMembers {
  id: string;
  name: string;
  createdAt: Date;
  subscription: { plan: string; status: string; expiresAt: Date } | null;
  memberships: Array<{
    role: string;
    user: { id: string; firstName: string; lastName: string; email: string };
  }>;
}

/** Сколько дней подписки даём при восстановлении заблокированной лабы. */
const RESTORE_TRIAL_DAYS = 14;

/**
 * "Тариф" пока нигде в бэке не влияет на доступ/лимиты (см. комментарий
 * в UpdateLabDto/CreateLabDto) — используется только как значение по
 * умолчанию для обязательной колонки Subscription.plan.
 */
const DEFAULT_PLAN = 'base';

@Injectable()
export class LabsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Платформенный админ создаёт лабораторию + приглашение владельцу.
   * Если ownerEmail уже принадлежит существующему пользователю — при
   * accept-invite он просто получит ещё одно членство (OWNER) в новой лабе,
   * что и позволяет одному человеку владеть несколькими лабами.
   */
  async createLab(dto: CreateLabDto, invitedById: string) {
    const trialDays = dto.trialDays ?? 14;
    const inviteTtlDays = Number(this.config.get('INVITE_TTL_DAYS') ?? 7);

    const lab = await this.db.lab.create({
      data: {
        name: dto.labName,
        subscription: {
          create: {
            plan: dto.plan ?? DEFAULT_PLAN,
            status: 'TRIALING',
            expiresAt: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    const invite = await this.db.invite.create({
      data: {
        email: dto.ownerEmail,
        labId: lab.id,
        role: 'OWNER',
        token: generateToken(),
        expiresAt: new Date(Date.now() + inviteTtlDays * 24 * 60 * 60 * 1000),
        invitedById,
      },
    });

    const appUrl = this.config.get<string>('APP_URL') ?? '';
    return {
      lab,
      invite: {
        email: invite.email,
        expiresAt: invite.expiresAt,
        acceptUrl: `${appUrl}/invites/${invite.token}/accept`,
      },
    };
  }

  /** Все активные (не уволенные) лабы текущего пользователя (для UI-свитчера). */
  async getMyLabs(userId: string) {
    const memberships = await this.db.labMembership.findMany({
      where: { userId, status: 'ACTIVE', deletedAt: null },
      include: { lab: { include: { subscription: true } } },
    });

    return memberships.map((m) => ({
      labId: m.labId,
      labName: m.lab.name,
      role: m.role,
      subscriptionStatus: m.lab.subscription?.status ?? null,
    }));
  }

  /**
   * Все лаборатории платформы — для админ-экрана (список/поиск).
   * Отдаём владельца (первое активное членство с ролью OWNER) и число
   * активных участников, чтобы не гонять на фронт вложенные списки.
   */
  async listLabs() {
    const labs = await this.db.lab.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: true,
        memberships: {
          where: { deletedAt: null },
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    return labs.map((lab) => this.toSummary(lab));
  }

  /** Детали одной лабы + список активных участников (для карточки/страницы лабы). */
  async getLabDetail(labId: string) {
    const lab = await this.findLabWithMembersOrThrow(labId);

    return {
      ...this.toSummary(lab),
      members: lab.memberships.map((m) => ({
        userId: m.userId,
        role: m.role,
        status: m.status,
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        email: m.user.email,
      })),
    };
  }

  /**
   * Переименование лабы, смена тарифа и/или ручная правка даты окончания
   * подписки. Статус подписки (блокировка/восстановление) сюда не входит —
   * для этого blockLab/restoreLab, у них своя, более узкая семантика.
   */
  async updateLab(labId: string, dto: UpdateLabDto) {
    await this.ensureLabExists(labId);

    if (dto.name !== undefined) {
      await this.db.lab.update({ where: { id: labId }, data: { name: dto.name } });
    }

    if (dto.plan !== undefined || dto.expiresAt !== undefined) {
      const expiresAt = dto.expiresAt
        ? new Date(dto.expiresAt)
        : new Date(Date.now() + RESTORE_TRIAL_DAYS * 24 * 60 * 60 * 1000);

      await this.db.subscription.upsert({
        where: { labId },
        update: {
          ...(dto.plan !== undefined ? { plan: dto.plan } : {}),
          ...(dto.expiresAt !== undefined ? { expiresAt } : {}),
        },
        create: {
          labId,
          plan: dto.plan ?? DEFAULT_PLAN,
          status: 'TRIALING',
          expiresAt,
        },
      });
    }

    return this.getLabDetail(labId);
  }

  /**
   * «Удаление» лабы — мягкое: без схемы под deletedAt на Lab используем уже
   * существующий и проверенный на бэке механизм — статус подписки. CANCELED
   * закрывает вход всем сотрудникам лабы (см. auth.service ACTIVE_SUBSCRIPTION_STATUSES),
   * плюс сразу отзываем текущие сессии — как это уже делает cron просроченных
   * подписок. Данные (сотрудники, история, приглашения) не удаляются и
   * возвращаются восстановлением через restoreLab.
   */
  async blockLab(labId: string) {
    await this.ensureLabExists(labId);

    await this.db.$transaction([
      this.db.subscription.upsert({
        where: { labId },
        update: { status: 'CANCELED' },
        create: { labId, plan: DEFAULT_PLAN, status: 'CANCELED', expiresAt: new Date() },
      }),
      this.db.session.updateMany({
        where: { labId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return this.getLabDetail(labId);
  }

  /** Восстановление заблокированной лабы: подписка снова активна, доступ возвращается. */
  async restoreLab(labId: string) {
    await this.ensureLabExists(labId);

    await this.db.subscription.upsert({
      where: { labId },
      update: {
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + RESTORE_TRIAL_DAYS * 24 * 60 * 60 * 1000),
      },
      create: {
        labId,
        plan: DEFAULT_PLAN,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + RESTORE_TRIAL_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    return this.getLabDetail(labId);
  }

  async ensureLabExists(labId: string) {
    const lab = await this.db.lab.findUnique({ where: { id: labId } });
    if (!lab) {
      throw new ConflictException('Лаборатория не найдена');
    }
    return lab;
  }

  private async findLabWithMembersOrThrow(labId: string) {
    const lab = await this.db.lab.findUnique({
      where: { id: labId },
      include: {
        subscription: true,
        memberships: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    if (!lab) {
      throw new NotFoundException('Лаборатория не найдена');
    }

    return lab;
  }

  private toSummary(lab: LabWithActiveMembers) {
    const owner = lab.memberships.find((m) => m.role === 'OWNER');

    return {
      id: lab.id,
      name: lab.name,
      createdAt: lab.createdAt,
      subscription: lab.subscription
        ? {
            plan: lab.subscription.plan,
            status: lab.subscription.status,
            expiresAt: lab.subscription.expiresAt,
          }
        : null,
      owner: owner
        ? {
            id: owner.user.id,
            firstName: owner.user.firstName,
            lastName: owner.user.lastName,
            email: owner.user.email,
          }
        : null,
      membersCount: lab.memberships.length,
    };
  }
}
