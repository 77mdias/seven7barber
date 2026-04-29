export enum LoyaltyTier {
  BRONZE = 'BRONZE',
  PRATA = 'PRATA',
  OURO = 'OURO',
  DIAMANTE = 'DIAMANTE',
  RADIANTE = 'RADIANTE',
}

export enum TransactionType {
  EARN_APPOINTMENT = 'EARN_APPOINTMENT',
  EARN_REVIEW = 'EARN_REVIEW',
  EARN_REFERRAL = 'EARN_REFERRAL',
  EARN_BIRTHDAY = 'EARN_BIRTHDAY',
  REDEEM_DISCOUNT = 'REDEEM_DISCOUNT',
  REDEEM_SERVICE = 'REDEEM_SERVICE',
  EXPIRE = 'EXPIRE',
  REVERSAL = 'REVERSAL',
  REVERSAL_CONFIRMED = 'REVERSAL_CONFIRMED',
}

export enum RedemptionType {
  MONETARY_DISCOUNT = 'MONETARY_DISCOUNT',
  FREE_SERVICE = 'FREE_SERVICE',
}

export interface TierInfo {
  name: LoyaltyTier;
  minPoints: number;
  discountPercentage: number;
  benefits: string[];
}

export const TIER_CONFIG: Record<LoyaltyTier, TierInfo> = {
  [LoyaltyTier.BRONZE]: {
    name: LoyaltyTier.BRONZE,
    minPoints: 0,
    discountPercentage: 0,
    benefits: ['Pontos de conversão'],
  },
  [LoyaltyTier.PRATA]: {
    name: LoyaltyTier.PRATA,
    minPoints: 500,
    discountPercentage: 5,
    benefits: ['Pontos de conversão', '5% desconto em serviços'],
  },
  [LoyaltyTier.OURO]: {
    name: LoyaltyTier.OURO,
    minPoints: 1500,
    discountPercentage: 10,
    benefits: [
      'Pontos de conversão',
      '10% desconto em serviços',
      'Priority booking',
    ],
  },
  [LoyaltyTier.DIAMANTE]: {
    name: LoyaltyTier.DIAMANTE,
    minPoints: 5000,
    discountPercentage: 15,
    benefits: [
      'Pontos de conversão',
      '15% desconto',
      'Priority booking',
      'Early access',
    ],
  },
  [LoyaltyTier.RADIANTE]: {
    name: LoyaltyTier.RADIANTE,
    minPoints: 10000,
    discountPercentage: 20,
    benefits: [
      'Pontos de conversão',
      '20% desconto',
      'Priority booking',
      'Early access',
      'VIP treatment',
    ],
  },
};

export const POINTS_CONFIG = {
  CONVERSION_RATE: 0.1, // R$0.10 per point (50 pts = R$5)
  REDEEM_MIN_POINTS: 50,
  POINTS_TO_R5: 50, // 50 points = R$5
  EXPIRY_MONTHS_CONVERSION: 2,
  EXPIRY_YEARS_TIER: 1,
} as const;

export const EARN_POINTS = {
  REVIEW: 10,
  REFERRAL: 20,
  BIRTHDAY: 25,
} as const;

export const FREE_SERVICES = {
  500: { name: 'Corte básico', duration: 30, pointsRequired: 500 },
  1000: { name: 'Corte + barba', duration: 60, pointsRequired: 1000 },
  2000: {
    name: 'Tratamento capilar premium',
    duration: 90,
    pointsRequired: 2000,
  },
} as const;
