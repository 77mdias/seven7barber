import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateServiceDto,
} from './dto/create-service.dto';
import {
  UpdateServiceDto,
} from './dto/update-service.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`Service ${id} not found`);
    return service;
  }

  async create(dto: CreateServiceDto) {
    // M3: Zod validation already done in controller - dto is already parsed
    return this.prisma.service.create({
      data: {
        ...dto,
        price: dto.price as unknown as Prisma.Decimal,
      },
    });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    // M3: Zod validation already done in controller - dto is already parsed
    return this.prisma.service.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.price !== undefined && {
          price: dto.price,
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
