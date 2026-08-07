import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { SetupService } from './setup.service';

@ApiTags('setup')
@Controller('public/setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Public()
  @ApiOperation({
    summary: 'Статус первичной инициализации',
    description:
      'Проверка, создан ли уже платформенный администратор. Фронт дёргает это при заходе ' +
      'на дашборд и, если false, редиректит на страницу создания суперадмина.',
  })
  @Get('status')
  getStatus() {
    return this.setupService.getStatus();
  }

  @Public()
  @ApiOperation({
    summary: 'Создать первого платформенного администратора',
    description:
      'Одноразовый бутстрап без seed-скриптов: работает только пока в системе нет ни одного ' +
      'суперадмина, дальше навсегда возвращает 403. Сразу логинит созданного администратора ' +
      '(возвращает access/refresh токены).',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() dto: CreateSuperAdminDto, @Req() req: Request) {
    return this.setupService.createFirstSuperAdmin(dto, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
  }
}
