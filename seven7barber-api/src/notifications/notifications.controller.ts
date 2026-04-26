import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService, EmailType, EmailData } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  async sendEmail(
    @Body()
    body: {
      template: EmailType;
      data: EmailData;
    },
  ) {
    const { template, data } = body;

    switch (template) {
      case 'BOOKING_CONFIRMATION':
        return this.notificationsService.sendBookingConfirmation(data);
      case 'REMINDER':
        return this.notificationsService.sendReminder(data);
      case 'CANCELLATION':
        return this.notificationsService.sendCancellation(data);
      case 'REVIEW_REQUEST':
        return this.notificationsService.sendReviewRequest(data);
      default:
        return { success: false, error: 'Unknown template' };
    }
  }
}
