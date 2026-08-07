import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { SuperAdminOnly } from '../common/decorators/super-admin.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { LabsService } from './labs.service';

@ApiTags('labs')
@ApiBearerAuth()
@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @SuperAdminOnly()
  @ApiOperation({
    summary: 'Создать лабораторию (только платформенный админ)',
    description:
      'Создаёт лабу, пробную подписку (TRIALING) и приглашение владельцу. ' +
      'Владелец активирует аккаунт через public/invites/:token/accept.',
  })
  @Post()
  createLab(@Body() dto: CreateLabDto, @CurrentUser() user: AuthenticatedUser) {
    return this.labsService.createLab(dto, user.userId);
  }

  @ApiOperation({
    summary: 'Мои лаборатории',
    description:
      'Список лаб, где у текущего пользователя активное членство, с ролью и статусом подписки — ' +
      'для свитчера лаб на фронте.',
  })
  @Get('mine')
  getMyLabs(@CurrentUser() user: AuthenticatedUser) {
    return this.labsService.getMyLabs(user.userId);
  }

  @Roles('OWNER', 'ADMIN')
  @ApiOperation({
    summary: 'Заблокировать/разблокировать сотрудника лабы',
    description:
      'OWNER может управлять ADMIN и TECHNICIAN, ADMIN — только TECHNICIAN. ' +
      'При установке статуса BLOCKED все активные сессии сотрудника отзываются немедленно.',
  })
  @Patch(':labId/members/:userId')
  updateMemberStatus(
    @Param('labId') labId: string,
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateMembershipDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user.labId !== labId) {
      throw new ForbiddenException('Нет доступа к этой лаборатории');
    }
    return this.labsService.updateMembershipStatus(labId, targetUserId, dto.status, user);
  }
}
