import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface TimeSlot {
  time: string;
  barberId: string;
  barberName: string;
  date: string;
}

interface WorkingHours {
  start: string;
  end: string;
  bufferMinutes: number;
}

@Injectable()
export class AvailabilityService {
  private readonly DEFAULT_WORKING_HOURS: WorkingHours = {
    start: '09:00',
    end: '19:00',
    bufferMinutes: 15,
  };

  constructor(private readonly prisma: PrismaService) {}

  async getAvailableSlots(date: Date, serviceIds: string[]): Promise<TimeSlot[]> {
    const dateStr = date.toISOString().split('T')[0];

    // Get all barbers
    const barbers = await this.prisma.user.findMany({
      where: { role: 'BARBER' },
    });

    if (barbers.length === 0) {
      return [];
    }

    // Get service durations
    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });

    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const workingHours = this.getWorkingHours();

    // Get existing appointments for the date
    const startOfDay = new Date(`${dateStr}T00:00:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59`);

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      include: { service: true },
    });

    const slots: TimeSlot[] = [];
    const slotInterval = 30; // 30 min slots

    // Generate all possible slots
    const [startHour, startMin] = workingHours.start.split(':').map(Number);
    const [endHour, endMin] = workingHours.end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    for (const barber of barbers) {
      // Get barber's booked times
      const barberAppointments = existingAppointments.filter(
        (a) => a.barberId === barber.id
      );

      for (let mins = startMinutes; mins + totalDuration + workingHours.bufferMinutes <= endMinutes; mins += slotInterval) {
        const slotTime = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
        const slotEndTime = `${String(Math.floor((mins + totalDuration) / 60)).padStart(2, '0')}:${String((mins + totalDuration) % 60).padStart(2, '0')}`;

        // Check if slot conflicts with existing appointments
        const hasConflict = barberAppointments.some((appt) => {
          const apptTime = appt.dateTime;
          const apptMins = apptTime.getHours() * 60 + apptTime.getMinutes();
          const apptEndMins = apptMins + appt.service.duration + workingHours.bufferMinutes;

          return (mins < apptEndMins && mins + totalDuration > apptMins);
        });

        if (!hasConflict) {
          slots.push({
            time: slotTime,
            barberId: barber.id,
            barberName: barber.name,
            date: dateStr,
          });
        }
      }
    }

    return slots;
  }

  getWorkingHours(): WorkingHours {
    // TODO: Load from config/environment
    return this.DEFAULT_WORKING_HOURS;
  }
}