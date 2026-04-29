import { Injectable } from '@nestjs/common';
import { RecurrencePattern } from '../interfaces/recurring.interface';
import { RecurrenceStrategy } from './recurrence.strategy';

@Injectable()
export class MonthlyRecurrenceStrategy implements RecurrenceStrategy {
  readonly pattern = RecurrencePattern.MONTHLY;

  nextDate(lastDate: Date): Date {
    const next = new Date(lastDate);
    next.setMonth(next.getMonth() + 1);
    if (next.getDate() !== lastDate.getDate()) {
      next.setDate(0);
    }
    return next;
  }
}
