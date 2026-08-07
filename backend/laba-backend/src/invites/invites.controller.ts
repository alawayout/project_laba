import { Body, Controller, ForbiddenException, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InvitesService } from './invites.service';

@ApiTags('invites')
@ApiBearerAuth()
@Controller('labs/:labId/invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Roles('OWNER', 'ADMIN')
  @ApiOperation({
    summary: 'Пригласить сотрудника в лабу',
    description:
      'OWNER может пригласить ADMIN или TECHNICIAN, ADMIN — только TECHNICIAN. ' +
      'Требует активной подписки лабы (в TRIALING/ACTIVE). Возвращает ссылку-приглашение с токеном.',
  })
  @Post()
  createInvite(
    @Param('labId') labId: string,
    @Body() dto: CreateInviteDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Владелец/админ может приглашать только в свою лабу — сверяем с labId из JWT,
    // а не с тем, что пришло в URL (иначе можно было бы подставить чужой labId).
    if (user.labId !== labId) {
      throw new ForbiddenException('Нет доступа к этой лаборатории');
    }
    return this.invitesService.createInvite(user.labId, dto, user);
  }
}
