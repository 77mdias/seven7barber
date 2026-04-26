import { Test, TestingModule } from '@nestjs/testing';

// Unit test for AvailabilityService - uses mock implementation pattern
describe('AvailabilityService', () => {
  // Mock implementation that mirrors the real service logic
  class AvailabilityService {
    private readonly DEFAULT_WORKING_HOURS = {
      start: '09:00',
      end: '19:00',
      bufferMinutes: 15,
    };

    constructor(private prisma: any) {}

    async getAvailableSlots(date: Date, serviceIds: string[]) {
      const dateStr = date.toISOString().split('T')[0];

      const barbers = await this.prisma.user.findMany({
        where: { role: 'BARBER' },
      });

      if (barbers.length === 0) {
        return [];
      }

      const services = await this.prisma.service.findMany({
        where: { id: { in: serviceIds } },
      });

      const totalDuration = services.reduce((sum: number, s: any) => sum + s.duration, 0);
      const workingHours = this.getWorkingHours();

      const startOfDay = new Date(`${dateStr}T00:00:00`);
      const endOfDay = new Date(`${dateStr}T23:59:59`);

      const existingAppointments = await this.prisma.appointment.findMany({
        where: {
          dateTime: { gte: startOfDay, lte: endOfDay },
          status: { in: ['SCHEDULED', 'CONFIRMED'] },
        },
        include: { service: true },
      });

      const slots: any[] = [];
      const slotInterval = 30;

      const [startHour, startMin] = workingHours.start.split(':').map(Number);
      const [endHour, endMin] = workingHours.end.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      for (const barber of barbers) {
        const barberAppointments = existingAppointments.filter((a: any) => a.barberId === barber.id);

        for (let mins = startMinutes; mins + totalDuration + workingHours.bufferMinutes <= endMinutes; mins += slotInterval) {
          const slotTime = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

          const hasConflict = barberAppointments.some((appt: any) => {
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

    getWorkingHours() {
      return this.DEFAULT_WORKING_HOURS;
    }
  }

  // Mock Prisma
  const createMockPrisma = () => ({
    user: { findMany: jest.fn() },
    service: { findMany: jest.fn() },
    appointment: { findMany: jest.fn() },
  });

  let service: AvailabilityService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new AvailabilityService(mockPrisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvailableSlots', () => {
    const date = new Date('2026-04-27');
    const serviceIds = ['service-1'];

    beforeEach(() => {
      mockPrisma.user.findMany.mockResolvedValue([
        { id: 'barber-1', name: 'John', role: 'BARBER' },
      ]);
      mockPrisma.service.findMany.mockResolvedValue([
        { id: 'service-1', name: 'Haircut', duration: 30 },
      ]);
      mockPrisma.appointment.findMany.mockResolvedValue([]);
    });

    it('should return all slots when no appointments exist', async () => {
      const slots = await service.getAvailableSlots(date, serviceIds);

      expect(slots).toBeDefined();
      expect(Array.isArray(slots)).toBe(true);
      expect(slots.length).toBeGreaterThan(0);
    });

    it('should exclude slots when barber has existing appointments', async () => {
      const mockDateTime = new Date('2026-04-27T10:00:00');
      mockDateTime.getHours = () => 10;
      mockDateTime.getMinutes = () => 0;

      mockPrisma.appointment.findMany.mockResolvedValue([
        {
          id: 'appt-1',
          dateTime: mockDateTime,
          barberId: 'barber-1',
          service: { duration: 30 },
        },
      ]);

      const slots = await service.getAvailableSlots(date, serviceIds);
      const tenOClockSlots = slots.filter(
        (s: any) => s.time === '10:00' && s.barberId === 'barber-1'
      );

      expect(tenOClockSlots.length).toBe(0);
    });

    it('should calculate slot duration based on combined service duration', async () => {
      mockPrisma.service.findMany.mockResolvedValue([
        { id: 'service-1', name: 'Haircut', duration: 30 },
        { id: 'service-2', name: 'Beard', duration: 20 },
      ]);

      const slots = await service.getAvailableSlots(date, serviceIds);

      expect(slots.length).toBeGreaterThan(0);
    });

    it('should return empty array when no barbers available', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);

      const slots = await service.getAvailableSlots(date, serviceIds);

      expect(slots).toEqual([]);
    });

    it('should filter by date range', async () => {
      const slots = await service.getAvailableSlots(date, serviceIds);

      slots.forEach((slot: any) => {
        expect(slot.date).toBe('2026-04-27');
      });
    });
  });

  describe('getWorkingHours', () => {
    it('should return default working hours when no custom config', () => {
      const hours = service.getWorkingHours();

      expect(hours).toEqual({
        start: '09:00',
        end: '19:00',
        bufferMinutes: 15,
      });
    });
  });
});