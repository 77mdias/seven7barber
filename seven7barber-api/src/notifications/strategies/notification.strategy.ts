import {
  NotificationTemplateType,
  NotificationStatus,
} from '../interfaces/notification.interface';

export interface NotificationSendResult {
  status: NotificationStatus;
  message?: string;
  externalId?: string;
}

export interface NotificationStrategy {
  readonly templateType: NotificationTemplateType;

  buildMessage(context: NotificationContext): string;
}

export interface NotificationContext {
  appointment: {
    id: string;
    dateTime: Date | string;
    service?: { name: string };
    serviceName?: string;
    location?: { name: string };
    locationName?: string;
  };
  user: {
    id: string;
    name: string;
    phone: string;
    whatsappOptIn: boolean;
  };
  oldDateTime?: Date;
  newDateTime?: Date;
}
