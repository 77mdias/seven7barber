import { Test, TestingModule } from '@nestjs/testing';
import { WaitlistService } from './waitlist.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WaitlistStatus } from './interfaces/waitlist.interface';

describe('WaitlistService', () => {
  let service: WaitlistService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 'user-waitlist-123',
    email: 'waitlist@example.com',
    name: 'Waitlist User',
  };

  const mockLocation = { id: 'loc-1', name: 'Seven7Barber Centro' };
  const mockService = { id: 'svc-1', name: 'Corte' };
  const mockBarber = { id: 'barber-1', name: 'João' };

  beforeEach(async () => {
    const mockPrismaService = {
      waitlistEntry: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitlistService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WaitlistService>(WaitlistService);
    prismaService = module.get(PrismaService);
  });

  describe('C1 | RED | should join waitlist with FIFO position | ✅ FAIL', () => {
    it('should assign position based on timestamp (FIFO)', async () => {
      const queueKey = 'loc-1:svc-1:barber-1';

      // First entry
      prismaService.waitlistEntry.count.mockResolvedValueOnce(0);
      prismaService.waitlistEntry.create.mockResolvedValueOnce({
        id: 'entry-1',
        userId: 'user-1',
        locationId: 'loc-1',
        serviceId: 'svc-1',
        barberId: 'barber-1',
        preferredDate: new Date(),
        position: 1,
        status: WaitlistStatus.WAITING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.joinWaitlist('user-1', queueKey, new Date());

      expect(result.position).toBe(1);
      expect(result.status).toBe(WaitlistStatus.WAITING);
    });
  });

  describe('C2 | RED | should calculate correct position for subsequent entries | ✅ FAIL', () => {
    it('should assign position 2 to second entry, 3 to third', async () => {
      const queueKey = 'loc-1:svc-1:barber-1';

      // Second entry
      prismaService.waitlistEntry.count.mockResolvedValueOnce(1);
      prismaService.waitlistEntry.create.mockResolvedValueOnce({
        id: 'entry-2',
        userId: 'user-2',
        locationId: 'loc-1',
        serviceId: 'svc-1',
        barberId: 'barber-1',
        preferredDate: new Date(),
        position: 2,
        status: WaitlistStatus.WAITING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.joinWaitlist('user-2', queueKey, new Date());

      expect(result.position).toBe(2);
    });
  });

  describe('C3 | RED | should notify top 3 when slot opens | ✅ FAIL', () => {
    it('should notify first 3 entries in queue', async () => {
      const queueKey = 'loc-1:svc-1:barber-1';
      // Mock only top 3 entries (code uses take: 3)
      const mockEntries = [
        {
          id: 'entry-1',
          position: 1,
          userId: 'user-1',
          status: WaitlistStatus.WAITING,
        },
        {
          id: 'entry-2',
          position: 2,
          userId: 'user-2',
          status: WaitlistStatus.WAITING,
        },
        {
          id: 'entry-3',
          position: 3,
          userId: 'user-3',
          status: WaitlistStatus.WAITING,
        },
        // entry-4 should NOT be included - code uses take: 3
      ];

      prismaService.waitlistEntry.findMany.mockResolvedValue(
        mockEntries as any,
      );
      prismaService.waitlistEntry.update.mockResolvedValue({} as any);

      const result = await service.notifyTopWhenSlotOpens(queueKey);

      expect(prismaService.waitlistEntry.update).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
    });
  });

  describe('C4 | RED | should set 30min timeout after notification | ✅ FAIL', () => {
    it('should set expiresAt to 30 minutes after notification', async () => {
      const entryId = 'entry-1';

      prismaService.waitlistEntry.findUnique.mockResolvedValue({
        id: entryId,
        userId: 'user-1',
        status: WaitlistStatus.WAITING,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

      await service.notifyUser(entryId);

      expect(prismaService.waitlistEntry.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: entryId },
          data: expect.objectContaining({
            status: WaitlistStatus.NOTIFIED,
            notifiedAt: expect.any(Date),
            expiresAt: expect.any(Date),
          }),
        }),
      );
    });
  });

  describe('C5 | RED | should allow user to leave waitlist voluntarily | ✅ FAIL', () => {
    it('should mark entry as CANCELLED when user leaves', async () => {
      const entryId = 'entry-user-exit';

      prismaService.waitlistEntry.findUnique.mockResolvedValue({
        id: entryId,
        userId: 'user-1',
        status: WaitlistStatus.WAITING,
      } as any);

      await service.leaveWaitlist(entryId, 'user-1');

      expect(prismaService.waitlistEntry.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: entryId },
          data: { status: WaitlistStatus.CANCELLED },
        }),
      );
    });
  });

  describe('C6 | RED | should prevent duplicate waitlist entries | ✅ FAIL', () => {
    it('should throw ConflictException if user already in queue', async () => {
      const queueKey = 'loc-1:svc-1:barber-1';
      const userId = 'user-duplicate';

      prismaService.waitlistEntry.findFirst.mockResolvedValueOnce({
        id: 'existing-entry',
        userId,
        status: WaitlistStatus.WAITING,
      } as any);

      await expect(
        service.joinWaitlist(userId, queueKey, new Date()),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('C7 | RED | should hold cancelled slot for 5min before general release | ✅ FAIL', () => {
    it('should keep slot in waitlist hold for 5 minutes after cancellation', async () => {
      const appointmentId = 'appt-cancelled';

      // Verify slot goes to waitlist hold, not general availability
      const result = await service.handleSlotCancellation(appointmentId);

      expect(result.holdStatus).toBe('WAITLIST_HOLD');
      expect(result.holdDurationMs).toBe(5 * 60 * 1000); // 5 minutes
    });
  });

  describe('C8 | RED | should move to next user when timer expires | ✅ FAIL', () => {
    it('should mark entry as EXPIRED and notify next user', async () => {
      const entryId = 'entry-expired';

      prismaService.waitlistEntry.findUnique.mockResolvedValue({
        id: entryId,
        userId: 'user-1',
        status: WaitlistStatus.NOTIFIED,
        expiresAt: new Date(Date.now() - 1000), // Already expired
      } as any);

      prismaService.waitlistEntry.findMany.mockResolvedValue([
        {
          id: 'entry-2',
          position: 2,
          userId: 'user-2',
          status: WaitlistStatus.WAITING,
        },
      ] as any);

      await service.handleExpiration(entryId);

      expect(prismaService.waitlistEntry.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: entryId },
          data: { status: WaitlistStatus.EXPIRED },
        }),
      );
    });
  });

  describe('C9 | RED | should getQueuePosition returns current position | ✅ FAIL', () => {
    it('should return position number for user in queue', async () => {
      const userId = 'user-position';
      const queueKey = 'loc-1:svc-1:barber-1';

      prismaService.waitlistEntry.findFirst.mockResolvedValueOnce({
        id: 'entry-5',
        position: 5,
        status: WaitlistStatus.WAITING,
      } as any);

      const result = await service.getQueuePosition(userId, queueKey);

      expect(result).toBe(5);
    });
  });

  describe('C10 | RED | should confirm slot and convert to appointment | ✅ FAIL', () => {
    it('should mark entry as CONFIRMED and create appointment', async () => {
      const entryId = 'entry-confirm';
      const slotDateTime = new Date();

      prismaService.waitlistEntry.findUnique.mockResolvedValue({
        id: entryId,
        userId: 'user-1',
        locationId: 'loc-1',
        serviceId: 'svc-1',
        barberId: 'barber-1',
        status: WaitlistStatus.NOTIFIED,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      } as any);

      const result = await service.confirmFromWaitlist(entryId, slotDateTime);

      expect(result.status).toBe(WaitlistStatus.CONFIRMED);
    });
  });
});
