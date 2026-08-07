import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('public/auth')
export class PublicAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'Вход в систему',
    description:
      'Логин по email/паролю. Без labId — вход как сотрудник лабы (если она одна) либо как платформенный администратор. ' +
      'Если у пользователя несколько активных лаб и labId не передан, вместо токенов вернётся список лаб на выбор — ' +
      'нужно повторить запрос, указав labId.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
  }

  @Public()
  @ApiOperation({
    summary: 'Обновление токенов',
    description:
      'Ротация пары токенов по действующему refresh-токену: старая сессия отзывается, выпускается новая. ' +
      'Если сессия отозвана (логаут, блокировка, истёкшая подписка) — вернёт 401.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    return this.authService.refresh(dto.refreshToken, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
  }
}
