import { Injectable } from '@nestjs/common';
import { NotificationTemplateType } from '../interfaces/notification.interface';
import {
  NotificationStrategy,
  NotificationContext,
} from './notification.strategy';

@Injectable()
export class ReminderNotificationStrategy
  implements NotificationStrategy
{
  readonly templateType = NotificationTemplateType.REMINDER_2H;

  buildMessage(context: NotificationContext): string {
    const { appointment, user } = context;
    return `Olá ${user.name}, lembrete: sua marcação de ${
      appointment.service?.name || appointment.serviceName || 'Serviço'
    } é em 2 horas (${new Date(
      appointment.dateTime,
    ).toLocaleString('pt-BR')}) na ${
      appointment.location?.name ||
      appointment.locationName ||
      'Seven7Barber'
    }. Nos vemos lá!`;
  }
}
