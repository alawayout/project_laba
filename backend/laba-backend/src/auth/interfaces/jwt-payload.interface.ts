import { LabRole } from '../../../generated/prisma/client.js';

/**
 * Полезная нагрузка access-токена.
 * Для сотрудников лабы заполнены labId/role. Для платформенного
 * администратора (isSuperAdmin) лаба отсутствует.
 */
export interface JwtPayload {
  /** userId */
  sub: string;
  /** id сессии (для отзыва/блокировки) */
  sid: string;
  labId?: string;
  role?: LabRole;
  isSuperAdmin?: boolean;
}

/** То, что оседает в req.user после прохождения JwtAuthGuard. */
export interface AuthenticatedUser {
  userId: string;
  sessionId: string;
  labId?: string;
  role?: LabRole;
  isSuperAdmin: boolean;
}
