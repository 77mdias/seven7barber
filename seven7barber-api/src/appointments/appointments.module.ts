import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BookingService } from './booking.service';
import { TimeSlotService } from './time-slot.service';
import { AppointmentsController } from './appointments.controller';
import { AvailabilityModule } from '../availability/availability.module';

@Module({
  imports: [PrismaModule, AvailabilityModule],
  controllers: [AppointmentsController],
  providers: [BookingService, TimeSlotService],
  exports: [BookingService, TimeSlotService],
})
export class AppointmentsModule {}