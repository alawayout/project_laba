import { IsIn, IsOptional } from 'class-validator';
import { LabRole, MembershipStatus } from '../../../generated/prisma/client.js';

/**
 * Частичное обновление сотрудника: роль и/или статус (блокировка).
 * OWNER здесь недостижим намеренно — назначить или снять роль владельца
 * через этот эндпоинт нельзя.
 */
export class UpdateEmployeeDto {
  @IsOptional()
  @IsIn(['ADMIN', 'TECHNICIAN'] satisfies LabRole[])
  role?: Extract<LabRole, 'ADMIN' | 'TECHNICIAN'>;

  @IsOptional()
  @IsIn(['ACTIVE', 'BLOCKED'] satisfies MembershipStatus[])
  status?: MembershipStatus;
}
