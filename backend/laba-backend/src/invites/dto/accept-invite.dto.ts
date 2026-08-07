import { IsOptional, IsString, MinLength } from 'class-validator';

export class AcceptInviteDto {
  /** Обязателен только если под этим email ещё нет аккаунта. */
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
