import { Injectable } from '@nestjs/common';
import { RecurrencePattern } from '../interfaces/recurring.interface';
import { RecurrenceStrategy } from './recurrence.strategy';

@Injectable()
export class WeeklyRecurrenceStrategy implements RecurrenceStrategy {
  readonly pattern = RecurrencePattern.WEEKLY;

  nextDate(lastDate: Date): Date {
    const next = new Date(lastDate);
    next.setDate(next.getDate() + 7);
    return next;
  }
}
