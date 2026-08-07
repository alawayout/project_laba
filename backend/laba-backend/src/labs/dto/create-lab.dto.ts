import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateLabDto {
  @IsString()
  @MinLength(2)
  labName!: string;

  @IsString()
  plan!: string;

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
