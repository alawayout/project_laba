import { IsOptional, IsString, MaxLength } from 'class-validator';

/** Причина увольнения — попадает в историю (MembershipEvent), опциональна. */
export class RemoveEmployeeDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
