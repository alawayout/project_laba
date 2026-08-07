import { SetMetadata } from '@nestjs/common';
import { LabRole } from '../../../generated/prisma/client.js';

export const ROLES_KEY = 'roles';

/** Ограничивает доступ к обработчику ролями в контексте текущей лабы. */
export const Roles = (...roles: LabRole[]) => SetMetadata(ROLES_KEY, roles);
