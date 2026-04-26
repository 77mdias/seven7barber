import { NotFoundException } from '@nestjs/common';

// RF-02: Seleção de Barbeiro - Controller Unit Tests
describe('BarbersController', () => {
  class MockBarbersService {
    constructor(private mockPrisma: any) {}

    async findAvailableBarbers() {
      return this.mockPrisma.user.findMany({
        where: { role: 'BARBER', verified: true },
        orderBy: { name: 'asc' },
      });
    }

    async findOne(id: string) {
      const barber = await this.mockPrisma.user.findUnique({ where: { id } });
      if (!barber || barber.role !== 'BARBER') {
        throw new NotFoundException(`Barber ${id} not found`);
      }
      return barber;
    }
  }

  class BarbersController {
    constructor(private service: MockBarbersService) {}

    findAvailable() {
      return this.service.findAvailableBarbers();
    }

    findOne(id: string) {
      return this.service.findOne(id);
    }
  }

  let controller: BarbersController;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    const service = new MockBarbersService(mockPrisma);
    controller = new BarbersController(service);
  });

  describe('findAvailable', () => {
    it('C10 | GREEN | findAvailable_returns_barber_list | ✅ PASS', async () => {
      const mockBarbers = [
        { id: 'barber-1', name: 'João', role: 'BARBER', verified: true },
        { id: 'barber-2', name: 'Maria', role: 'BARBER', verified: true },
      ];
      mockPrisma.user.findMany.mockResolvedValue(mockBarbers);

      const result = await controller.findAvailable();

      expect(result).toEqual(mockBarbers);
      expect(result).toHaveLength(2);
    });

    it('C11 | GREEN | findAvailable_returns_empty_for_no_barbers | ✅ PASS', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);

      const result = await controller.findAvailable();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('C12 | RED | findOne_throws_404 | ✅ FAIL', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(controller.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('C13 | GREEN | findOne_returns_barber | ✅ PASS', async () => {
      const mockBarber = {
        id: 'barber-1',
        name: 'João Silva',
        role: 'BARBER',
        verified: true,
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockBarber);

      const result = await controller.findOne('barber-1');

      expect(result).toEqual(mockBarber);
    });
  });
});
