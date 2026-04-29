import { Injectable } from '@nestjs/common';

export enum WaitlistStatus {
  WAITING = 'WAITING',
  NOTIFIED = 'NOTIFIED',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum WaitlistQueueKey {
  // Composite key: locationId:serviceId:barberId
}

export interface WaitlistEntry {
  id: string;
  userId: string;
  locationId: string;
  serviceId: string;
  barberId: string;
  preferredDate: Date;
  position: number;
  status: WaitlistStatus;
  notifiedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaitlistQueueConfig {
  maxNotified: number;
  notificationTimeoutMs: number;
  holdDurationMs: number;
}
