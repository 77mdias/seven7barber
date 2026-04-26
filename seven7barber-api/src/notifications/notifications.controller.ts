import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  NotificationsService,
  EmailType,
  EmailData,
} from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
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
