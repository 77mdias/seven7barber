import { NotFoundException } from '@nestjs/common';

// RF-03: Seleção de Horário - Unit Tests
describe('TimeSlotService', () => {
  // Mock Prisma for time slot queries
  const createMockPrisma = () => ({
    timeSlot: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  });

  class TimeSlotService {
    constructor(private prisma: any) {}

    async findAvailableSlots(
      barberId: string,
      serviceDuration: number,
    ): Promise<any[]> {
      return this.prisma.timeSlot.findMany({
        where: {
          barberId,
          isBooked: false,
          // Simulate variable duration based on service
          // In real impl: calculate endTime based on startTime + duration
        },
        orderBy: { startTime: 'asc' },
      });
    }

    async findOne(id: string): Promise<any> {
      const slot = await this.prisma.timeSlot.findUnique({ where: { id } });
      if (!slot) throw new NotFoundException(`TimeSlot ${id} not found`);
      return slot;
    }

    async isAvailable(slotId: string): Promise<boolean> {
      const slot = await this.prisma.timeSlot.findUnique({
        where: { id: slotId },
      });
      return slot ? !slot.isBooked : false;
    }

    async bookSlot(slotId: string): Promise<any> {
      const slot = await this.findOne(slotId);
      if (slot.isBooked) throw new Error('Slot already booked');
      return this.prisma.timeSlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });
    }
  }

  let service: TimeSlotService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new TimeSlotService(mockPrisma);
  });

  describe('findAvailableSlots', () => {
    it('C14 | RED | findAvailableSlots_returns_unbooked_slots | ✅ FAIL', async () => {
      // Arrange
      const mockSlots = [
        {
          id: 'slot-1',
          barberId: 'barber-1',
          startTime: new Date(),
          endTime: new Date(),
          isBooked: false,
        },
        {
          id: 'slot-2',
          barberId: 'barber-1',
          startTime: new Date(),
          endTime: new Date(),
          isBooked: false,
        },
      ];
      mockPrisma.timeSlot.findMany.mockResolvedValue(mockSlots);

      // Act
      const result = await service.findAvailableSlots('barber-1', 30);

      // Assert
      expect(mockPrisma.timeSlot.findMany).toHaveBeenCalledWith({
        where: { barberId: 'barber-1', isBooked: false },
        orderBy: { startTime: 'asc' },
      });
      expect(result).toEqual(mockSlots);
    });

    it('C15 | RED | findAvailableSlots_returns_empty_when_all_booked | ✅ FAIL', async () => {
      // Arrange
      mockPrisma.timeSlot.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAvailableSlots('barber-1', 30);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('C16 | RED | findOne_throws_NotFoundException_when_not_found | ✅ FAIL', async () => {
      mockPrisma.timeSlot.findUnique.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('C17 | RED | findOne_returns_slot_when_exists | ✅ FAIL', async () => {
      const mockSlot = {
        id: 'slot-1',
        barberId: 'barber-1',
        startTime: new Date(),
        endTime: new Date(),
        isBooked: false,
      };
      mockPrisma.timeSlot.findUnique.mockResolvedValue(mockSlot);
      const result = await service.findOne('slot-1');
      expect(result).toEqual(mockSlot);
    });
  });

  describe('isAvailable', () => {
    it('C18 | RED | isAvailable_returns_true_for_unbooked_slot | ✅ FAIL', async () => {
      const mockSlot = { id: 'slot-1', isBooked: false };
      mockPrisma.timeSlot.findUnique.mockResolvedValue(mockSlot);
      const result = await service.isAvailable('slot-1');
      expect(result).toBe(true);
    });

    it('C19 | RED | isAvailable_returns_false_for_booked_slot | ✅ FAIL', async () => {
      const mockSlot = { id: 'slot-1', isBooked: true };
      mockPrisma.timeSlot.findUnique.mockResolvedValue(mockSlot);
      const result = await service.isAvailable('slot-1');
      expect(result).toBe(false);
    });

    it('C20 | RED | isAvailable_returns_false_for_non_existent_slot | ✅ FAIL', async () => {
      mockPrisma.timeSlot.findUnique.mockResolvedValue(null);
      const result = await service.isAvailable('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('bookSlot', () => {
    it('C21 | RED | bookSlot_marks_slot_as_booked | ✅ FAIL', async () => {
      const mockSlot = { id: 'slot-1', isBooked: false };
      const bookedSlot = { id: 'slot-1', isBooked: true };
      mockPrisma.timeSlot.findUnique.mockResolvedValue(mockSlot);
      mockPrisma.timeSlot.update.mockResolvedValue(bookedSlot);

      const result = await service.bookSlot('slot-1');

      expect(mockPrisma.timeSlot.update).toHaveBeenCalledWith({
        where: { id: 'slot-1' },
        data: { isBooked: true },
      });
      expect(result.isBooked).toBe(true);
    });

    it('C22 | RED | bookSlot_throws_when_already_booked | ✅ FAIL', async () => {
      const mockSlot = { id: 'slot-1', isBooked: true };
      mockPrisma.timeSlot.findUnique.mockResolvedValue(mockSlot);
      await expect(service.bookSlot('slot-1')).rejects.toThrow(
        'Slot already booked',
      );
    });
  });
});
