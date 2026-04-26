import { Injectable, BadRequestException } from '@nestjs/common';

export type EmailType = 'BOOKING_CONFIRMATION' | 'REMINDER' | 'CANCELLATION' | 'REVIEW_REQUEST';

export interface EmailData {
  appointmentId: string;
  clientName: string;
  clientEmail: string;
  barberName: string;
  serviceName: string;
  dateTime: Date;
  totalPrice: number;
}

export interface SendEmailResult {
  success: boolean;
  sentAt?: Date;
  scheduledFor?: Date;
  content?: string;
}

export interface QueueEmailResult {
  queued: boolean;
  scheduledFor?: Date;
}

// Simple in-memory queue for dev
const emailQueue: Array<{ template: EmailType; data: EmailData; scheduledAt: Date }> = [];

@Injectable()
export class NotificationsService {
  async sendBookingConfirmation(data: EmailData): Promise<SendEmailResult> {
    if (!data.clientEmail || !data.clientEmail.includes('@')) {
      throw new BadRequestException('Invalid email address');
    }

    // Mock email content
    const content = `
      Prezado(a) ${data.clientName},

      Seu agendamento foi confirmado!

      Serviço: ${data.serviceName}
      Barbeiro: ${data.barberName}
      Data/Hora: ${data.dateTime.toLocaleString('pt-BR')}
      Valor: R$ ${data.totalPrice.toFixed(2)}

      Aguardamos sua visita!
    `.trim();

    // Log in dev mode
    console.log('[Email - BOOKING_CONFIRMATION]', content);

    return {
      success: true,
      sentAt: new Date(),
      content,
    };
  }

  async sendReminder(data: EmailData): Promise<SendEmailResult> {
    // Don't send if appointment is cancelled
    if (data.appointmentId.startsWith('cancelled-')) {
      return { success: false };
    }

    const reminderTime = new Date(data.dateTime.getTime() - 24 * 60 * 60 * 1000);
    const content = `
      Prezado(a) ${data.clientName},

      Lembramos que você tem um agendamento amanhã!

      Serviço: ${data.serviceName}
      Barbeiro: ${data.barberName}
      Data/Hora: ${data.dateTime.toLocaleString('pt-BR')}

      Até lá!
    `.trim();

    console.log('[Email - REMINDER]', content);

    return {
      success: true,
      sentAt: new Date(),
      scheduledFor: reminderTime,
      content,
    };
  }

  async sendCancellation(data: EmailData): Promise<SendEmailResult> {
    const content = `
      Prezado(a) ${data.clientName},

      Seu agendamento foi cancelado.

      Serviço: ${data.serviceName}
      Data/Hora: ${data.dateTime.toLocaleString('pt-BR')}

      Em caso de dúvida sobre reembolso, entre em contato conosco.

      Atenciosamente,
      Seven7Barber
    `.trim();

    console.log('[Email - CANCELLATION]', content);

    return {
      success: true,
      sentAt: new Date(),
      content,
    };
  }

  async sendReviewRequest(data: EmailData): Promise<SendEmailResult> {
    const reviewLink = `https://seven7barber.com/review/${data.appointmentId}`;
    const content = `
      Prezado(a) ${data.clientName},

      Como foi sua experiência com a Avaliação?

      Avalie nosso serviço: ${reviewLink}

      Sua opinião é muito importante para nós!

      Atenciosamente,
      Seven7Barber
    `.trim();

    console.log('[Email - REVIEW_REQUEST]', content);

    return {
      success: true,
      sentAt: new Date(),
      content,
    };
  }

  async queueEmail(template: EmailType, data: EmailData, delay?: number): Promise<QueueEmailResult> {
    const scheduledAt = new Date(Date.now() + (delay || 0));
    emailQueue.push({ template, data, scheduledAt });

    return {
      queued: true,
      scheduledFor: scheduledAt,
    };
  }
}
