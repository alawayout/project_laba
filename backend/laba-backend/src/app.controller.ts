import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { AppService } from './app.service';

@ApiTags('public')
@Controller('public')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @ApiOperation({
    summary: 'Проверка живости сервиса',
    description:
      'Health-check без авторизации — используется docker/оркестратором, чтобы понять, что бэкенд поднялся и отвечает.',
  })
  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }
}
