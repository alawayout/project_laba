import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  /**
   * Нужен, если у пользователя несколько активных лабораторий —
   * без него при неоднозначности сервер вернёт список лаб на выбор.
   */
  @IsOptional()
  @IsString()
  labId?: string;
}
