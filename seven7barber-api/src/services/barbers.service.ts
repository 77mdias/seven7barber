import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BarbersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableBarbers() {
    return this.prisma.user.findMany({
      where: { role: 'BARBER', verified: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const barber = await this.prisma.user.findUnique({ where: { id } });
    if (!barber || barber.role !== 'BARBER') {
      throw new NotFoundException(`Barber ${id} not found`);
    }
    return barber;
  }
}
