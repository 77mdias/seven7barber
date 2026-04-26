import type { CreateServiceDto } from './dto/create-service.dto';
import type { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: import("@prisma/client/runtime/client").Decimal;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: import("@prisma/client/runtime/client").Decimal;
        isActive: boolean;
    }>;
    create(dto: CreateServiceDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: import("@prisma/client/runtime/client").Decimal;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: import("@prisma/client/runtime/client").Decimal;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        duration: number;
        price: import("@prisma/client/runtime/client").Decimal;
        isActive: boolean;
    }>;
}
