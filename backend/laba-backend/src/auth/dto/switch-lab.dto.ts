import { IsString } from 'class-validator';

export class SwitchLabDto {
  @IsString()
  labId!: string;
}
