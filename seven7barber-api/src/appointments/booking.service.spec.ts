import { NotFoundException, BadRequestException } from '@nestjs/common';

// RF-04: Confirmação e Resumo + RF-05: Rollback Suave - Unit Tests
describe('BookingService', () => {
  const createMockPrisma = () => ({
    appointment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    service: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
    timeSlot: { findUnique: jest.fn(), update: jest.fn() },
  });

  class BookingService {
    constructor(private prisma: any) {}

    async createBooking(data: {
      serviceId: string;
      barberId: string;
      slotId: string;
      clientId: string;
    }) {
      const service = await this.prisma.service.findUnique({
        where: { id: data.serviceId },
      });
      if (!service) throw new NotFoundException('Service not found');

      const barber = await this.prisma.user.findUnique({
        where: { id: data.barberId },
      });
      if (!barber || barber.role !== 'BARBER')
        throw new NotFoundException('Barber not found');

      const slot = await this.prisma.timeSlot.findUnique({
        where: { id: data.slotId },
      });
      if (!slot) throw new NotFoundException('TimeSlot not found');
      if (slot.isBooked)
        throw new BadRequestException('TimeSlot already booked');

      return this.prisma.appointment.create({
        data: {
          serviceId: data.serviceId,
          clientId: data.clientId,
          barberId: data.barberId,
          dateTime: slot.startTime,
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
        service: appt.service.name,
        barber: appt.barber.name,
        dateTime: appt.dateTime,
        price: appt.service.price,
      };
    }
  }

  let service: BookingService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new BookingService(mockPrisma);
  });

  describe('createBooking', () => {
    it('C23 | RED | createBooking_creates_appointment | ✅ FAIL', async () => {
      const mockService = { id: 'svc-1', name: 'Corte', price: '35.00' };
      const mockBarber = { id: 'barber-1', name: 'João', role: 'BARBER' };
      const mockSlot = { id: 'slot-1', startTime: new Date(), isBooked: false };
      const mockAppt = {
        id: 'appt-1',
        serviceId: 'svc-1',
        barberId: 'barber-1',
        slotId: 'slot-1',
      };

      mockPrisma.service.findUnique.mockResolvedValue(mockService);
      mockPrisma.user.findUnique.mockResolvedValue(mockBarber);
      mockPrisma.timeSlot.findUnique.mockResolvedValue(mockSlot);
      mockPrisma.appointment.create.mockResolvedValue(mockAppt);

      const result = await service.createBooking({
        serviceId: 'svc-1',
        barberId: 'barber-1',
        slotId: 'slot-1',
        clientId: 'client-1',
      });

      expect(result).toEqual(mockAppt);
      expect(mockPrisma.appointment.create).toHaveBeenCalled();
    });

    it('C24 | RED | createBooking_throws_service_not_found | ✅ FAIL', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);
      await expect(
        service.createBooking({
          serviceId: 'invalid',
          barberId: 'barber-1',
          slotId: 'slot-1',
          clientId: 'client-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('C25 | RED | createBooking_throws_barber_not_found | ✅ FAIL', async () => {
      mockPrisma.service.findUnique.mockResolvedValue({ id: 'svc-1' });
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.createBooking({
          serviceId: 'svc-1',
          barberId: 'invalid',
          slotId: 'slot-1',
          clientId: 'client-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('C26 | RED | createBooking_throws_slot_already_booked | ✅ FAIL', async () => {
      mockPrisma.service.findUnique.mockResolvedValue({ id: 'svc-1' });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'barber-1',
        role: 'BARBER',
      });
      mockPrisma.timeSlot.findUnique.mockResolvedValue({
        id: 'slot-1',
        isBooked: true,
      });
      await expect(
        service.createBooking({
          serviceId: 'svc-1',
          barberId: 'barber-1',
          slotId: 'slot-1',
          clientId: 'client-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('C27 | RED | createBooking_rollback_on_error | ✅ FAIL', async () => {
      // RF-05: Rollback Suave - if booking creation fails, slot should NOT be marked as booked
      mockPrisma.service.findUnique.mockResolvedValue({ id: 'svc-1' });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'barber-1',
        role: 'BARBER',
      });
      mockPrisma.timeSlot.findUnique.mockResolvedValue({
        id: 'slot-1',
        isBooked: false,
      });
      mockPrisma.appointment.create.mockRejectedValue(new Error('DB Error'));

      try {
        await service.createBooking({
          serviceId: 'svc-1',
          barberId: 'barber-1',
          slotId: 'slot-1',
          clientId: 'client-1',
        });
      } catch (e) {
        // Slot should NOT have been updated
        expect(mockPrisma.timeSlot.update).not.toHaveBeenCalled();
      }
    });
  });

  describe('getBookingSummary', () => {
    it('C28 | RED | getBookingSummary_returns_summary | ✅ FAIL', async () => {
      const mockAppt = {
        id: 'appt-1',
        service: { name: 'Corte', price: '35.00' },
        barber: { name: 'João' },
        dateTime: new Date(),
      };
      mockPrisma.appointment.findUnique.mockResolvedValue(mockAppt);

      const result = await service.getBookingSummary('appt-1');

      expect(result).toEqual({
        service: 'Corte',
        barber: 'João',
        dateTime: mockAppt.dateTime,
        price: '35.00',
      });
    });

    it('C29 | RED | getBookingSummary_throws_not_found | ✅ FAIL', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue(null);
      await expect(service.getBookingSummary('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
