import { PrismaService } from "../prisma/prisma.service";
export declare class BetterAuthController {
    private readonly prisma;
    private auth;
    private handler;
    constructor(prisma: PrismaService);
    handleAll(req: any, res: any): Promise<void>;
}
