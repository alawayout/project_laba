import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { SuperAdminGuard } from './common/guards/super-admin.guard';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { InvitesModule } from './invites/invites.module';
import { LabsModule } from './labs/labs.module';
import { SetupModule } from './setup/setup.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    LabsModule,
    EmployeesModule,
    InvitesModule,
    SubscriptionsModule,
    UsersModule,
    SetupModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Порядок важен: сначала аутентификация, затем проверка ролей/суперадмина.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: SuperAdminGuard },
  ],
})
export class AppModule {}
