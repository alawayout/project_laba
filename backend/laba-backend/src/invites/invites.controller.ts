import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InvitesService } from './invites.service';

@ApiTags('invites')
@ApiBearerAuth()
@Roles('OWNER', 'ADMIN')
@Controller('labs/:labId/invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

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
    this.assertSameLab(labId, user);
    return this.invitesService.createInvite(labId, dto, user);
  }

  @ApiOperation({
    summary: 'Список приглашений лабы',
    description:
      'Все приглашения (в т.ч. уже принятые/истёкшие/отозванные) с текущим статусом. ' +
      'Для ещё не истёкших PENDING дополнительно возвращается ссылка-приглашение (acceptUrl).',
  })
  @Get()
  list(@Param('labId') labId: string, @CurrentUser() user: AuthenticatedUser) {
    this.assertSameLab(labId, user);
    return this.invitesService.listInvites(labId);
  }

  @ApiOperation({
    summary: 'Отозвать приглашение',
    description: 'Отменяет ещё не принятое приглашение (PENDING → REVOKED). Ссылка перестаёт работать.',
  })
  @Delete(':inviteId')
  revoke(
    @Param('labId') labId: string,
    @Param('inviteId') inviteId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    this.assertSameLab(labId, user);
    return this.invitesService.revokeInvite(labId, inviteId, user);
  }

  // Владелец/админ может управлять приглашениями только своей лабы — сверяем
  // с labId из JWT, а не с тем, что пришло в URL (иначе можно подставить чужую лабу).
  private assertSameLab(labId: string, user: AuthenticatedUser) {
    if (user.labId !== labId) {
      throw new ForbiddenException('Нет доступа к этой лаборатории');
    }
  }
}
