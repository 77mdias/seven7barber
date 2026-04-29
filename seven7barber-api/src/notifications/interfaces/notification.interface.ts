export enum NotificationChannel {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

export enum NotificationTemplateType {
  CANCELLATION = 'CANCELLATION',
  ALTERATION = 'ALTERATION',
  REMINDER_2H = 'REMINDER_2H',
}

export interface NotificationTemplate {
  type: NotificationTemplateType;
  channel: NotificationChannel;
  variables: string[];
  content: string;
}

export interface NotificationPayload {
  userId: string;
  appointmentId: string;
  template: NotificationTemplateType;
  variables: Record<string, string>;
  phone: string;
}

export interface DeliveryReceipt {
  externalId: string;
  status: NotificationStatus;
  timestamp: Date;
  errorCode?: string;
  errorMessage?: string;
}

export interface NotificationLogEntry {
  id: string;
  userId: string;
  appointmentId: string;
  channel: NotificationChannel;
  template: NotificationTemplateType;
  status: NotificationStatus;
  externalId?: string;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
  errorMessage?: string;
}
