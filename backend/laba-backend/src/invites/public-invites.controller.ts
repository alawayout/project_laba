import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { InvitesService } from './invites.service';

@ApiTags('invites')
@Controller('public/invites')
export class PublicInvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Public()
  @ApiOperation({
    summary: 'Информация об инвайте',
    description:
      'Публичные данные для страницы принятия приглашения: email, лаба, роль, истёк ли токен ' +
      'и есть ли уже аккаунт с этим email (чтобы фронт понял, нужна ли форма пароля).',
  })
  @Get(':token')
  getInviteInfo(@Param('token') token: string) {
    return this.invitesService.getInviteInfo(token);
  }

  @Public()
  @ApiOperation({
    summary: 'Принять приглашение',
    description:
      'Публичный эндпоинт по ссылке из письма-приглашения. Если email ещё не зарегистрирован — ' +
      'создаёт аккаунт (нужны password/firstName/lastName), иначе просто добавляет членство в лабу ' +
      'существующему пользователю. Сразу возвращает access/refresh токены (авто-логин). ' +
      'Блокируется, если подписка лабы неактивна.',
  })
  @HttpCode(HttpStatus.OK)
  @Post(':token/accept')
  acceptInvite(
    @Param('token') token: string,
    @Body() dto: AcceptInviteDto,
    @Req() req: Request,
  ) {
    return this.invitesService.acceptInvite(token, dto, {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
  }
}
