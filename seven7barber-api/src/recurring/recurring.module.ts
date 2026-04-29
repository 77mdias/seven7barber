import { Module } from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WeeklyRecurrenceStrategy } from './strategies/weekly-recurrence.strategy';
import { BiweeklyRecurrenceStrategy } from './strategies/biweekly-recurrence.strategy';
import { MonthlyRecurrenceStrategy } from './strategies/monthly-recurrence.strategy';
import { RecurrenceStrategyFactory } from './strategies/recurrence-strategy.factory';

@Module({
  imports: [PrismaModule],
  providers: [
    RecurringService,
    WeeklyRecurrenceStrategy,
    BiweeklyRecurrenceStrategy,
    MonthlyRecurrenceStrategy,
    RecurrenceStrategyFactory,
  ],
  exports: [RecurringService],
})
export class RecurringModule {}
