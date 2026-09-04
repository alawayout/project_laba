import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SuperAdminOnly } from '../common/decorators/super-admin.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { LabsService } from './labs.service';

/**
 * Управление сотрудниками лабы (роль/статус/увольнение/восстановление)
 * живёт в EmployeesModule (`labs/:labId/employees`) — здесь создание,
 * список/карточка, переименование и блокировка/восстановление лабы
 * (CRUD лабораторий, доступно только платформенному администратору,
 * кроме `mine` — это для свитчера лаб самого сотрудника).
 *
 * Важно: `mine` объявлен раньше `:labId`, иначе Nest/Express попытается
 * сматчить его как параметр labId.
 */
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

  @SuperAdminOnly()
  @ApiOperation({
    summary: 'Список всех лабораторий (только платформенный админ)',
    description: 'Владелец, число активных участников и статус подписки по каждой лабе.',
  })
  @Get()
  listLabs() {
    return this.labsService.listLabs();
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

  @SuperAdminOnly()
  @ApiOperation({ summary: 'Карточка лаборатории (только платформенный админ)' })
  @Get(':labId')
  getLab(@Param('labId') labId: string) {
    return this.labsService.getLabDetail(labId);
  }

  @SuperAdminOnly()
  @ApiOperation({
    summary: 'Переименовать лабу / сменить тариф (только платформенный админ)',
  })
  @Patch(':labId')
  updateLab(@Param('labId') labId: string, @Body() dto: UpdateLabDto) {
    return this.labsService.updateLab(labId, dto);
  }

  @SuperAdminOnly()
  @ApiOperation({
    summary: 'Заблокировать лабу (только платформенный админ)',
    description:
      'Мягкое удаление: подписка переводится в CANCELED, все активные сессии сотрудников ' +
      'отзываются. Сотрудники, история и приглашения не удаляются — восстановить можно через /restore.',
  })
  @Delete(':labId')
  blockLab(@Param('labId') labId: string) {
    return this.labsService.blockLab(labId);
  }

  @SuperAdminOnly()
  @ApiOperation({ summary: 'Восстановить заблокированную лабу (только платформенный админ)' })
  @Post(':labId/restore')
  restoreLab(@Param('labId') labId: string) {
    return this.labsService.restoreLab(labId);
  }
}
