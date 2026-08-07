import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser, JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly db: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const session = await this.db.session.findUnique({
      where: { id: payload.sid },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Сессия недействительна или отозвана');
    }

    const user = await this.db.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Аккаунт заблокирован');
    }

    if (payload.isSuperAdmin) {
      if (!user.isSuperAdmin) {
        throw new UnauthorizedException('Недостаточно прав');
      }
      return {
        userId: user.id,
        sessionId: session.id,
        isSuperAdmin: true,
      };
    }

    if (!payload.labId || !payload.role) {
      throw new UnauthorizedException('Некорректный токен');
    }

    const membership = await this.db.labMembership.findUnique({
      where: { userId_labId: { userId: user.id, labId: payload.labId } },
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new UnauthorizedException('Доступ к лаборатории заблокирован');
    }

    return {
      userId: user.id,
      sessionId: session.id,
      labId: membership.labId,
      role: membership.role,
      isSuperAdmin: false,
    };
  }
}
