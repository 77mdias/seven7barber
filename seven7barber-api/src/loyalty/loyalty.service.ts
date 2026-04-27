import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  LoyaltyTier,
  TransactionType,
  TIER_CONFIG,
  POINTS_CONFIG,
  EARN_POINTS,
  FREE_SERVICES,
} from './enums/loyalty.enums';
import { LoyaltyTransaction, TierUpgradeResult } from './interfaces/loyalty.interface';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async calculateEarnPoints(
    type: TransactionType,
    context: { appointmentPrice?: number },
  ): Promise<number> {
    switch (type) {
      case TransactionType.EARN_APPOINTMENT:
        if (!context.appointmentPrice) return 0;
        return Math.floor(context.appointmentPrice * POINTS_CONFIG.CONVERSION_RATE);
      case TransactionType.EARN_REVIEW:
        return EARN_POINTS.REVIEW;
      case TransactionType.EARN_REFERRAL:
        return EARN_POINTS.REFERRAL;
      case TransactionType.EARN_BIRTHDAY:
        return EARN_POINTS.BIRTHDAY;
      default:
        return 0;
    }
  }

  async earnPoints(
    userId: string,
    type: TransactionType,
    context: { appointmentId?: string; referralUserId?: string; appointmentPrice?: number },
  ): Promise<LoyaltyTransaction> {
    // Check idempotency for appointment-based earnings
    if (context.appointmentId) {
      const existing = await this.prisma.loyaltyTransaction.findFirst({
        where: {
          userId,
          idempotencyKey: `appt-${context.appointmentId}`,
        },
      });
      if (existing) {
        throw new ConflictException('Points already awarded for this appointment');
      }
    }

    // Get or create loyalty account
    let account = await this.prisma.loyaltyAccount.findUnique({
      where: { userId },
    });

    if (!account) {
      account = await this.prisma.loyaltyAccount.create({
        data: { userId, totalPoints: 0, conversionPoints: 0, tierPoints: 0, currentTier: LoyaltyTier.BRONZE },
      });
    }

    // Calculate points to earn
    const points = await this.calculateEarnPoints(type, context);

    if (points <= 0) {
      throw new BadRequestException('Invalid points calculation');
    }

    // Create transaction
    const transaction = await this.prisma.loyaltyTransaction.create({
      data: {
        userId,
        type,
        points,
        balanceAfter: account.totalPoints + points,
        idempotencyKey: context.appointmentId ? `appt-${context.appointmentId}` : undefined,
        expiresAt: type === TransactionType.EARN_APPOINTMENT
          ? new Date(Date.now() + POINTS_CONFIG.EXPIRY_MONTHS_CONVERSION * 30 * 24 * 60 * 60 * 1000)
          : undefined,
      },
    });

    // Update account with tier recalculation
    const previousTier = account.currentTier;
    const newTotalPoints = account.totalPoints + points;
    const newTier = this.calculateTier(newTotalPoints);
    const tierUpgrade: TierUpgradeResult = {
      previousTier,
      newTier,
      upgraded: this.tierRank(newTier) > this.tierRank(previousTier),
    };

    await this.prisma.loyaltyAccount.update({
      where: { userId },
      data: {
        totalPoints: newTotalPoints,
        conversionPoints: type === TransactionType.EARN_APPOINTMENT
          ? account.conversionPoints + points
          : account.conversionPoints,
        tierPoints: account.tierPoints + points,
        currentTier: newTier,
        birthdayAwardedAt: type === TransactionType.EARN_BIRTHDAY ? new Date() : account.birthdayAwardedAt,
      },
    });

    return { ...transaction, metadata: { tierUpgrade } };
  }

  async redeemPoints(
    userId: string,
    request: { type: string; points: number; serviceId?: string },
  ): Promise<{ conversionRate: number; monetaryValue: number; serviceName?: string }> {
    if (request.points < POINTS_CONFIG.REDEEM_MIN_POINTS) {
      throw new BadRequestException(`Minimum ${POINTS_CONFIG.REDEEM_MIN_POINTS} points required for redemption`);
    }

    const account = await this.prisma.loyaltyAccount.findUnique({ where: { userId } });
    if (!account) {
      throw new NotFoundException('Loyalty account not found');
    }

    if (account.conversionPoints < request.points) {
      throw new BadRequestException('Insufficient conversion points');
    }

    // Calculate monetary value
    const monetaryValue = (request.points / POINTS_CONFIG.POINTS_TO_R5) * 5;
    const conversionRate = POINTS_CONFIG.CONVERSION_RATE;

    // Handle free service redemption
    let serviceName: string | undefined;
    if (request.type === 'FREE_SERVICE' && request.serviceId) {
      const freeService = Object.values(FREE_SERVICES).find(s => s.pointsRequired === request.points);
      if (freeService) {
        serviceName = freeService.name;
      }
    }

    // Create redemption transaction
    await this.prisma.loyaltyTransaction.create({
      data: {
        userId,
        type: request.type === 'FREE_SERVICE' ? TransactionType.REDEEM_SERVICE : TransactionType.REDEEM_DISCOUNT,
        points: -request.points,
        balanceAfter: account.totalPoints - request.points,
      },
    });

    // Update account
    await this.prisma.loyaltyAccount.update({
      where: { userId },
      data: {
        totalPoints: account.totalPoints - request.points,
        conversionPoints: account.conversionPoints - request.points,
      },
    });

    return { conversionRate, monetaryValue, serviceName };
  }

  async handleAppointmentCancellation(appointmentId: string, userId: string): Promise<{ status: string }> {
    // Find all transactions for this appointment
    const transactions = await this.prisma.loyaltyTransaction.findMany({
      where: {
        userId,
        idempotencyKey: `appt-${appointmentId}`,
      },
    });

    const pendingReversal = transactions.filter(t =>
      t.type === TransactionType.EARN_APPOINTMENT && t.points > 0
    );

    if (pendingReversal.length === 0) {
      return { status: 'NO_POINTS_TO_REVERSE' };
    }

    // Create reversal transactions
    for (const originalTx of pendingReversal) {
      await this.prisma.loyaltyTransaction.create({
        data: {
          userId,
          type: TransactionType.REVERSAL,
          points: -originalTx.points,
          balanceAfter: 0, // Will be recalculated
          metadata: { originalTransactionId: originalTx.id },
        },
      });
    }

    return { status: 'PENDING_REVERSAL' };
  }

  async getLoyaltyAccount(userId: string) {
    return this.prisma.loyaltyAccount.findUnique({ where: { userId } });
  }

  async calculateMonetaryValue(points: number): Promise<number> {
    return (points / POINTS_CONFIG.POINTS_TO_R5) * 5;
  }

  private calculateTier(totalPoints: number): LoyaltyTier {
    if (totalPoints >= TIER_CONFIG[LoyaltyTier.RADIANTE].minPoints) return LoyaltyTier.RADIANTE;
    if (totalPoints >= TIER_CONFIG[LoyaltyTier.DIAMANTE].minPoints) return LoyaltyTier.DIAMANTE;
    if (totalPoints >= TIER_CONFIG[LoyaltyTier.OURO].minPoints) return LoyaltyTier.OURO;
    if (totalPoints >= TIER_CONFIG[LoyaltyTier.PRATA].minPoints) return LoyaltyTier.PRATA;
    return LoyaltyTier.BRONZE;
  }

  private tierRank(tier: LoyaltyTier): number {
    const ranks: Record<LoyaltyTier, number> = {
      [LoyaltyTier.BRONZE]: 1,
      [LoyaltyTier.PRATA]: 2,
      [LoyaltyTier.OURO]: 3,
      [LoyaltyTier.DIAMANTE]: 4,
      [LoyaltyTier.RADIANTE]: 5,
    };
    return ranks[tier];
  }
}