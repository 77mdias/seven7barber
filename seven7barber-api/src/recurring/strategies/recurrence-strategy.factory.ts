import { Injectable, BadRequestException } from '@nestjs/common';
import { RecurrencePattern } from '../interfaces/recurring.interface';
import { RecurrenceStrategy } from './recurrence.strategy';
import { WeeklyRecurrenceStrategy } from './weekly-recurrence.strategy';
import { BiweeklyRecurrenceStrategy } from './biweekly-recurrence.strategy';
import { MonthlyRecurrenceStrategy } from './monthly-recurrence.strategy';

@Injectable()
export class RecurrenceStrategyFactory {
  private readonly strategies: Map<RecurrencePattern, RecurrenceStrategy>;

  constructor(
    private readonly weeklyStrategy: WeeklyRecurrenceStrategy,
    private readonly biweeklyStrategy: BiweeklyRecurrenceStrategy,
    private readonly monthlyStrategy: MonthlyRecurrenceStrategy,
  ) {
    this.strategies = new Map<RecurrencePattern, RecurrenceStrategy>([
      [RecurrencePattern.WEEKLY, this.weeklyStrategy],
      [RecurrencePattern.BIWEEKLY, this.biweeklyStrategy],
      [RecurrencePattern.MONTHLY, this.monthlyStrategy],
    ]);
  }

  getStrategy(pattern: RecurrencePattern): RecurrenceStrategy {
    const strategy = this.strategies.get(pattern);
    if (!strategy) {
      throw new BadRequestException(
        `Unsupported recurrence pattern: ${pattern}`,
      );
    }
    return strategy;
  }
}
