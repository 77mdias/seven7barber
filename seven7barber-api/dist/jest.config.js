"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['**/*.spec.ts'],
    moduleNameMapper: {
        '^@prisma/client$': '<rootDir>/__mocks__/@prisma/client.ts',
    },
    transform: {
        '^.+\\.ts$': ['ts-jest', {
                tsconfig: 'tsconfig.json',
                isolatedModules: true,
            }],
    },
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map