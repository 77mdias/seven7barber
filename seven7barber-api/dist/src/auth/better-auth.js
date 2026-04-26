"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBetterAuth = void 0;
const better_auth_1 = require("better-auth");
const prisma_adapter_1 = require("better-auth/dist/adapters/prisma-adapter");
const createBetterAuth = (prisma) => {
    return (0, better_auth_1.betterAuth)({
        database: (0, prisma_adapter_1.prismaAdapter)(prisma, {
            provider: "postgresql",
        }),
        emailAndPassword: {
            enabled: true,
            minPasswordLength: 6,
        },
        session: {
            expiresIn: 60 * 60 * 24 * 7,
            updateAge: 60 * 60 * 24,
        },
    });
};
exports.createBetterAuth = createBetterAuth;
//# sourceMappingURL=better-auth.js.map