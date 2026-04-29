import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AdminRole } from './interfaces/location.interface';

describe('LocationsService', () => {
  let service: LocationsService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      location: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      locationAdmin: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    prismaService = module.get(PrismaService);
  });

  describe('C1 | RED | should create new location | ✅ FAIL', () => {
    it('should create location with all required fields', async () => {
      const locationData = {
        name: 'Seven7Barber Norte',
        address: 'Rua Norte 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        phone: '+55113333-0001',
        timezone: 'America/Sao_Paulo',
      };

      prismaService.location.create.mockResolvedValue({
        id: 'loc-norte',
        ...locationData,
        email: null,
        isActive: true,
        openingHours: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.createLocation(locationData);

      expect(result.name).toBe('Seven7Barber Norte');
      expect(result.isActive).toBe(true);
    });
  });

  describe('C2 | RED | should assign user favorite location | ✅ FAIL', () => {
    it('should set favorite location for user', async () => {
      const userId = 'user-fav';
      const locationId = 'loc-1';

      // Mock location exists check
      prismaService.location.findUnique.mockResolvedValue({
        id: locationId,
        name: 'Seven7Barber Norte',
        isActive: true,
      } as any);
      prismaService.user.update.mockResolvedValue({
        id: userId,
        favoriteLocationId: locationId,
      } as any);

      const result = await service.setFavoriteLocation(userId, locationId);

      expect(result.favoriteLocationId).toBe(locationId);
    });
  });

  describe('C3 | RED | should get user favorite location | ✅ FAIL', () => {
    it('should return user preferred location', async () => {
      const userId = 'user-get-fav';
      const locationId = 'loc-2';

      // Mock user with favoriteLocation include
      prismaService.user.findUnique.mockResolvedValue({
        id: userId,
        favoriteLocationId: locationId,
        favoriteLocation: {
          id: locationId,
          name: 'Seven7Barber Sul',
          address: 'Rua Sul 456',
          isActive: true,
        },
      } as any);

      const result = await service.getFavoriteLocation(userId);

      expect(result?.name).toBe('Seven7Barber Sul');
    });
  });

  describe('C4 | RED | should filter services by location | ✅ FAIL', () => {
    it('should return only services available at selected location', async () => {
      const locationId = 'loc-services';

      // Mock location check (isActive: true)
      prismaService.location.findUnique.mockResolvedValue({
        id: locationId,
        name: 'Seven7Barber Centro',
        isActive: true,
      } as any);

      // Mock services query
      prismaService.service = prismaService.service || {};
      prismaService.service.findMany = jest.fn().mockResolvedValue([
        { id: 'svc-1', name: 'Corte', isActive: true },
        { id: 'svc-2', name: 'Barba', isActive: true },
      ] as any);

      const services = await service.getLocationServices(locationId);

      expect(services).toHaveLength(2);
      expect(services.map((s: any) => s.name)).toContain('Corte');
    });
  });

  describe('C5 | RED | should filter barbers by location | ✅ FAIL', () => {
    it('should return only barbers working at selected location', async () => {
      const locationId = 'loc-barbers';

      prismaService.location.findUnique.mockResolvedValue({
        id: locationId,
        name: 'Seven7Barber Centro',
        isActive: true,
      } as any);

      // Mock barbers query
      prismaService.user = prismaService.user || {};
      prismaService.user.findMany = jest.fn().mockResolvedValue([
        { id: 'barber-1', name: 'João', role: 'BARBER', isActive: true },
        { id: 'barber-2', name: 'Maria', role: 'BARBER', isActive: true },
      ] as any);

      const barbers = await service.getLocationBarbers(locationId);

      expect(barbers).toHaveLength(2);
    });
  });

  describe('C6 | RED | should check location admin access | ✅ FAIL', () => {
    it('should return true if user is location admin', async () => {
      const userId = 'user-loc-admin';
      const locationId = 'loc-1';

      prismaService.locationAdmin.findFirst.mockResolvedValue({
        id: 'admin-1',
        userId,
        locationId,
        role: AdminRole.LOCATION_ADMIN,
      } as any);

      const result = await service.isLocationAdmin(userId, locationId);

      expect(result).toBe(true);
    });
  });

  describe('C7 | RED | should deny access to non-admin for other location | ✅ FAIL', () => {
    it('should return false if user is admin of different location', async () => {
      const userId = 'user-other-admin';
      const locationId = 'loc-different';

      prismaService.locationAdmin.findFirst.mockResolvedValue({
        id: 'admin-other',
        userId,
        locationId: 'loc-other', // Different location
        role: AdminRole.LOCATION_ADMIN,
      } as any);

      const result = await service.isLocationAdmin(userId, locationId);

      expect(result).toBe(false);
    });
  });

  describe('C8 | RED | should allow super admin access to all locations | ✅ FAIL', () => {
    it('should return true if user is super admin', async () => {
      const userId = 'user-super';
      const locationId = 'loc-any';

      prismaService.locationAdmin.findFirst.mockResolvedValue({
        id: 'admin-super',
        userId,
        locationId: '*', // Super admin has access to all
        role: AdminRole.SUPER_ADMIN,
      } as any);

      const result = await service.isLocationAdmin(userId, locationId);

      expect(result).toBe(true);
    });
  });

  describe('C9 | RED | should get all locations for client booking | ✅ FAIL', () => {
    it('should return all active locations for client', async () => {
      prismaService.location.findMany.mockResolvedValue([
        { id: 'loc-1', name: 'Centro', isActive: true },
        { id: 'loc-2', name: 'Norte', isActive: true },
        { id: 'loc-3', name: 'Sul', isActive: true },
      ] as any);

      const result = await service.getAllActiveLocations();

      expect(result).toHaveLength(3);
    });
  });

  describe('C10 | RED | should get aggregated stats for super admin | ✅ FAIL', () => {
    it('should aggregate stats across all locations', async () => {
      const superAdminId = 'user-super';

      prismaService.locationAdmin.findFirst.mockResolvedValue({
        userId: superAdminId,
        role: AdminRole.SUPER_ADMIN,
      } as any);

      prismaService.location.findMany.mockResolvedValue([
        { id: 'loc-1', name: 'Centro', appointments: { count: 100 } },
        { id: 'loc-2', name: 'Norte', appointments: { count: 80 } },
      ] as any);

      const result = await service.getAggregatedStats(superAdminId);

      expect(result.totalLocations).toBe(2);
    });
  });

  describe('C11 | RED | should prevent booking at inactive location | ✅ FAIL', () => {
    it('should throw BadRequestException for inactive location', async () => {
      const locationId = 'loc-inactive';

      prismaService.location.findUnique.mockResolvedValue({
        id: locationId,
        name: 'Closed Location',
        isActive: false,
      } as any);

      await expect(service.getLocationServices(locationId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('C12 | RED | should create location-specific admin | ✅ FAIL', () => {
    it('should assign LOCATION_ADMIN role to user for specific location', async () => {
      const userId = 'user-new-admin';
      const locationId = 'loc-1';

      prismaService.location.findUnique.mockResolvedValue({
        id: locationId,
        name: 'Seven7Barber Norte',
        isActive: true,
      } as any);
      prismaService.locationAdmin.create.mockResolvedValue({
        id: 'admin-new',
        userId,
        locationId,
        role: AdminRole.LOCATION_ADMIN,
        createdAt: new Date(),
      } as any);

      const result = await service.createLocationAdmin(userId, locationId);

      expect(result.role).toBe(AdminRole.LOCATION_ADMIN);
      expect(result.locationId).toBe(locationId);
    });
  });
});
