import { Injectable } from '@nestjs/common';
import { TransactionType, POINTS_CONFIG } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';

@Injectable()
export class AppointmentPointsStrategy implements PointsEarningStrategy {
  readonly transactionType = TransactionType.EARN_APPOINTMENT;

  calculate(context: { appointmentPrice?: number }): number {
    if (!context.appointmentPrice) return 0;
    return Math.floor(
      context.appointmentPrice * POINTS_CONFIG.CONVERSION_RATE,
    );
  }
}
