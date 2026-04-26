import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Prisma } from '@prisma/client';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: Prisma.Decimal;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: Prisma.Decimal;
        isActive: boolean;
    }>;
    create(dto: CreateServiceDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: Prisma.Decimal;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: Prisma.Decimal;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: Prisma.Decimal;
        isActive: boolean;
    }>;
}
