import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  NotificationChannel,
  NotificationStatus,
  NotificationTemplateType,
  DeliveryReceipt,
  NotificationLogEntry,
} from './interfaces/notification.interface';

const RETRY_CONFIG = {
  maxAttempts: 3,
  backoffMs: [60000, 300000, 900000], // 1min, 5min, 15min
};

const WHATSAPP_TEMPLATES = {
  [NotificationTemplateType.CANCELLATION]: {
    content: 'Olá {{clientName}}, sua marcação de {{serviceName}} foi cancelada. Data: {{dateTime}}. Em caso de dúvidas, entre em contato.',
    variables: ['clientName', 'serviceName', 'dateTime'],
  },
  [NotificationTemplateType.ALTERATION]: {
    content: 'Olá {{clientName}}, sua marcação de {{serviceName}} foi alterada. Nova hora: {{newTime}}. Anterior: {{oldTime}}.',
    variables: ['clientName', 'serviceName', 'newTime', 'oldTime'],
  },
  [NotificationTemplateType.REMINDER_2H]: {
    content: 'Olá {{clientName}}, lembrete: sua marcação de {{serviceName}} é em 2 horas ({{dateTime}}) na {{locationName}}. Nos vemos lá!',
    variables: ['clientName', 'serviceName', 'dateTime', 'locationName'],
  },
};

