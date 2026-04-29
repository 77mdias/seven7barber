import { TransactionType } from '../enums/loyalty.enums';

export interface PointsEarningStrategy {
  readonly transactionType: TransactionType;

  calculate(context: { appointmentPrice?: number }): number;
}
