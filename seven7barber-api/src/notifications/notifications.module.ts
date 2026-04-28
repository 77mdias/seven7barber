import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { HttpModule } from '@nestjs/axios';
import { CancellationNotificationStrategy } from './strategies/cancellation-notification.strategy';
import { AlterationNotificationStrategy } from './strategies/alteration-notification.strategy';
import { ReminderNotificationStrategy } from './strategies/reminder-notification.strategy';
import { NotificationStrategyFactory } from './strategies/notification-strategy.factory';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    CancellationNotificationStrategy,
    AlterationNotificationStrategy,
    ReminderNotificationStrategy,
    NotificationStrategyFactory,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
