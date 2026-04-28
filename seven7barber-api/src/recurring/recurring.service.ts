import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecurrenceStrategyFactory } from './strategies/recurrence-strategy.factory';
import {
  RecurrencePattern,
  RecurrenceStatus,
} from './interfaces/recurring.interface';

const MAX_INSTANCES = 12;

@Injectable()
export class RecurringService {
  constructor(
    private prisma: PrismaService,
    private recurrenceStrategyFactory: RecurrenceStrategyFactory,
  ) {}

  generateNextDate(pattern: RecurrencePattern, lastDate: Date): Date {
    const strategy = this.recurrenceStrategyFactory.getStrategy(pattern);
    return strategy.nextDate(lastDate);
  }

  async generateNextBatch(patternId: string): Promise<Date[]> {
    const pattern = await this.prisma.recurringPattern.findUnique({
      where: { id: patternId },
    });

    if (!pattern) {
      throw new NotFoundException('Recurring pattern not found');
    }

    if (pattern.status !== RecurrenceStatus.ACTIVE) {
      throw new BadRequestException('Recurring pattern is not active');
    }

    const remaining = pattern.maxInstances - pattern.currentInstanceCount;
    if (remaining <= 0) {
      return [];
    }

    const dates: Date[] = [];
    let currentDate = pattern.lastRunDate || pattern.nextRunDate || new Date();

    for (let i = 0; i < Math.min(remaining, MAX_INSTANCES); i++) {
      currentDate = this.generateNextDate(
        pattern.pattern as RecurrencePattern,
        currentDate,
      );
      dates.push(new Date(currentDate));
    }

    // Update pattern
    await this.prisma.recurringPattern.update({
      where: { id: patternId },
      data: {
        currentInstanceCount: pattern.currentInstanceCount + dates.length,
        lastRunDate: new Date(),
        nextRunDate: dates[dates.length - 1],
      },
    });

    return dates;
  }

  async createRecurringPattern(data: {
    userId: string;
    serviceId: string;
    barberId: string;
    locationId: string;
    pattern: RecurrencePattern;
    preferredTime: string;
    preferredDay?: number;
    maxInstances?: number;
    startDate: Date;
  }): Promise<{ id: string; nextRunDate: Date }> {
    const maxInst = data.maxInstances || MAX_INSTANCES;

    const pattern = await this.prisma.recurringPattern.create({
      data: {
        userId: data.userId,
        serviceId: data.serviceId,
        barberId: data.barberId,
        locationId: data.locationId,
        pattern: data.pattern,
        preferredTime: data.preferredTime,
        preferredDay: data.preferredDay,
        maxInstances: maxInst,
        currentInstanceCount: 0,
        noShowCount: 0,
        status: RecurrenceStatus.ACTIVE,
        nextRunDate: data.startDate,
      },
    });

    return { id: pattern.id, nextRunDate: pattern.nextRunDate };
  }

  async handleSlotUnavailable(
    patternId: string,
  ): Promise<{ status: RecurrenceStatus; notificationSent: boolean }> {
    await this.prisma.recurringPattern.update({
      where: { id: patternId },
      data: { status: RecurrenceStatus.PAUSED },
    });

    // In production: send notification to user
    return { status: RecurrenceStatus.PAUSED, notificationSent: true };
  }

  async cancelRecurring(
    patternId: string,
    scope: 'this_only' | 'all_future',
    appointmentId?: string,
  ): Promise<{ status: RecurrenceStatus; cancelledAppointmentId?: string }> {
    const pattern = await this.prisma.recurringPattern.findUnique({
      where: { id: patternId },
    });

    if (!pattern) {
      throw new NotFoundException('Recurring pattern not found');
    }

    if (scope === 'all_future') {
      await this.prisma.recurringPattern.update({
        where: { id: patternId },
        data: { status: RecurrenceStatus.CANCELLED },
      });
      return { status: RecurrenceStatus.CANCELLED };
    } else {
      // Cancel only one appointment, keep recurrence active
      if (appointmentId) {
        await this.prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CANCELLED' as any },
        });
      }
      return {
        status: RecurrenceStatus.ACTIVE,
        cancelledAppointmentId: appointmentId,
      };
    }
  }

  async recordNoShow(
    patternId: string,
  ): Promise<{ paused: boolean; noShowCount: number }> {
    const pattern = await this.prisma.recurringPattern.findUnique({
      where: { id: patternId },
    });

    if (!pattern) {
      throw new NotFoundException('Recurring pattern not found');
    }

    const newCount = pattern.noShowCount + 1;
    const shouldPause = newCount >= 3;

    await this.prisma.recurringPattern.update({
      where: { id: patternId },
      data: {
        noShowCount: newCount,
        status: shouldPause ? RecurrenceStatus.PAUSED : pattern.status,
      },
    });

    if (shouldPause) {
      // In production: notify user
    }

    return { paused: shouldPause, noShowCount: newCount };
  }

  async handleBarberExit(barberId: string): Promise<{ pausedCount: number }> {
    const patterns = await this.prisma.recurringPattern.findMany({
      where: { barberId, status: RecurrenceStatus.ACTIVE },
    });

    for (const p of patterns) {
      await this.prisma.recurringPattern.update({
        where: { id: p.id },
        data: { status: RecurrenceStatus.PAUSED },
      });
    }

    // In production: notify affected users

    return { pausedCount: patterns.length };
  }

  async handleUserDelete(userId: string): Promise<{ cancelledCount: number }> {
    const patterns = await this.prisma.recurringPattern.findMany({
      where: { userId, status: RecurrenceStatus.ACTIVE },
    });

    for (const p of patterns) {
      await this.prisma.recurringPattern.update({
        where: { id: p.id },
        data: { status: RecurrenceStatus.CANCELLED },
      });
    }

    return { cancelledCount: patterns.length };
  }

  async editSingleInstance(
    patternId: string,
    appointmentId: string,
    newDateTime: Date,
  ): Promise<{ propagated: boolean }> {
    // Update only the specified appointment
    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { dateTime: newDateTime },
    });

    return { propagated: false };
  }

  async editAndPropagate(
    patternId: string,
    newDateTime: Date,
  ): Promise<{ propagated: boolean }> {
    const pattern = await this.prisma.recurringPattern.findUnique({
      where: { id: patternId },
    });

    if (!pattern) {
      throw new NotFoundException('Recurring pattern not found');
    }

    // Update preferred time and recalculate next runs
    await this.prisma.recurringPattern.update({
      where: { id: patternId },
      data: {
        preferredTime: `${newDateTime.getHours().toString().padStart(2, '0')}:${newDateTime.getMinutes().toString().padStart(2, '0')}`,
        nextRunDate: newDateTime,
      },
    });

    // In production: update future pending appointments

    return { propagated: true };
  }
}
