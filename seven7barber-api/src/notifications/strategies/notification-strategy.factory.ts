import { Injectable, BadRequestException } from '@nestjs/common';
import { NotificationTemplateType } from '../interfaces/notification.interface';
import { NotificationStrategy } from './notification.strategy';
import { CancellationNotificationStrategy } from './cancellation-notification.strategy';
import { AlterationNotificationStrategy } from './alteration-notification.strategy';
import { ReminderNotificationStrategy } from './reminder-notification.strategy';

@Injectable()
export class NotificationStrategyFactory {
  private readonly strategies: Map<
    NotificationTemplateType,
    NotificationStrategy
  >;

  constructor(
    private readonly cancellationStrategy: CancellationNotificationStrategy,
    private readonly alterationStrategy: AlterationNotificationStrategy,
    private readonly reminderStrategy: ReminderNotificationStrategy,
  ) {
    this.strategies = new Map<NotificationTemplateType, NotificationStrategy>([
      [
        NotificationTemplateType.CANCELLATION,
        this.cancellationStrategy,
      ],
      [
        NotificationTemplateType.ALTERATION,
        this.alterationStrategy,
      ],
      [
        NotificationTemplateType.REMINDER_2H,
        this.reminderStrategy,
      ],
    ]);
  }

  getStrategy(
    templateType: NotificationTemplateType,
  ): NotificationStrategy {
    const strategy = this.strategies.get(templateType);
    if (!strategy) {
      throw new BadRequestException(
        `Unsupported notification template: ${templateType}`,
      );
    }
    return strategy;
  }
}
