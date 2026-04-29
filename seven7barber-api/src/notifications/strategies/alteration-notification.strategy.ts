import { Injectable } from '@nestjs/common';
import { NotificationTemplateType } from '../interfaces/notification.interface';
import {
  NotificationStrategy,
  NotificationContext,
} from './notification.strategy';

@Injectable()
export class AlterationNotificationStrategy
  implements NotificationStrategy
{
  readonly templateType = NotificationTemplateType.ALTERATION;

  buildMessage(context: NotificationContext): string {
    const { appointment, user, oldDateTime, newDateTime } = context;
    return `Olá ${user.name}, sua marcação de ${
      appointment.service?.name || appointment.serviceName || 'Serviço'
    } foi alterada. Nova hora: ${newDateTime?.toLocaleString(
      'pt-BR',
    )}. Anterior: ${oldDateTime?.toLocaleString('pt-BR')}.`;
  }
}
