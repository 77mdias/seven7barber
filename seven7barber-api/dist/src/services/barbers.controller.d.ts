import { BarbersService } from './barbers.service';
export declare class BarbersController {
    private readonly barbersService;
    constructor(barbersService: BarbersService);
    findAvailable(): Promise<{
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
