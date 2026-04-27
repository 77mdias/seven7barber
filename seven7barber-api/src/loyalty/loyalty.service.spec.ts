import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyService } from './loyalty.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { LoyaltyTier, TransactionType, TIER_CONFIG, FREE_SERVICES } from './enums/loyalty.enums';

describe('LoyaltyService', () => {
  let service: LoyaltyService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date('2024-01-01'),
    loyaltyAccount: {
      id: 'loyalty-1',
      userId: 'user-123',
      totalPoints: 100,
      conversionPoints: 80,
      tierPoints: 20,
      currentTier: LoyaltyTier.BRONZE,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
  };

  beforeEach(async () => {
    const mockPrismaService = {
      loyaltyAccount: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      loyaltyTransaction: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LoyaltyService>(LoyaltyService);
    prismaService = module.get(PrismaService);
  });

  describe('C1 | RED | should calculate points from appointment price | ✅ FAIL', () => {
    it('should earn 10 points per R$1 spent (50 points = R$5)', async () => {
      const appointmentPrice = 150; // R$150 -> 1500 points
      const expectedPoints = Math.floor(appointmentPrice * 0.10); // 1500

      const result = await service.calculateEarnPoints('EARN_APPOINTMENT', { appointmentPrice });

      expect(result).toBe(expectedPoints);
    });
  });

  describe('C2 | RED | should award 10 points for review | ✅ FAIL', () => {
    it('should add 10 points when review is submitted', async () => {
      const userId = 'user-123';
      const initialPoints = 100;

      prismaService.loyaltyAccount.findUnique.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        totalPoints: initialPoints,
      });
      prismaService.loyaltyTransaction.create.mockResolvedValue({
        id: 'tx-1',
        userId,
        type: TransactionType.EARN_REVIEW,
        points: 10,
        balanceAfter: initialPoints + 10,
        createdAt: new Date(),
      });
      prismaService.loyaltyAccount.update.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        totalPoints: initialPoints + 10,
      });

      const result = await service.earnPoints(userId, TransactionType.EARN_REVIEW, {
        userId,
        type: TransactionType.EARN_REVIEW,
      });

      expect(result.points).toBe(10);
      expect(result.type).toBe(TransactionType.EARN_REVIEW);
    });
  });

  describe('C3 | RED | should award 20 points for referral completion | ✅ FAIL', () => {
    it('should add 20 points to referrer when referred friend completes appointment', async () => {
      const referrerId = 'user-referrer';
      const referredId = 'user-referred';

      prismaService.loyaltyAccount.findUnique.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        userId: referrerId,
        totalPoints: 200,
      });
      prismaService.loyaltyTransaction.create.mockResolvedValue({
        id: 'tx-2',
        userId: referrerId,
        type: TransactionType.EARN_REFERRAL,
        points: 20,
        balanceAfter: 220,
        createdAt: new Date(),
      });

      const result = await service.earnPoints(referrerId, TransactionType.EARN_REFERRAL, {
        userId: referrerId,
        type: TransactionType.EARN_REFERRAL,
        referralUserId: referredId,
      });

      expect(result.points).toBe(20);
    });
  });

  describe('C4 | RED | should award 25 points birthday bonus | ✅ FAIL', () => {
    it('should give 25 points only once per year (checked by month)', async () => {
      const userId = 'user-birthday';
      const now = new Date();
      const birthdayMonth = now.getMonth();

      const userWithBirthday = {
        ...mockUser,
        birthday: new Date(1990, birthdayMonth, 15),
      };

      prismaService.user.findUnique.mockResolvedValue(userWithBirthday);
      prismaService.loyaltyAccount.findUnique.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        userId,
        birthdayAwardedAt: null,
      });
      prismaService.loyaltyTransaction.create.mockResolvedValue({
        id: 'tx-3',
        userId,
        type: TransactionType.EARN_BIRTHDAY,
        points: 25,
        balanceAfter: 125,
        createdAt: new Date(),
      });

      const result = await service.earnPoints(userId, TransactionType.EARN_BIRTHDAY, {
        userId,
        type: TransactionType.EARN_BIRTHDAY,
      });

      expect(result.points).toBe(25);
    });
  });

  describe('C5 | RED | should prevent double-award with idempotency key | ✅ FAIL', () => {
    it('should reject duplicate earning for same appointment', async () => {
      const appointmentId = 'appt-duplicate-123';
      const userId = 'user-123';

      // First time - should succeed
      prismaService.loyaltyTransaction.findUnique.mockResolvedValueOnce(null);
      prismaService.loyaltyAccount.findUnique.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        totalPoints: 100,
      });
      prismaService.loyaltyTransaction.create.mockResolvedValue({
        id: 'tx-first',
        userId,
        type: TransactionType.EARN_APPOINTMENT,
        points: 500,
        balanceAfter: 600,
        idempotencyKey: `appt-${appointmentId}`,
        createdAt: new Date(),
      });

      // Second time - should fail (duplicate)
      prismaService.loyaltyTransaction.findUnique.mockResolvedValue({
        id: 'tx-first',
        userId,
        type: TransactionType.EARN_APPOINTMENT,
        points: 500,
        balanceAfter: 600,
        idempotencyKey: `appt-${appointmentId}`,
        createdAt: new Date(),
      });

      await expect(
        service.earnPoints(userId, TransactionType.EARN_APPOINTMENT, {
          userId,
          type: TransactionType.EARN_APPOINTMENT,
          appointmentId,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('C6 | RED | should upgrade tier when threshold reached | ✅ FAIL', () => {
    it('should upgrade from Bronze to Prata at 500 points', async () => {
      const userId = 'user-upgrade';

      prismaService.loyaltyAccount.findUnique.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        userId,
        totalPoints: 490,
        tierPoints: 490,
        currentTier: LoyaltyTier.BRONZE,
      });
      prismaService.loyaltyAccount.update.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        userId,
        totalPoints: 510,
        tierPoints: 510,
        currentTier: LoyaltyTier.PRATA,
      });
      prismaService.loyaltyTransaction.create.mockResolvedValue({
        id: 'tx-upgrade',
        userId,
        type: TransactionType.EARN_APPOINTMENT,
        points: 20,
        balanceAfter: 510,
        createdAt: new Date(),
      });

      const result = await service.earnPoints(userId, TransactionType.EARN_APPOINTMENT, {
        userId,
        type: TransactionType.EARN_APPOINTMENT,
        appointmentPrice: 200,
      });

      // After earning, tier should upgrade
      expect(result.metadata?.tierUpgrade?.upgraded).toBe(true);
    });
  });

  describe('C7 | RED | should never downgrade tier until expiry check | ✅ FAIL', () => {
    it('should keep current tier even if points fall below threshold', async () => {
      const userId = 'user-no-downgrade';

      prismaService.loyaltyAccount.findUnique.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        userId,
        totalPoints: 400, // Below Prata threshold
        tierPoints: 400,
        currentTier: LoyaltyTier.PRATA, // Should not downgrade
      });

      const account = await service.getLoyaltyAccount(userId);

      expect(account?.currentTier).toBe(LoyaltyTier.PRATA);
    });
  });

  describe('C8 | RED | should redeem monetary discount at 50pts=R$5 | ✅ FAIL', () => {
    it('should convert 50 points to R$5 discount', async () => {
      const userId = 'user-redeem';
      const pointsToRedeem = 100; // Should give R$10

      prismaService.loyaltyAccount.findUnique.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        userId,
        conversionPoints: 500,
        totalPoints: 500,
      });
      prismaService.loyaltyTransaction.create.mockResolvedValue({
        id: 'tx-redeem',
        userId,
        type: TransactionType.REDEEM_DISCOUNT,
        points: -100,
        balanceAfter: 400,
        createdAt: new Date(),
      });

      const result = await service.redeemPoints(userId, {
        userId,
        type: 'MONETARY_DISCOUNT',
        points: pointsToRedeem,
      });

      expect(result.conversionRate).toBe(0.10); // R$10 from 100 pts
    });
  });

  describe('C9 | RED | should prevent redemption if insufficient points | ✅ FAIL', () => {
    it('should throw BadRequestException when points insufficient', async () => {
      const userId = 'user-poor';

      prismaService.loyaltyAccount.findUnique.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        userId,
        conversionPoints: 30, // Below 50 min
        totalPoints: 30,
      });

      await expect(
        service.redeemPoints(userId, {
          userId,
          type: 'MONETARY_DISCOUNT',
          points: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('C10 | RED | should mark points pending_reversal on cancellation | ✅ FAIL', () => {
    it('should mark points as pending reversal instead of immediately reversing', async () => {
      const appointmentId = 'appt-cancel-123';
      const userId = 'user-cancel';

      prismaService.loyaltyTransaction.findMany.mockResolvedValue([{
        id: 'tx-original',
        userId,
        type: TransactionType.EARN_APPOINTMENT,
        points: 500,
        balanceAfter: 600,
        idempotencyKey: `appt-${appointmentId}`,
        createdAt: new Date(),
      }]);
      prismaService.loyaltyTransaction.create.mockResolvedValue({
        id: 'tx-reversal-pending',
        userId,
        type: TransactionType.REVERSAL,
        points: -500,
        balanceAfter: 100,
        createdAt: new Date(),
      });

      const result = await service.handleAppointmentCancellation(appointmentId, userId);

      expect(result.status).toBe('PENDING_REVERSAL');
    });
  });

  describe('C11 | RED | should convert points to monetary (50pts=R$5) | ✅ FAIL', () => {
    it('should calculate correct monetary value for redemption', async () => {
      const points = 250;
      const expectedMoney = (points / 50) * 5; // 250/50=5 -> R$5

      const result = await service.calculateMonetaryValue(points);

      expect(result).toBe(expectedMoney);
    });
  });

  describe('C12 | RED | should handle free service redemption | ✅ FAIL', () => {
    it('should allow redemption of free service with correct points', async () => {
      const userId = 'user-free-service';
      const serviceId = 'service-basic';

      prismaService.loyaltyAccount.findUnique.mockResolvedValue({
        ...mockUser.loyaltyAccount,
        userId,
        conversionPoints: 600,
        totalPoints: 600,
      });

      // 500 points = Corte básico
      const result = await service.redeemPoints(userId, {
        userId,
        type: 'FREE_SERVICE',
        points: 500,
        serviceId,
      });

      expect(result.serviceName).toBe('Corte básico');
    });
  });
});