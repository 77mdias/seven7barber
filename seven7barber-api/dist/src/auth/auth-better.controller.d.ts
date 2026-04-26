import { PrismaService } from "../prisma/prisma.service";
export declare class BetterAuthController {
    private readonly prisma;
    private auth;
    constructor(prisma: PrismaService);
    signIn(request: Request): Promise<Response>;
    signUp(request: Request): Promise<Response>;
    signOut(request: Request): Promise<Response>;
    getSession(request: Request): Promise<Response>;
}
