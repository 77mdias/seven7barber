import { LoyaltyTier, TransactionType, RedemptionType } from '../enums/loyalty.enums';

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  points: number;
  balanceAfter: number;
  idempotencyKey?: string;
  expiresAt?: Date;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface LoyaltyAccount {
  id: string;
  userId: string;
  totalPoints: number;
  conversionPoints: number;
  tierPoints: number;
  currentTier: LoyaltyTier;
  birthdayAwardedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RedemptionRequest {
  userId: string;
  type: RedemptionType;
  points: number;
  serviceId?: string;
}

export interface EarnContext {
  userId: string;
  type: TransactionType;
  appointmentId?: string;
  referralUserId?: string;
  appointmentPrice?: number;
}

export interface TierUpgradeResult {
  previousTier: LoyaltyTier;
  newTier: LoyaltyTier;
  upgraded: boolean;
}