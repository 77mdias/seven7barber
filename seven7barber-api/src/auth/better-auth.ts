import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../prisma/prisma.service';

export const createBetterAuth = (prisma: PrismaService) => {
  return betterAuth({
    baseURL:
      process.env.API_URL ||
      process.env.BETTER_AUTH_URL ||
      'http://localhost:3000',
    basePath: '/auth',
    trustedOrigins: [
      'http://localhost:3001',
      'http://localhost:5173',
      'http://0.0.0.0:3001',
    ],
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 24 hours
    },
  });
};
