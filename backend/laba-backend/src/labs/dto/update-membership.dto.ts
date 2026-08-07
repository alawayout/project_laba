import { IsIn } from 'class-validator';

export class UpdateMembershipDto {
  @IsIn(['ACTIVE', 'BLOCKED'])
  status!: 'ACTIVE' | 'BLOCKED';
}
