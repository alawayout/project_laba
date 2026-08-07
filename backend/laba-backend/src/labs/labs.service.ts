import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { generateToken } from '../common/utils/token.util';
import { LabRole } from '../../generated/prisma/client.js';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { CreateLabDto } from './dto/create-lab.dto';

/** Кто кого имеет право блокировать/разблокировать в рамках лабы. */
const MANAGE_PERMISSIONS: Record<LabRole, LabRole[]> = {
  OWNER: ['ADMIN', 'TECHNICIAN'],
  ADMIN: ['TECHNICIAN'],
  TECHNICIAN: [],
};

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
   * что и позволяет одному человеку владеть несколькими лабораториями.
   */
  async createLab(dto: CreateLabDto, invitedById: string) {
    const trialDays = dto.trialDays ?? 14;
    const inviteTtlDays = Number(this.config.get('INVITE_TTL_DAYS') ?? 7);

    const lab = await this.db.lab.create({
      data: {
        name: dto.labName,
        subscription: {
          create: {
            plan: dto.plan,
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

  /** Все активные лабы текущего пользователя (для UI-свитчера). */
  async getMyLabs(userId: string) {
    const memberships = await this.db.labMembership.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { lab: { include: { subscription: true } } },
    });

    return memberships.map((m) => ({
      labId: m.labId,
      labName: m.lab.name,
      role: m.role,
      subscriptionStatus: m.lab.subscription?.status ?? null,
    }));
  }

  /** Блокировка/разблокировка сотрудника лабы. При блокировке сразу отзываются сессии. */
  async updateMembershipStatus(
    labId: string,
    targetUserId: string,
    status: 'ACTIVE' | 'BLOCKED',
    actor: AuthenticatedUser,
  ) {
    if (targetUserId === actor.userId) {
      throw new BadRequestException('Нельзя изменить статус собственного членства');
    }

    const target = await this.db.labMembership.findUnique({
      where: { userId_labId: { userId: targetUserId, labId } },
    });
    if (!target) {
      throw new NotFoundException('Сотрудник не найден в этой лаборатории');
    }

    if (!actor.role || !MANAGE_PERMISSIONS[actor.role]?.includes(target.role)) {
      throw new ForbiddenException('Недостаточно прав для управления этим сотрудником');
    }

    const updated = await this.db.labMembership.update({
      where: { userId_labId: { userId: targetUserId, labId } },
      data: { status },
    });

    if (status === 'BLOCKED') {
      await this.db.session.updateMany({
        where: { userId: targetUserId, labId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return updated;
  }

  async ensureLabExists(labId: string) {
    const lab = await this.db.lab.findUnique({ where: { id: labId } });
    if (!lab) {
      throw new ConflictException('Лаборатория не найдена');
    }
    return lab;
  }
}
