import { Injectable } from '@nestjs/common';
import { TransactionType, EARN_POINTS } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';

@Injectable()
export class ReviewPointsStrategy implements PointsEarningStrategy {
  readonly transactionType = TransactionType.EARN_REVIEW;

  calculate(): number {
    return EARN_POINTS.REVIEW;
  }
}
