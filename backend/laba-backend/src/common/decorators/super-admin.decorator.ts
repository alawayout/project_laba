import { SetMetadata } from '@nestjs/common';

export const IS_SUPER_ADMIN_KEY = 'isSuperAdmin';

/** Доступ только платформенным администраторам (создание лабораторий/владельцев). */
export const SuperAdminOnly = () => SetMetadata(IS_SUPER_ADMIN_KEY, true);
