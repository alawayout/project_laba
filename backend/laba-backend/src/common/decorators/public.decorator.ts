import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Помечает эндпоинт как не требующий JWT (login, refresh, accept-invite, health). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
