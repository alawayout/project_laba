import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Каждые 5 минут: помечаем просроченные подписки EXPIRED и отзываем
   * все активные сессии сотрудников этой лабы (блокировка входа).
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async expireOverdueSubscriptions(): Promise<void> {
    const overdue = await this.db.subscription.findMany({
      where: {
        status: { in: ['ACTIVE', 'TRIALING'] },
        expiresAt: { lt: new Date() },
      },
    });

    for (const subscription of overdue) {
      await this.db.$transaction([
        this.db.subscription.update({
          where: { id: subscription.id },
          data: { status: 'EXPIRED' },
        }),
        this.db.session.updateMany({
          where: { labId: subscription.labId, revokedAt: null },
          data: { revokedAt: new Date() },
        }),
      ]);

      this.logger.warn(
        `Подписка лаборатории ${subscription.labId} истекла — сессии отозваны`,
      );
    }
  }
}
