import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

export interface CreateBookingDto {
  serviceId: string;
  barberId: string;
  dateTime: Date;
  clientId: string;
  notes?: string;
}

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(data: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
    });
    if (!service) throw new NotFoundException('Service not found');

    const barber = await this.prisma.user.findUnique({
      where: { id: data.barberId },
    });
    if (!barber || barber.role !== 'BARBER') {
      throw new NotFoundException('Barber not found');
    }

    // Check if slot is available (no conflicting appointments)
    const hasConflict = await this.checkSlotConflict(
      data.barberId,
      data.dateTime,
      service.duration,
    );
    if (hasConflict) {
      throw new BadRequestException('Time slot is not available');
    }

    return this.prisma.appointment.create({
      data: {
        serviceId: data.serviceId,
        clientId: data.clientId,
        barberId: data.barberId,
        dateTime: data.dateTime,
        notes: data.notes,
        status: 'SCHEDULED',
      },
      include: {
        service: true,
        barber: { select: { id: true, name: true, image: true } },
        client: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getBookingSummary(appointmentId: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true, barber: true },
    });
    if (!appt) throw new NotFoundException('Appointment not found');
    return {
      id: appt.id,
      service: appt.service.name,
      barber: appt.barber.name,
      dateTime: appt.dateTime,
      price: appt.service.price,
      status: appt.status,
    };
  }

  async getClientAppointments(clientId: string) {
    return this.prisma.appointment.findMany({
      where: { clientId },
      include: {
        service: true,
        barber: { select: { id: true, name: true, image: true } },
      },
      orderBy: { dateTime: 'desc' },
    });
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
  ) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appt) throw new NotFoundException('Appointment not found');

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }

  async cancelAppointment(appointmentId: string) {
    return this.updateAppointmentStatus(appointmentId, 'CANCELLED');
  }

  async getBarberAppointments(barberId: string, date?: Date) {
    const where: any = { barberId };
    if (date) {
      const startOfDay = new Date(date.toISOString().split('T')[0]);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      where.dateTime = { gte: startOfDay, lt: endOfDay };
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        service: true,
        client: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dateTime: 'asc' },
    });
  }

  private async checkSlotConflict(
    barberId: string,
    dateTime: Date,
    durationMinutes: number,
  ): Promise<boolean> {
    const bufferMinutes = 15;
    const startTime = dateTime.getTime();
    const endTime = startTime + (durationMinutes + bufferMinutes) * 60 * 1000;

    const conflictingAppointments = await this.prisma.appointment.findMany({
      where: {
        barberId,
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
        dateTime: {
          gte: new Date(startTime),
          lt: new Date(endTime),
        },
      },
      include: { service: true },
    });

    // Check if any appointment overlaps (handles timezone consistently using UTC)
    return conflictingAppointments.some((appt) => {
      const apptStart = appt.dateTime.getTime();
      const apptEnd = apptStart + appt.service.duration * 60 * 1000;
      return startTime < apptEnd && endTime > apptStart;
    });
  }
}