export enum RecurrencePattern {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum RecurrenceStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface RecurringPattern {
  id: string;
  userId: string;
  serviceId: string;
  barberId: string;
  locationId: string;
  pattern: RecurrencePattern;
  preferredTime: string; // HH:mm format
  preferredDay?: number; // For monthly: 1-31
  maxInstances: number;
  currentInstanceCount: number;
  noShowCount: number;
  status: RecurrenceStatus;
  nextRunDate?: Date;
  lastRunDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedAppointment {
  dateTime: Date;
  source: 'recurring';
  recurringPatternId: string;
}