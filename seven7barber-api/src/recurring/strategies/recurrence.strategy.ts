import { RecurrencePattern } from '../interfaces/recurring.interface';

export interface RecurrenceStrategy {
  readonly pattern: RecurrencePattern;

  nextDate(lastDate: Date): Date;
}
