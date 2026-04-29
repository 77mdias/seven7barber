import { Injectable } from '@nestjs/common';
import { TransactionType, EARN_POINTS } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';

@Injectable()
export class BirthdayPointsStrategy implements PointsEarningStrategy {
  readonly transactionType = TransactionType.EARN_BIRTHDAY;

  calculate(): number {
    return EARN_POINTS.BIRTHDAY;
  }
}
