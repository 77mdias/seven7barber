import { PrismaService } from "../prisma/prisma.service";
export declare const createBetterAuth: (prisma: PrismaService) => import("better-auth", { with: { "resolution-mode": "import" } }).Auth<{
    database: (options: import("better-auth", { with: { "resolution-mode": "import" } }).BetterAuthOptions) => import("better-auth", { with: { "resolution-mode": "import" } }).DBAdapter<import("better-auth", { with: { "resolution-mode": "import" } }).BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
        minPasswordLength: number;
    };
    session: {
        expiresIn: number;
        updateAge: number;
    };
}>;
