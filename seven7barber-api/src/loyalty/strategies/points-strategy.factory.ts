import { Injectable, BadRequestException } from '@nestjs/common';
import { TransactionType } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';
import { AppointmentPointsStrategy } from './appointment-points.strategy';
import { ReviewPointsStrategy } from './review-points.strategy';
import { ReferralPointsStrategy } from './referral-points.strategy';
import { BirthdayPointsStrategy } from './birthday-points.strategy';

@Injectable()
export class PointsStrategyFactory {
  private readonly strategies: Map<TransactionType, PointsEarningStrategy>;

  constructor(
    private readonly appointmentStrategy: AppointmentPointsStrategy,
    private readonly reviewStrategy: ReviewPointsStrategy,
    private readonly referralStrategy: ReferralPointsStrategy,
    private readonly birthdayStrategy: BirthdayPointsStrategy,
  ) {
    this.strategies = new Map<TransactionType, PointsEarningStrategy>([
      [TransactionType.EARN_APPOINTMENT, this.appointmentStrategy],
      [TransactionType.EARN_REVIEW, this.reviewStrategy],
      [TransactionType.EARN_REFERRAL, this.referralStrategy],
      [TransactionType.EARN_BIRTHDAY, this.birthdayStrategy],
    ]);
  }

  getStrategy(type: TransactionType): PointsEarningStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new BadRequestException(
        `Unsupported transaction type: ${type}`,
      );
    }
    return strategy;
  }
}
