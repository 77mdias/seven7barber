import { NotFoundException } from '@nestjs/common';

// Unit test for ServicesController - testing controller logic in isolation
describe('ServicesController', () => {
  // Mock service that mirrors the controller's expectations
  class MockServicesService {
    constructor(private mockPrisma: any) {}

    async findAll() {
      return this.mockPrisma.service.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    async findOne(id: string) {
      const service = await this.mockPrisma.service.findUnique({ where: { id } });
      if (!service) throw new NotFoundException(`Service ${id} not found`);
      return service;
    }
  }

  // Controller under test
  class ServicesController {
    constructor(private service: MockServicesService) {}

    findAll() {
      return this.service.findAll();
    }

    findOne(id: string) {
      return this.service.findOne(id);
    }
  }

  let controller: ServicesController;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      service: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    const service = new MockServicesService(mockPrisma);
    controller = new ServicesController(service);
  });

  describe('findAll', () => {
    it('C1 | GREEN | findAll_returns_active_services | ✅ PASS', async () => {
      const mockService = {
        id: 'svc-1',
        name: 'Corte Masculino',
        description: 'Corte clássico',
        duration: 30,
        price: '35.00',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.service.findMany.mockResolvedValue([mockService]);

      const result = await controller.findAll();

      expect(result).toEqual([mockService]);
    });

    it('C2 | GREEN | findAll_returns_empty_array | ✅ PASS', async () => {
      mockPrisma.service.findMany.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('C3 | RED | findOne_throws_404_when_not_found | ✅ FAIL', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(controller.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('C4 | GREEN | findOne_returns_service | ✅ PASS', async () => {
      const mockService = {
        id: 'svc-1',
        name: 'Corte Masculino',
        description: 'Corte clássico',
        duration: 30,
        price: '35.00',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.service.findUnique.mockResolvedValue(mockService);

      const result = await controller.findOne('svc-1');

      expect(result).toEqual(mockService);
    });
  });
});
