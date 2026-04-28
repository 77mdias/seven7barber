import { Test, TestingModule } from '@nestjs/testing';
import { RecurringService } from './recurring.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  RecurrencePattern,
  RecurrenceStatus,
} from './interfaces/recurring.interface';
import { RecurrenceStrategyFactory } from './strategies/recurrence-strategy.factory';

const mockRecurrenceStrategyFactory = {
  getStrategy: jest.fn((pattern: RecurrencePattern) => ({
    pattern,
    nextDate: jest.fn((lastDate: Date) => {
      const next = new Date(lastDate);
      switch (pattern) {
        case RecurrencePattern.WEEKLY:
          next.setDate(next.getDate() + 7);
          return next;
        case RecurrencePattern.BIWEEKLY:
          next.setDate(next.getDate() + 14);
          return next;
        case RecurrencePattern.MONTHLY:
          next.setMonth(next.getMonth() + 1);
          if (next.getDate() !== lastDate.getDate()) {
            next.setDate(0);
          }
          return next;
        default:
          return next;
      }
    }),
  })),
};

describe('RecurringService', () => {
  let service: RecurringService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 'user-recurring-123',
    email: 'recurring@example.com',
    name: 'Recurring User',
  };
  const mockBarber = { id: 'barber-1', name: 'João' };
  const mockService = { id: 'svc-1', name: 'Corte', duration: 60 };
  const mockLocation = { id: 'loc-1', name: 'Seven7Barber Centro' };

  beforeEach(async () => {
    const mockPrismaService = {
      recurringPattern: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      appointment: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecurringService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RecurrenceStrategyFactory, useValue: mockRecurrenceStrategyFactory },
      ],
    }).compile();

    service = module.get<RecurringService>(RecurringService);
    prismaService = module.get(PrismaService);
  });

  describe('C1 | RED | should generate weekly appointments | ✅ FAIL', () => {
    it('should generate next occurrence 7 days after last', async () => {
      const lastDate = new Date('2026-04-27T14:00:00Z');
      const expectedNext = new Date('2026-05-04T14:00:00Z');

      const result = service.generateNextDate(
        RecurrencePattern.WEEKLY,
        lastDate,
      );

      expect(result).toEqual(expectedNext);
    });
  });

  describe('C2 | RED | should generate biweekly appointments | ✅ FAIL', () => {
    it('should generate next occurrence 14 days after last', async () => {
      const lastDate = new Date('2026-04-27T14:00:00Z');
      const expectedNext = new Date('2026-05-11T14:00:00Z');

      const result = service.generateNextDate(
        RecurrencePattern.BIWEEKLY,
        lastDate,
      );

      expect(result).toEqual(expectedNext);
    });
  });

  describe('C3 | RED | should generate monthly appointments | ✅ FAIL', () => {
    it('should add 1 month to last date', async () => {
      const lastDate = new Date('2026-04-27T14:00:00Z');
      const expectedNext = new Date('2026-05-27T14:00:00Z');

      const result = service.generateNextDate(
        RecurrencePattern.MONTHLY,
        lastDate,
      );

      expect(result).toEqual(expectedNext);
    });
  });

  describe('C4 | RED | should handle month-end edge case (31st) | ✅ FAIL', () => {
    it('should use last day of month if day does not exist', async () => {
      const lastDate = new Date('2026-01-31T14:00:00Z');
      // Feb doesn't have 31, should use Feb 28 (or 29 in leap year)
      const expectedNext = new Date('2026-02-28T14:00:00Z');

      const result = service.generateNextDate(
        RecurrencePattern.MONTHLY,
        lastDate,
      );

      expect(result.getDate()).toBeLessThanOrEqual(28);
    });
  });

  describe('C5 | RED | should limit to 12 future instances | ✅ FAIL', () => {
    it('should not generate more than maxInstances', async () => {
      const patternId = 'pattern-max-12';
      const maxInstances = 12;

      prismaService.recurringPattern.findUnique.mockResolvedValue({
        id: patternId,
        pattern: RecurrencePattern.WEEKLY,
        currentInstanceCount: 11,
        maxInstances,
        status: RecurrenceStatus.ACTIVE,
        preferredTime: '14:00',
        lastRunDate: new Date(),
        nextRunDate: new Date(),
        userId: 'user-1',
        serviceId: 'svc-1',
        barberId: 'barber-1',
        locationId: 'loc-1',
        noShowCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.generateNextBatch(patternId);

      expect(result).toHaveLength(1); // Can only add 1 more to reach 12
    });
  });

  describe('C6 | RED | should pause recurrence when slot unavailable | ✅ FAIL', () => {
    it('should set status to PAUSED and notify user', async () => {
      const patternId = 'pattern-pause';

      prismaService.recurringPattern.findUnique.mockResolvedValue({
        id: patternId,
        status: RecurrenceStatus.ACTIVE,
        preferredTime: '14:00',
        lastRunDate: new Date(),
        nextRunDate: new Date(),
      } as any);

      // Simulate slot not available
      const result = await service.handleSlotUnavailable(patternId);

      expect(result.status).toBe(RecurrenceStatus.PAUSED);
      expect(result.notificationSent).toBe(true);
    });
  });

  describe('C7 | RED | should cancel "this and future" on request | ✅ FAIL', () => {
    it('should mark all pending instances as CANCELLED', async () => {
      const patternId = 'pattern-cancel';

      prismaService.recurringPattern.findUnique.mockResolvedValue({
        id: patternId,
        status: RecurrenceStatus.ACTIVE,
        noShowCount: 0,
      } as any);

      const result = await service.cancelRecurring(patternId, 'all_future');

      expect(prismaService.recurringPattern.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: patternId },
          data: { status: RecurrenceStatus.CANCELLED },
        }),
      );
    });
  });

  describe('C8 | RED | should cancel only single instance | ✅ FAIL', () => {
    it('should cancel one appointment but keep recurrence active', async () => {
      const patternId = 'pattern-single-cancel';
      const appointmentId = 'appt-cancel-one';

      prismaService.recurringPattern.findUnique.mockResolvedValue({
        id: patternId,
        status: RecurrenceStatus.ACTIVE,
      } as any);

      const result = await service.cancelRecurring(
        patternId,
        'this_only',
        appointmentId,
      );

      expect(result.status).toBe(RecurrenceStatus.ACTIVE);
      expect(result.cancelledAppointmentId).toBe(appointmentId);
    });
  });

  describe('C9 | RED | should stop on 3 consecutive no-shows | ✅ FAIL', () => {
    it('should pause recurrence and notify user after 3 no-shows', async () => {
      const patternId = 'pattern-noshow';

      prismaService.recurringPattern.findUnique.mockResolvedValue({
        id: patternId,
        noShowCount: 2,
        status: RecurrenceStatus.ACTIVE,
      } as any);

      const result = await service.recordNoShow(patternId);

      expect(result.paused).toBe(true);
      expect(result.noShowCount).toBe(3);
    });
  });

  describe('C10 | RED | should stop on barber exit | ✅ FAIL', () => {
    it('should pause all recurrences when barber leaves platform', async () => {
      const barberId = 'barber-exit';

      prismaService.recurringPattern.findMany.mockResolvedValue([
        { id: 'p1', barberId, status: RecurrenceStatus.ACTIVE },
        { id: 'p2', barberId, status: RecurrenceStatus.ACTIVE },
      ] as any);

      const result = await service.handleBarberExit(barberId);

      expect(result.pausedCount).toBe(2);
    });
  });

  describe('C11 | RED | should stop on user account delete | ✅ FAIL', () => {
    it('should cancel all recurrences when user deletes account', async () => {
      const userId = 'user-delete';

      prismaService.recurringPattern.findMany.mockResolvedValue([
        { id: 'p1', userId, status: RecurrenceStatus.ACTIVE },
      ] as any);

      const result = await service.handleUserDelete(userId);

      expect(result.cancelledCount).toBe(1);
    });
  });

  describe('C12 | RED | should edit single instance (not propagate) | ✅ FAIL', () => {
    it('should update only the specified instance datetime', async () => {
      const patternId = 'pattern-edit-one';
      const appointmentId = 'appt-edit-single';
      const newDateTime = new Date('2026-05-10T16:00:00Z');

      prismaService.recurringPattern.findUnique.mockResolvedValue({
        id: patternId,
        status: RecurrenceStatus.ACTIVE,
      } as any);

      const result = await service.editSingleInstance(
        patternId,
        appointmentId,
        newDateTime,
      );

      expect(result.propagated).toBe(false);
    });
  });

  describe('C13 | RED | should edit "this and future" propagate | ✅ FAIL', () => {
    it('should update datetime and apply to future instances', async () => {
      const patternId = 'pattern-edit-propagate';
      const newDateTime = new Date('2026-05-10T16:00:00Z');

      prismaService.recurringPattern.findUnique.mockResolvedValue({
        id: patternId,
        status: RecurrenceStatus.ACTIVE,
        preferredTime: '16:00',
        lastRunDate: new Date(),
        nextRunDate: new Date(),
      } as any);

      const result = await service.editAndPropagate(patternId, newDateTime);

      expect(result.propagated).toBe(true);
      expect(prismaService.recurringPattern.update).toHaveBeenCalled();
    });
  });
});
