import { PrismaService } from '../prisma/prisma.service';
export declare class BarbersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAvailableBarbers(): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        image: string | null;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        image: string | null;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
