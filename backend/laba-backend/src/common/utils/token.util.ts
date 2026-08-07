import { randomBytes } from 'crypto';

/** Криптостойкий случайный токен для инвайтов/refresh-секретов. */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}
