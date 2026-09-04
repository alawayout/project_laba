import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateLabDto {
  @IsString()
  @MinLength(2)
  labName!: string;

  /**
   * Не выведено в UI — "тариф" пока ни на что в бэке не влияет (доступ к
   * лабе решают только status/expiresAt подписки, см. AuthService).
   * Оставлено опциональным полем API на будущее; по умолчанию — DEFAULT_PLAN.
   */
  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  trialDays?: number;

  @IsEmail()
  ownerEmail!: string;

  @IsString()
  ownerFirstName!: string;

  @IsString()
  ownerLastName!: string;
}
