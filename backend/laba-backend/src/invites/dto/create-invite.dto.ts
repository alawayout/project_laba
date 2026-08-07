import { IsEmail, IsIn } from 'class-validator';
import { LabRole } from '../../../generated/prisma/client.js';

export class CreateInviteDto {
  @IsEmail()
  email!: string;

  @IsIn(['ADMIN', 'TECHNICIAN'] satisfies LabRole[])
  role!: Extract<LabRole, 'ADMIN' | 'TECHNICIAN'>;
}
