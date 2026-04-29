import { Injectable } from '@nestjs/common';
import { RecurrencePattern } from '../interfaces/recurring.interface';
import { RecurrenceStrategy } from './recurrence.strategy';

@Injectable()
export class BiweeklyRecurrenceStrategy implements RecurrenceStrategy {
  readonly pattern = RecurrencePattern.BIWEEKLY;

  nextDate(lastDate: Date): Date {
    const next = new Date(lastDate);
    next.setDate(next.getDate() + 14);
    return next;
  }
}
