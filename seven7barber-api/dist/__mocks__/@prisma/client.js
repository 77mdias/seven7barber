"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = exports.PrismaClient = void 0;
exports.PrismaClient = jest.fn().mockImplementation(() => ({
    service: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));
exports.Prisma = {
    Decimal: jest.fn(),
};
//# sourceMappingURL=client.js.map