import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { LabRole } from '../../generated/prisma/client.js';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LabChoice {
  labId: string;
  labName: string;
  role: LabRole;
}

const ACTIVE_SUBSCRIPTION_STATUSES = ['ACTIVE', 'TRIALING'] as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(
    dto: LoginDto,
    meta: { userAgent?: string; ip?: string },
  ): Promise<TokenPair | { requiresLabSelection: true; labs: LabChoice[] }> {
    const user = await this.db.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Платформенный администратор без указания labId — логин в админ-режиме.
    if (user.isSuperAdmin && !dto.labId) {
      return this.issueTokens(user.id, { isSuperAdmin: true }, meta);
    }

    const memberships = await this.db.labMembership.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        deletedAt: null,
        ...(dto.labId ? { labId: dto.labId } : {}),
      },
      include: { lab: { include: { subscription: true } } },
    });

    const eligible = memberships.filter((m) =>
      m.lab.subscription
        ? ACTIVE_SUBSCRIPTION_STATUSES.includes(
            m.lab.subscription.status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number],
          )
        : false,
    );

    if (eligible.length === 0) {
      throw new ForbiddenException(
        'Нет доступа ни к одной лаборатории: аккаунт заблокирован или подписка неактивна',
      );
    }

    if (!dto.labId && eligible.length > 1) {
      return {
        requiresLabSelection: true,
        labs: eligible.map((m) => ({
          labId: m.labId,
          labName: m.lab.name,
          role: m.role,
        })),
      };
    }

    const membership = eligible[0];
    return this.issueTokens(
      user.id,
      { labId: membership.labId, role: membership.role },
      meta,
    );
  }

  async refresh(rawRefreshToken: string, meta: { userAgent?: string; ip?: string }) {
    const [sessionId, secret] = rawRefreshToken.split('.');
    if (!sessionId || !secret) {
      throw new UnauthorizedException('Некорректный refresh-токен');
    }

    const session = await this.db.session.findUnique({ where: { id: sessionId } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Сессия недействительна или отозвана');
    }

    const providedHash = hashToken(secret);
    const stored = Buffer.from(session.refreshTokenHash, 'hex');
    const provided = Buffer.from(providedHash, 'hex');
    if (
      stored.length !== provided.length ||
      !timingSafeEqual(stored, provided)
    ) {
      // Возможная попытка переиспользования украденного токена — отзываем сессию.
      await this.db.session.update({
        where: { id: sessionId },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Сессия недействительна или отозвана');
    }

    const user = await this.db.user.findUnique({ where: { id: session.userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Аккаунт заблокирован');
    }

    let payloadExtra: { labId?: string; role?: LabRole; isSuperAdmin?: boolean };

    if (session.labId) {
      const membership = await this.db.labMembership.findUnique({
        where: { userId_labId: { userId: user.id, labId: session.labId } },
        include: { lab: { include: { subscription: true } } },
      });

      const subActive =
        membership?.lab.subscription &&
        ACTIVE_SUBSCRIPTION_STATUSES.includes(
          membership.lab.subscription.status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number],
        );

      if (!membership || membership.status !== 'ACTIVE' || membership.deletedAt || !subActive) {
        await this.db.session.update({
          where: { id: sessionId },
          data: { revokedAt: new Date() },
        });
        throw new ForbiddenException(
          'Доступ к лаборатории заблокирован или подписка неактивна',
        );
      }

      payloadExtra = { labId: membership.labId, role: membership.role };
    } else {
      if (!user.isSuperAdmin) {
        throw new UnauthorizedException('Некорректная сессия');
      }
      payloadExtra = { isSuperAdmin: true };
    }

    // Ротация refresh-токена: старую сессию гасим, выпускаем новую запись.
    await this.db.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(user.id, payloadExtra, meta);
  }

  /** Переключение в контекст другой лабы того же владельца/сотрудника. */
  async switchLab(
    userId: string,
    labId: string,
    meta: { userAgent?: string; ip?: string },
  ): Promise<TokenPair> {
    const membership = await this.db.labMembership.findUnique({
      where: { userId_labId: { userId, labId } },
      include: { lab: { include: { subscription: true } } },
    });

    const subActive =
      membership?.lab.subscription &&
      ACTIVE_SUBSCRIPTION_STATUSES.includes(
        membership.lab.subscription.status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number],
      );

    if (!membership || membership.status !== 'ACTIVE' || membership.deletedAt || !subActive) {
      throw new ForbiddenException(
        'Нет доступа к этой лаборатории или подписка неактивна',
      );
    }

    return this.issueTokens(
      userId,
      { labId: membership.labId, role: membership.role },
      meta,
    );
  }

  async logout(sessionId: string): Promise<void> {
    await this.db.session.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async logoutAll(userId: string): Promise<void> {
    await this.db.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Выпускает пару токенов для указанного пользователя/лабы. Используется
   * при логине, ротации refresh-токена и авто-логине после accept-invite.
   */
  async issueTokens(
    userId: string,
    ctx: { labId?: string; role?: LabRole; isSuperAdmin?: boolean },
    meta: { userAgent?: string; ip?: string },
  ): Promise<TokenPair> {
    const refreshTtlDays = Number(this.config.get('JWT_REFRESH_TTL_DAYS') ?? 30);
    const secret = randomBytes(32).toString('hex');
    const refreshTokenHash = hashToken(secret);
    const expiresAt = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);

    const session = await this.db.session.create({
      data: {
        userId,
        labId: ctx.labId ?? null,
        refreshTokenHash,
        expiresAt,
        userAgent: meta.userAgent,
        ip: meta.ip,
      },
    });

    const payload: JwtPayload = {
      sub: userId,
      sid: session.id,
      labId: ctx.labId,
      role: ctx.role,
      isSuperAdmin: ctx.isSuperAdmin,
    };

    const accessTtl = (this.config.get<string>('JWT_ACCESS_TTL') ??
      '15m') as unknown as number;
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessTtl,
    });

    return {
      accessToken,
      refreshToken: `${session.id}.${secret}`,
    };
  }
}

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}
