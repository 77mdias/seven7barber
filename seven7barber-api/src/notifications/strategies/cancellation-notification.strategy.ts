import { Injectable } from '@nestjs/common';
import { NotificationTemplateType } from '../interfaces/notification.interface';
import {
  NotificationStrategy,
  NotificationContext,
} from './notification.strategy';

@Injectable()
export class CancellationNotificationStrategy
  implements NotificationStrategy
{
  readonly templateType = NotificationTemplateType.CANCELLATION;

  buildMessage(context: NotificationContext): string {
    const { appointment, user } = context;
    return `Olá ${user.name}, sua marcação de ${
      appointment.service?.name || appointment.serviceName || 'Serviço'
    } foi cancelada. Data: ${new Date(
      appointment.dateTime,
    ).toLocaleString('pt-BR')}. Em caso de dúvidas, entre em contato.`;
  }
}
