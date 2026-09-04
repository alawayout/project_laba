import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateLabDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  /**
   * Название тарифного плана — произвольная строка, ни на что в бэке не
   * влияет (см. AuthService.ACTIVE_SUBSCRIPTION_STATUSES: доступ решают
   * только status/expiresAt подписки). Пока используется просто как метка
   * на карточке лабы.
   */
  @IsOptional()
  @IsString()
  plan?: string;

  /** Новая дата окончания подписки (ISO 8601) — платформенный админ продлевает/укорачивает вручную. */
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
