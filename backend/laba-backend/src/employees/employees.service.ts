import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { canManageRole } from '../common/constants/lab-permissions';
import {
  LabRole,
  MembershipStatus,
  MembershipEventType,
  Prisma,
} from '../../generated/prisma/client.js';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { RemoveEmployeeDto } from './dto/remove-employee.dto';

/** Публичная проекция User внутри ответов employees-эндпоинтов. */
interface EmployeeUserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

/** Форма LabMembership с подгруженными user/deletedBy — то, что реально
 * возвращают запросы ниже (select/include совпадают с этими полями). */
interface MembershipRecord {
  id: string;
  userId: string;
  labId: string;
  role: LabRole;
  status: MembershipStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  deletedById: string | null;
  user: EmployeeUserRecord;
  deletedBy: EmployeeUserRecord | null;
}

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  isActive: true,
} as const;

const MEMBERSHIP_INCLUDE = {
  user: { select: USER_SELECT },
  deletedBy: { select: USER_SELECT },
} as const;

/**
 * CRUD сотрудников лабы поверх LabMembership.
 *
 * Права: OWNER управляет ADMIN и TECHNICIAN, ADMIN — только TECHNICIAN,
 * TECHNICIAN не управляет никем (отсекается уже на уровне контроллера
 * через @Roles). OWNER недостижим как цель ни для кого — его нельзя
 * ни заблокировать, ни удалить, ни понизить в роли через этот сервис.
 *
 * Удаление — мягкое: строка LabMembership остаётся (deletedAt/deletedById),
 * поэтому историю (`MembershipEvent`) и любые будущие данные, ссылающиеся
 * на userId/labId, ничего не обнуляет. Восстановление снимает deletedAt.
 */
@Injectable()
export class EmployeesService {
  constructor(private readonly db: DatabaseService) {}

  async listEmployees(labId: string, includeRemoved: boolean) {
    const memberships = await this.db.labMembership.findMany({
      where: {
        labId,
        ...(includeRemoved ? {} : { deletedAt: null }),
      },
      include: MEMBERSHIP_INCLUDE,
      orderBy: [{ deletedAt: 'asc' }, { createdAt: 'asc' }],
    });

    return memberships.map((m) => this.toDto(m));
  }

  async getEmployee(labId: string, targetUserId: string) {
    const membership = await this.findMembershipOrThrow(labId, targetUserId, {
      allowRemoved: true,
    });
    return this.toDto(membership);
  }

