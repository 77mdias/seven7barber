import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export interface TimeSlot {
  time: string;
  barberId: string;
  barberName: string;
  date: string;
}

@Injectable()
export class TimeSlotService {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableSlots(barberId: string, serviceDuration: number): Promise<any[]> {
    // This delegates to availability service logic
    // For now, return slots based on working hours
    const workingHours = { start: '09:00', end: '19:00', bufferMinutes: 15 };
    const slotInterval = 30;

    const barbers = barberId
      ? await this.prisma.user.findMany({ where: { id: barberId, role: 'BARBER' } })
      : await this.prisma.user.findMany({ where: { role: 'BARBER' } });

    if (barbers.length === 0) return [];

    // Get all booked slots for today
    const today = new Date();
    const startOfDay = new Date(today.toISOString().split('T')[0]);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        barberId: barberId || undefined,
        dateTime: { gte: startOfDay, lt: endOfDay },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      include: { service: true },
    });

    const slots: any[] = [];
    const [startHour, startMin] = workingHours.start.split(':').map(Number);
    const [endHour, endMin] = workingHours.end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    for (const barber of barbers) {
      const barberAppointments = existingAppointments.filter(a => a.barberId === barber.id);

      for (let mins = startMinutes; mins + serviceDuration + workingHours.bufferMinutes <= endMinutes; mins += slotInterval) {
        const slotTime = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
        const slotDateTime = new Date(`${today.toISOString().split('T')[0]}T${slotTime}:00.000Z`);

        const hasConflict = barberAppointments.some((appt) => {
          const apptMins = appt.dateTime.getUTCHours() * 60 + appt.dateTime.getUTCMinutes();
          const apptEndMins = apptMins + appt.service.duration + workingHours.bufferMinutes;
          return mins < apptEndMins && mins + serviceDuration > apptMins;
        });

        if (!hasConflict) {
          slots.push({
            id: `${barber.id}-${slotTime.replace(':', '')}`,
            barberId: barber.id,
            barberName: barber.name,
            startTime: slotDateTime,
            isBooked: false,
          });
        }
      }
    }

    return slots;
  }

  async findOne(id: string): Promise<any> {
    // Parse id format: "barberId-timestamp"
    const parts = id.split('-');
    if (parts.length < 2) {
      throw new NotFoundException(`TimeSlot ${id} not found`);
    }

    const barberId = parts[0];
    const timeStr = parts.slice(1).join(':');
    const today = new Date().toISOString().split('T')[0];
    const slotDateTime = new Date(`${today}T${timeStr}:00.000Z`);

    const slot = await this.prisma.appointment.findFirst({
      where: {
        barberId,
        dateTime: slotDateTime,
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
    });

    if (slot) {
      throw new NotFoundException(`TimeSlot ${id} is already booked`);
    }

    return {
      id,
      barberId,
      startTime: slotDateTime,
      isBooked: false,
    };
  }

  async isAvailable(slotId: string): Promise<boolean> {
    try {
      const slot = await this.findOne(slotId);
      return !slot.isBooked;
    } catch {
      return false;
    }
  }

  async bookSlot(slotId: string, appointmentId?: string): Promise<any> {
    const slot = await this.findOne(slotId);
    if (slot.isBooked) {
      throw new Error('Slot already booked');
    }
    return { ...slot, isBooked: true, appointmentId };
  }
}