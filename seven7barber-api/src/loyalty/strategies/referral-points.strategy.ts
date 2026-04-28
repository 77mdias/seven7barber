import { Injectable } from '@nestjs/common';
import { TransactionType, EARN_POINTS } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';

@Injectable()
export class ReferralPointsStrategy implements PointsEarningStrategy {
  readonly transactionType = TransactionType.EARN_REFERRAL;

  calculate(): number {
    return EARN_POINTS.REFERRAL;
  }
}
