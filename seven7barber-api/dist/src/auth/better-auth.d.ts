import { PrismaService } from "../prisma/prisma.service";
export declare const createBetterAuth: (prisma: PrismaService) => import("better-auth", { with: { "resolution-mode": "import" } }).Auth<{
    database: any;
    emailAndPassword: {
        enabled: true;
        minPasswordLength: number;
    };
    session: {
        expiresIn: number;
        updateAge: number;
    };
}>;
