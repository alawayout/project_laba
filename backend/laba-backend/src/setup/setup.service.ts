import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService, TokenPair } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';

@Injectable()
export class SetupService {
  constructor(
    private readonly db: DatabaseService,
    private readonly authService: AuthService,
  ) {}

  /** Нужен ли ещё первичный бутстрап (нет ни одного платформенного админа). */
  async getStatus(): Promise<{ initialized: boolean }> {
    const count = await this.db.user.count({ where: { isSuperAdmin: true } });
    return { initialized: count > 0 };
  }

  /**
   * Создаёт первого платформенного администратора. Работает только один раз —
   * как только в системе есть хотя бы один суперадмин, эндпоинт навсегда
   * закрывается (даже если этот аккаунт потом удалят/заблокируют).
   */
  async createFirstSuperAdmin(
    dto: CreateSuperAdminDto,
    meta: { userAgent?: string; ip?: string },
  ): Promise<TokenPair> {
    const { initialized } = await this.getStatus();
    if (initialized) {
      throw new ForbiddenException(
        'Платформенный администратор уже создан, повторная инициализация недоступна',
      );
    }

    const passwordHash = await this.authService.hashPassword(dto.password);
    const user = await this.db.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        isSuperAdmin: true,
      },
    });

    return this.authService.issueTokens(user.id, { isSuperAdmin: true }, meta);
  }
}
