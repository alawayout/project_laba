import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { RemoveEmployeeDto } from './dto/remove-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

/**
 * CRUD сотрудников лабы. Доступно только OWNER/ADMIN (RolesGuard режет
 * TECHNICIAN ещё до контроллера). labId всегда сверяется с JWT, а не
 * берётся из URL как есть — иначе можно подставить чужую лабу.
 */
@ApiTags('employees')
@ApiBearerAuth()
@Roles('OWNER', 'ADMIN')
@Controller('labs/:labId/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiOperation({
    summary: 'Список сотрудников лабы',
    description:
      'По умолчанию — только активные/заблокированные (без мягко удалённых). ' +
      '?includeRemoved=true добавляет уволенных сотрудников (архив) с отметкой кто/когда удалил.',
  })
  @Get()
  list(
    @Param('labId') labId: string,
    @Query('includeRemoved') includeRemoved: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    this.assertSameLab(labId, user);
    return this.employeesService.listEmployees(labId, includeRemoved === 'true');
  }

  @ApiOperation({ summary: 'Карточка сотрудника (в т.ч. уволенного)' })
  @Get(':userId')
  get(
    @Param('labId') labId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    this.assertSameLab(labId, user);
    return this.employeesService.getEmployee(labId, userId);
  }

  @ApiOperation({
    summary: 'История членства сотрудника',
    description: 'Кто и когда менял роль/статус, увольнял, восстанавливал — последние 100 записей.',
  })
  @Get(':userId/history')
  history(
    @Param('labId') labId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    this.assertSameLab(labId, user);
    return this.employeesService.getEmployeeHistory(labId, userId);
  }

  @ApiOperation({
    summary: 'Изменить роль и/или статус сотрудника',
    description:
      'OWNER управляет ADMIN и TECHNICIAN, ADMIN — только TECHNICIAN. Нельзя изменить самого себя. ' +
      'Роль OWNER недостижима ни как цель, ни как назначаемое значение.',
  })
  @Patch(':userId')
  update(
    @Param('labId') labId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateEmployeeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    this.assertSameLab(labId, user);
    return this.employeesService.updateEmployee(labId, userId, dto, user);
  }

  @ApiOperation({
    summary: 'Уволить сотрудника (мягкое удаление)',
    description:
      'Строка членства не стирается — помечается deletedAt/deletedById, сессии отзываются. ' +
      'История и связанные данные сохраняются, доступно восстановление. Нельзя удалить самого себя или владельца.',
  })
  @Delete(':userId')
  remove(
    @Param('labId') labId: string,
    @Param('userId') userId: string,
    @Body() dto: RemoveEmployeeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    this.assertSameLab(labId, user);
    return this.employeesService.removeEmployee(labId, userId, dto, user);
  }

  @ApiOperation({
    summary: 'Восстановить уволенного сотрудника',
    description: 'Снимает мягкое удаление, возвращает статус ACTIVE, роль сохраняется прежней.',
  })
  @Post(':userId/restore')
  restore(
    @Param('labId') labId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    this.assertSameLab(labId, user);
    return this.employeesService.restoreEmployee(labId, userId, user);
  }

  private assertSameLab(labId: string, user: AuthenticatedUser) {
    if (user.labId !== labId) {
      throw new ForbiddenException('Нет доступа к этой лаборатории');
    }
  }
}
