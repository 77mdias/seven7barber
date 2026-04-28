import { Module } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AppointmentPointsStrategy } from './strategies/appointment-points.strategy';
import { ReviewPointsStrategy } from './strategies/review-points.strategy';
import { ReferralPointsStrategy } from './strategies/referral-points.strategy';
import { BirthdayPointsStrategy } from './strategies/birthday-points.strategy';
import { PointsStrategyFactory } from './strategies/points-strategy.factory';

@Module({
  imports: [PrismaModule],
  providers: [
    LoyaltyService,
    AppointmentPointsStrategy,
    ReviewPointsStrategy,
    ReferralPointsStrategy,
    BirthdayPointsStrategy,
    PointsStrategyFactory,
  ],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}
