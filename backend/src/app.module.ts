import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { CalendarModule } from './calendar/calendar.module';
import { QuadrantModule } from './quadrant/quadrant.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ThrottleGuard } from './common/guards/throttle.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate, validateSecurityConfig } from './common/config/env.validation';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // 数据库模块
    PrismaModule,

    // 功能模块
    AuthModule,
    TasksModule,
    CalendarModule,
    QuadrantModule,
    HealthModule,
    UsersModule,
    TimeEntriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // 全局守卫
    {
      provide: APP_GUARD,
      useClass: ThrottleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}