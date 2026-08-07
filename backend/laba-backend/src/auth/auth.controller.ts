import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from './interfaces/jwt-payload.interface';
import { AuthService } from './auth.service';
import { SwitchLabDto } from './dto/switch-lab.dto';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Переключение между лабами',
    description:
      'Для владельцев с несколькими лабами: выпускает новую пару токенов для другой лабы, ' +
      'в которой у пользователя есть активное членство и активная подписка.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('switch-lab')
  switchLab(@CurrentUser() user: AuthenticatedUser, @Body() dto: SwitchLabDto, @Req() req: Request) {
    return this.authService.switchLab(user.userId, dto.labId, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
  }

  @ApiOperation({
    summary: 'Выход из текущей сессии',
    description: 'Отзывает refresh-сессию, привязанную к переданному access-токену.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@CurrentUser() user: AuthenticatedUser) {
    await this.authService.logout(user.sessionId);
  }

  @ApiOperation({
    summary: 'Выход из всех сессий',
    description: 'Отзывает все активные сессии пользователя — на всех устройствах и во всех лабах.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout-all')
  async logoutAll(@CurrentUser() user: AuthenticatedUser) {
    await this.authService.logoutAll(user.userId);
  }
}