@Injectable()
export class NotificationsService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async sendCancellationNotification(
    appointment: any,
    user: { id: string; name: string; phone: string; whatsappOptIn: boolean },
  ): Promise<{ status: NotificationStatus; message?: string; externalId?: string }> {
    // Check opt-out
    if (!user.whatsappOptIn) {
      await this.logNotification({
        userId: user.id,
        appointmentId: appointment.id,
        channel: NotificationChannel.WHATSAPP,
        template: NotificationTemplateType.CANCELLATION,
        status: NotificationStatus.SKIPPED,
        attempts: 0,
      });
      return { status: NotificationStatus.SKIPPED };
    }

    const message = this.interpolateTemplate(
      NotificationTemplateType.CANCELLATION,
      {
        clientName: user.name,
        serviceName: appointment.service?.name || appointment.serviceName || 'Serviço',
        dateTime: new Date(appointment.dateTime).toLocaleString('pt-BR'),
      },
    );

    return this.sendWhatsAppWithRetry(user.phone, message, appointment.id);
  }

  async sendAlterationNotification(
    appointment: any,
    user: { id: string; name: string; phone: string; whatsappOptIn: boolean },
    oldDateTime: Date,
    newDateTime: Date,
  ): Promise<{ status: NotificationStatus; message: string; externalId?: string }> {
    if (!user.whatsappOptIn) {
      return { status: NotificationStatus.SKIPPED, message: '' };
    }

    const message = this.interpolateTemplate(
      NotificationTemplateType.ALTERATION,
      {
        clientName: user.name,
        serviceName: appointment.service?.name || appointment.serviceName || 'Serviço',
        oldTime: oldDateTime.toLocaleString('pt-BR'),
        newTime: newDateTime.toLocaleString('pt-BR'),
      },
    );

    return this.sendWhatsAppWithRetry(user.phone, message, appointment.id);
  }

  async sendReminderNotification(
    appointment: any,
    user: { id: string; name: string; phone: string; whatsappOptIn: boolean },
  ): Promise<{ status: NotificationStatus; message: string; externalId?: string }> {
    if (!user.whatsappOptIn) {
      return { status: NotificationStatus.SKIPPED, message: '' };
    }

    const message = this.interpolateTemplate(
      NotificationTemplateType.REMINDER_2H,
      {
        clientName: user.name,
        serviceName: appointment.service?.name || appointment.serviceName || 'Serviço',
        dateTime: new Date(appointment.dateTime).toLocaleString('pt-BR'),
        locationName: appointment.location?.name || appointment.locationName || 'Seven7Barber',
      },
    );

    return this.sendWhatsAppWithRetry(user.phone, message, appointment.id);
  }

  private async sendWhatsAppWithRetry(
    phone: string,
    message: string,
    appointmentId: string,
    templateType: NotificationTemplateType = NotificationTemplateType.CANCELLATION,
  ): Promise<{ status: NotificationStatus; message: string; externalId?: string }> {
    let lastError: Error;

    for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
      try {
        const receipt = await this.sendTwilioWhatsApp(phone, message);

        await this.logNotification({
          userId: '', // Will be filled by caller
          appointmentId,
          channel: NotificationChannel.WHATSAPP,
          template: templateType,
          status: NotificationStatus.QUEUED,
          externalId: receipt.externalId,
          attempts: attempt + 1,
        });

        return {
          status: NotificationStatus.QUEUED,
          message,
          externalId: receipt.externalId,
        };
      } catch (error) {
        lastError = error;

        if (attempt < RETRY_CONFIG.maxAttempts - 1) {
          await this.delay(RETRY_CONFIG.backoffMs[attempt]);
        }
      }
    }

    // All retries failed
    await this.logNotification({
      userId: '',
      appointmentId,
      channel: NotificationChannel.WHATSAPP,
      template: templateType,
      status: NotificationStatus.FAILED,
      attempts: RETRY_CONFIG.maxAttempts,
      errorMessage: lastError?.message,
    });

    throw new BadRequestException(`Notification failed after ${RETRY_CONFIG.maxAttempts} attempts: ${lastError?.message}`);
  }

  private async sendTwilioWhatsApp(phone: string, message: string): Promise<DeliveryReceipt> {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const fromNumber = this.configService.get<string>('TWILIO_WHATSAPP_FROM');

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const response = await firstValueFrom(
      this.httpService.post(
        url,
        new URLSearchParams({
          To: `whatsapp:${phone}`,
          From: `whatsapp:${fromNumber}`,
          Body: message,
        }),
        {
          auth: { username: accountSid, password: authToken },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ),
    );

    return {
      externalId: response.data.sid,
      status: NotificationStatus.SENT,
      timestamp: new Date(),
    };
  }

  private interpolateTemplate(
    templateType: NotificationTemplateType,
    variables: Record<string, string>,
  ): string {
    const template = WHATSAPP_TEMPLATES[templateType];
    let content = template.content;

    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(`{{${key}}}`, value);
    }

    return content;
  }

  private async logNotification(data: {
    userId: string;
    appointmentId: string;
    channel: NotificationChannel;
    template: NotificationTemplateType;
    status: NotificationStatus;
    externalId?: string;
    attempts: number;
    errorMessage?: string;
  }): Promise<void> {
    // In production, save to Prisma. For now, log to console.
    console.log('[NotificationLog]', JSON.stringify(data));
  }

  async handleTwilioWebhook(payload: {
    MessageSid: string;
    MessageStatus: string;
    To?: string;
  }): Promise<void> {
    const statusMap: Record<string, NotificationStatus> = {
      delivered: NotificationStatus.DELIVERED,
      sent: NotificationStatus.SENT,
      queued: NotificationStatus.QUEUED,
      failed: NotificationStatus.FAILED,
      undelivered: NotificationStatus.FAILED,
    };

    const newStatus = statusMap[payload.MessageStatus] || NotificationStatus.FAILED;

    console.log(`[Twilio Webhook] Sid: ${payload.MessageSid}, Status: ${newStatus}`);

    // In production: update notification log in Prisma
    // await prisma.notificationLog.updateMany({
    //   where: { externalId: payload.MessageSid },
    //   data: { status: newStatus, updatedAt: new Date() },
    // });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Legacy email methods (kept for backward compatibility)
  async sendBookingConfirmation(data: any): Promise<{ success: boolean }> {
    console.log('[Email - BOOKING_CONFIRMATION]', data);
    return { success: true };
  }

  async sendReminder(data: any): Promise<{ success: boolean }> {
    console.log('[Email - REMINDER]', data);
    return { success: true };
  }

  async sendCancellation(data: any): Promise<{ success: boolean }> {
    console.log('[Email - CANCELLATION]', data);
    return { success: true };
  }

  async queueEmail(template: string, data: any, delay?: number): Promise<{ queued: boolean }> {
    console.log('[Email Queue]', template, data, delay);
    return { queued: true };
  }
}