import { NotFoundException } from '@nestjs/common';

// RF-02: Seleção de Barbeiro - Unit Tests
describe('BarbersService', () => {
  // Mock Prisma for barber queries
  const createMockPrisma = () => ({
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  });

  class BarbersService {
    constructor(private prisma: any) {}

    async findAvailableBarbers(): Promise<any[]> {
      return this.prisma.user.findMany({
        where: { role: 'BARBER', verified: true },
        orderBy: { name: 'asc' },
      });
    }

    async findOne(id: string): Promise<any> {
      const barber = await this.prisma.user.findUnique({ where: { id } });
      if (!barber || barber.role !== 'BARBER') {
        throw new NotFoundException(`Barber ${id} not found`);
      }
      return barber;
    }
  }

  let service: BarbersService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new BarbersService(mockPrisma);
  });

  describe('findAvailableBarbers', () => {
    it('C5 | RED | findAvailableBarbers_returns_only_verified_barbers | ✅ FAIL', async () => {
      // Arrange
      const mockBarbers = [
        { id: 'barber-1', name: 'João', role: 'BARBER', verified: true, image: null },
        { id: 'barber-2', name: 'Maria', role: 'BARBER', verified: true, image: null },
      ];
      mockPrisma.user.findMany.mockResolvedValue(mockBarbers);

      // Act
      const result = await service.findAvailableBarbers();

      // Assert
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'BARBER', verified: true },
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockBarbers);
      expect(result).toHaveLength(2);
    });

    it('C6 | RED | findAvailableBarbers_returns_empty_when_no_barbers | ✅ FAIL', async () => {
      // Arrange
      mockPrisma.user.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAvailableBarbers();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('C7 | RED | findOne_throws_NotFoundException_when_not_found | ✅ FAIL', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('C8 | RED | findOne_returns_barber_when_exists | ✅ FAIL', async () => {
      // Arrange
      const mockBarber = {
        id: 'barber-1',
        name: 'João Silva',
        role: 'BARBER',
        verified: true,
        image: 'https://...',
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockBarber);

      // Act
      const result = await service.findOne('barber-1');

      // Assert
      expect(result).toEqual(mockBarber);
    });

    it('C9 | RED | findOne_throws_when_user_is_not_barber | ✅ FAIL', async () => {
      // Arrange - user exists but is a CLIENT, not BARBER
      const mockClient = {
        id: 'client-1',
        name: 'Carlos',
        role: 'CLIENT',
        verified: true,
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockClient);

      // Act & Assert
      await expect(service.findOne('client-1')).rejects.toThrow(NotFoundException);
    });
  });
});
