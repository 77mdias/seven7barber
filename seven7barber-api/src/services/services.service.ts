import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateServiceDto,
  CreateServiceSchema,
} from './dto/create-service.dto';
import {
  UpdateServiceDto,
  UpdateServiceSchema,
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
    const parsed = CreateServiceSchema.parse(dto);
    return this.prisma.service.create({
      data: {
        ...parsed,
        price: parsed.price as unknown as Prisma.Decimal,
      },
    });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    const parsed = UpdateServiceSchema.parse(dto);
    return this.prisma.service.update({
      where: { id },
      data: {
        ...parsed,
        ...(parsed.price !== undefined && {
          price: parsed.price,
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
