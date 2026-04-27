import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminRole, OpeningHours } from './interfaces/location.interface';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async createLocation(data: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email?: string;
    timezone?: string;
  }): Promise<any> {
    return this.prisma.location.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
        email: data.email,
        timezone: data.timezone || 'America/Sao_Paulo',
        isActive: true,
      },
    });
  }

  async setFavoriteLocation(userId: string, locationId: string): Promise<any> {
    const location = await this.prisma.location.findUnique({ where: { id: locationId } });
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { favoriteLocationId: locationId },
    });
  }

  async getFavoriteLocation(userId: string): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { favoriteLocation: true },
    });

    return user?.favoriteLocation || null;
  }

  async getLocationServices(locationId: string): Promise<any[]> {
    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    if (!location.isActive) {
      throw new BadRequestException('Location is not active');
    }

    // In production, would have location-specific services
    // For now, return all active services
    return this.prisma.service.findMany({
      where: { isActive: true },
    });
  }

  async getLocationBarbers(locationId: string): Promise<any[]> {
    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    if (!location.isActive) {
      throw new BadRequestException('Location is not active');
    }

    // In production, would filter barbers by location assignment
    // For now, return all barbers
    return this.prisma.user.findMany({
      where: { role: 'BARBER' as any },
    });
  }

  async isLocationAdmin(userId: string, locationId: string): Promise<boolean> {
    const admin = await this.prisma.locationAdmin.findFirst({
      where: { userId },
    });

    if (!admin) {
      return false;
    }

    if (admin.role === AdminRole.SUPER_ADMIN) {
      return true;
    }

    return admin.locationId === locationId;
  }

  async getAllActiveLocations(): Promise<any[]> {
    return this.prisma.location.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getAggregatedStats(userId: string): Promise<{ totalLocations: number; locations: any[] }> {
    const admin = await this.prisma.locationAdmin.findFirst({
      where: { userId },
    });

    if (!admin || admin.role !== AdminRole.SUPER_ADMIN) {
      throw new BadRequestException('Not authorized. Super admin access required.');
    }

    const locations = await this.prisma.location.findMany({
      include: {
        appointments: { select: { id: true } },
      },
    });

    return {
      totalLocations: locations.length,
      locations: locations.map(loc => ({
        id: loc.id,
        name: loc.name,
        appointmentCount: loc.appointments.length,
      })),
    };
  }

  async createLocationAdmin(userId: string, locationId: string, role: AdminRole = AdminRole.LOCATION_ADMIN): Promise<any> {
    const location = await this.prisma.location.findUnique({ where: { id: locationId } });
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return this.prisma.locationAdmin.create({
      data: {
        userId,
        locationId,
        role,
      },
    });
  }

  async deactivateLocation(locationId: string): Promise<void> {
    await this.prisma.location.update({
      where: { id: locationId },
      data: { isActive: false },
    });

    // In production: handle existing bookings gracefully
  }

  async updateOpeningHours(locationId: string, hours: OpeningHours[]): Promise<any> {
    return this.prisma.location.update({
      where: { id: locationId },
      data: { openingHours: hours as any },
    });
  }
}