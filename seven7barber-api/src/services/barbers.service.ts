import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BarbersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableBarbers() {
    // M4: Exclude password from response
    return this.prisma.user.findMany({
      where: { role: 'BARBER', verified: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    // M4: Exclude password from response
    const barber = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });
    if (!barber || barber.role !== 'BARBER') {
      throw new NotFoundException(`Barber ${id} not found`);
    }
    return barber;
  }
}
