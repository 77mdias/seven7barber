import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WaitlistStatus } from './interfaces/waitlist.interface';

const WAITLIST_CONFIG = {
  maxNotified: 3,
  notificationTimeoutMs: 30 * 60 * 1000, // 30 minutes
  holdDurationMs: 5 * 60 * 1000, // 5 minutes
};

@Injectable()
export class WaitlistService {
  constructor(private prisma: PrismaService) {}

  async joinWaitlist(
    userId: string,
    queueKey: string,
    preferredDate: Date,
  ): Promise<{ id: string; position: number; status: WaitlistStatus }> {
    // Check for existing active entry
    const existing = await this.prisma.waitlistEntry.findFirst({
      where: {
        userId,
        status: { in: [WaitlistStatus.WAITING, WaitlistStatus.NOTIFIED] },
      },
    });

    if (existing) {
      throw new ConflictException('User already in this waitlist queue');
    }

    // Parse queueKey: locationId:serviceId:barberId
    const [locationId, serviceId, barberId] = queueKey.split(':');

    // Count current entries to assign position
    const count = await this.prisma.waitlistEntry.count({
      where: {
        locationId,
        serviceId,
        barberId,
        status: { in: [WaitlistStatus.WAITING, WaitlistStatus.NOTIFIED] },
      },
    });

    const entry = await this.prisma.waitlistEntry.create({
      data: {
        userId,
        locationId,
        serviceId,
        barberId,
        preferredDate,
        position: count + 1,
        status: WaitlistStatus.WAITING,
      },
    });

    return { id: entry.id, position: entry.position, status: entry.status };
  }

  async leaveWaitlist(entryId: string, userId: string): Promise<void> {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      throw new NotFoundException('Waitlist entry not found');
    }

    if (entry.userId !== userId) {
      throw new BadRequestException('Not authorized to cancel this entry');
    }

    if (entry.status === WaitlistStatus.CONFIRMED) {
      throw new BadRequestException('Cannot cancel a confirmed booking');
    }

    await this.prisma.waitlistEntry.update({
      where: { id: entryId },
      data: { status: WaitlistStatus.CANCELLED },
    });
  }

  async notifyTopWhenSlotOpens(queueKey: string): Promise<string[]> {
    const [locationId, serviceId, barberId] = queueKey.split(':');

    const waitingEntries = await this.prisma.waitlistEntry.findMany({
      where: {
        locationId,
        serviceId,
        barberId,
        status: WaitlistStatus.WAITING,
      },
      orderBy: { position: 'asc' },
      take: WAITLIST_CONFIG.maxNotified,
    });

    if (waitingEntries.length === 0) {
      return [];
    }

    const notifiedIds: string[] = [];
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + WAITLIST_CONFIG.notificationTimeoutMs,
    );

    for (const entry of waitingEntries) {
      await this.prisma.waitlistEntry.update({
        where: { id: entry.id },
        data: {
          status: WaitlistStatus.NOTIFIED,
          notifiedAt: now,
          expiresAt,
        },
      });
      notifiedIds.push(entry.id);
    }

    return notifiedIds;
  }

  async notifyUser(entryId: string): Promise<void> {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry || entry.status !== WaitlistStatus.WAITING) {
      return;
    }

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + WAITLIST_CONFIG.notificationTimeoutMs,
    );

    await this.prisma.waitlistEntry.update({
      where: { id: entryId },
      data: {
        status: WaitlistStatus.NOTIFIED,
        notifiedAt: now,
        expiresAt,
      },
    });
  }

  async handleExpiration(entryId: string): Promise<void> {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry || entry.status !== WaitlistStatus.NOTIFIED) {
      return;
    }

    // Check if expired
    if (entry.expiresAt && entry.expiresAt > new Date()) {
      return; // Not yet expired
    }

    // Mark as expired
    await this.prisma.waitlistEntry.update({
      where: { id: entryId },
      data: { status: WaitlistStatus.EXPIRED },
    });

    // Notify next user
    const queueKey = `${entry.locationId}:${entry.serviceId}:${entry.barberId}`;
    await this.notifyTopWhenSlotOpens(queueKey);
  }

  async confirmFromWaitlist(
    entryId: string,
    slotDateTime: Date,
  ): Promise<{ status: WaitlistStatus }> {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      throw new NotFoundException('Waitlist entry not found');
    }

    if (entry.status !== WaitlistStatus.NOTIFIED) {
      throw new BadRequestException('Entry is not in notified status');
    }

    if (entry.expiresAt && entry.expiresAt < new Date()) {
      throw new BadRequestException('Notification window has expired');
    }

    await this.prisma.waitlistEntry.update({
      where: { id: entryId },
      data: { status: WaitlistStatus.CONFIRMED },
    });

    // In production, create the appointment here
    // await this.appointmentService.createFromWaitlist(entry, slotDateTime);

    return { status: WaitlistStatus.CONFIRMED };
  }

  async handleSlotCancellation(
    appointmentId: string,
  ): Promise<{ holdStatus: string; holdDurationMs: number }> {
    // Hold slot for waitlist first (5 min), then release to general availability
    // In production, would mark slot as WAITLIST_HOLD temporarily

    return {
      holdStatus: 'WAITLIST_HOLD',
      holdDurationMs: WAITLIST_CONFIG.holdDurationMs,
    };
  }

  async getQueuePosition(
    userId: string,
    queueKey: string,
  ): Promise<number | null> {
    const [locationId, serviceId, barberId] = queueKey.split(':');

    const entry = await this.prisma.waitlistEntry.findFirst({
      where: {
        userId,
        locationId,
        serviceId,
        barberId,
        status: { in: [WaitlistStatus.WAITING, WaitlistStatus.NOTIFIED] },
      },
      orderBy: { position: 'asc' },
    });

    return entry?.position || null;
  }
}