  async getEmployeeHistory(labId: string, targetUserId: string) {
    const membership = await this.findMembershipOrThrow(labId, targetUserId, {
      allowRemoved: true,
    });

    const events = await this.db.membershipEvent.findMany({
      where: { membershipId: membership.id },
      include: { actor: { select: USER_SELECT } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return events.map((e) => ({
      id: e.id,
      type: e.type,
      metadata: e.metadata,
      createdAt: e.createdAt,
      actor: e.actor
        ? {
            id: e.actor.id,
            firstName: e.actor.firstName,
            lastName: e.actor.lastName,
            email: e.actor.email,
          }
        : null,
    }));
  }

  async updateEmployee(
    labId: string,
    targetUserId: string,
    dto: UpdateEmployeeDto,
    actor: AuthenticatedUser,
  ) {
    if (!dto.role && !dto.status) {
      throw new BadRequestException('Нечего обновлять — укажите role и/или status');
    }
    if (targetUserId === actor.userId) {
      throw new BadRequestException('Нельзя изменить собственную роль или статус');
    }

    const membership = await this.findMembershipOrThrow(labId, targetUserId, {
      allowRemoved: false,
    });

    if (!canManageRole(actor.role, membership.role)) {
      throw new ForbiddenException('Недостаточно прав для управления этим сотрудником');
    }
    if (dto.role && dto.role !== membership.role && !canManageRole(actor.role, dto.role)) {
      throw new ForbiddenException('Недостаточно прав, чтобы назначить эту роль');
    }

    const roleChanged = !!dto.role && dto.role !== membership.role;
    const statusChanged = !!dto.status && dto.status !== membership.status;

    if (!roleChanged && !statusChanged) {
      return this.toDto(membership);
    }

    const events: {
      membershipId: string;
      labId: string;
      targetUserId: string;
      type: MembershipEventType;
      actorId: string;
      metadata: Prisma.InputJsonValue;
    }[] = [];

    if (roleChanged) {
      events.push({
        membershipId: membership.id,
        labId,
        targetUserId,
        type: 'ROLE_CHANGED',
        actorId: actor.userId,
        metadata: { from: membership.role, to: dto.role },
      });
    }
    if (statusChanged) {
      events.push({
        membershipId: membership.id,
        labId,
        targetUserId,
        type: dto.status === 'BLOCKED' ? 'BLOCKED' : 'UNBLOCKED',
        actorId: actor.userId,
        metadata: { from: membership.status, to: dto.status },
      });
    }

    const now = new Date();
    const [updated] = await this.db.$transaction([
      this.db.labMembership.update({
        where: { id: membership.id },
        data: {
          ...(roleChanged ? { role: dto.role } : {}),
          ...(statusChanged ? { status: dto.status } : {}),
        },
        include: MEMBERSHIP_INCLUDE,
      }),
      this.db.membershipEvent.createMany({ data: events }),
      ...(dto.status === 'BLOCKED'
        ? [
            this.db.session.updateMany({
              where: { userId: targetUserId, labId, revokedAt: null },
              data: { revokedAt: now },
            }),
          ]
        : []),
    ]);

    return this.toDto(updated);
  }

  /** Мягкое удаление (увольнение). Строка и её история сохраняются. */
  async removeEmployee(
    labId: string,
    targetUserId: string,
    dto: RemoveEmployeeDto,
    actor: AuthenticatedUser,
  ) {
    if (targetUserId === actor.userId) {
      throw new BadRequestException('Нельзя удалить самого себя из организации');
    }

    const membership = await this.findMembershipOrThrow(labId, targetUserId, {
      allowRemoved: false,
    });

    if (membership.role === 'OWNER') {
      throw new ForbiddenException('Нельзя удалить владельца лаборатории');
    }
    if (!canManageRole(actor.role, membership.role)) {
      throw new ForbiddenException('Недостаточно прав для удаления этого сотрудника');
    }

    const now = new Date();
    const [updated] = await this.db.$transaction([
      this.db.labMembership.update({
        where: { id: membership.id },
        data: { deletedAt: now, deletedById: actor.userId },
        include: MEMBERSHIP_INCLUDE,
      }),
      this.db.membershipEvent.create({
        data: {
          membershipId: membership.id,
          labId,
          targetUserId,
          type: 'REMOVED',
          actorId: actor.userId,
          metadata: { reason: dto.reason?.trim() || null, previousStatus: membership.status },
        },
      }),
      this.db.session.updateMany({
        where: { userId: targetUserId, labId, revokedAt: null },
        data: { revokedAt: now },
      }),
    ]);

    return this.toDto(updated);
  }

  /** Восстановление ранее уволенного сотрудника — снимает deletedAt, роль сохраняется. */
  async restoreEmployee(labId: string, targetUserId: string, actor: AuthenticatedUser) {
    const membership = await this.db.labMembership.findUnique({
      where: { userId_labId: { userId: targetUserId, labId } },
      include: MEMBERSHIP_INCLUDE,
    });
    if (!membership) {
      throw new NotFoundException('Сотрудник не найден в этой лаборатории');
    }
    if (!membership.deletedAt) {
      throw new BadRequestException('Сотрудник не удалён — восстанавливать нечего');
    }
    if (!canManageRole(actor.role, membership.role)) {
      throw new ForbiddenException('Недостаточно прав для восстановления этого сотрудника');
    }

    const [updated] = await this.db.$transaction([
      this.db.labMembership.update({
        where: { id: membership.id },
        data: { deletedAt: null, deletedById: null, status: 'ACTIVE' },
        include: MEMBERSHIP_INCLUDE,
      }),
      this.db.membershipEvent.create({
        data: {
          membershipId: membership.id,
          labId,
          targetUserId,
          type: 'RESTORED',
          actorId: actor.userId,
        },
      }),
    ]);

    return this.toDto(updated);
  }

  private async findMembershipOrThrow(
    labId: string,
    targetUserId: string,
    opts: { allowRemoved: boolean },
  ): Promise<MembershipRecord> {
    const membership = await this.db.labMembership.findUnique({
      where: { userId_labId: { userId: targetUserId, labId } },
      include: MEMBERSHIP_INCLUDE,
    });
    if (!membership) {
      throw new NotFoundException('Сотрудник не найден в этой лаборатории');
    }
    if (membership.deletedAt && !opts.allowRemoved) {
      throw new ConflictException('Сотрудник удалён — сначала восстановите его');
    }
    return membership;
  }

  private toDto(m: MembershipRecord) {
    return {
      userId: m.userId,
      labId: m.labId,
      role: m.role,
      status: m.status,
      email: m.user.email,
      firstName: m.user.firstName,
      lastName: m.user.lastName,
      isAccountActive: m.user.isActive,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      deletedAt: m.deletedAt,
      deletedBy: m.deletedBy
        ? {
            id: m.deletedBy.id,
            firstName: m.deletedBy.firstName,
            lastName: m.deletedBy.lastName,
            email: m.deletedBy.email,
          }
        : null,
    };
  }
}
