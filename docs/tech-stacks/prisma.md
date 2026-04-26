# Tech Stack: Prisma ORM

## Overview
Type-safe ORM for PostgreSQL with Prisma Studio and migrations.

## Schema Definition
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  appointments  Appointment[]
  
  @@map("users")
}

model Appointment {
  id          String   @id @default(uuid())
  status      AppointmentStatus @default(SCHEDULED)
  scheduledAt DateTime
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  @@map("appointments")
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

## Client Usage
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Queries
const users = await prisma.user.findMany({
  where: { email: { contains: '@' } },
  include: { accounts: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
});

// Create
const user = await prisma.user.create({
  data: { email, name, role: 'CLIENT' },
});

// Update
await prisma.user.update({
  where: { id },
  data: { name: 'New Name' },
});

// Delete
await prisma.user.delete({ where: { id } });
```

## Extended Client (Middleware)
```typescript
const xprisma = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, query }) {
        const start = performance.now();
        const result = await query(args);
        console.log(`${model}.${operation} took ${performance.now() - start}ms`);
        return result;
      },
    },
  },
});
```

## Commands
```bash
bun run prisma generate   # Generate client
bun run prisma migrate   # Run migrations
bun run prisma migrate dev # Dev migration
bun run prisma studio    # GUI
bun run prisma db push   # Push schema (dev)
```

## Data Models (Seven7Barber)
- User + Account (OAuth) + Session
- BarberProfile
- Service
- Appointment + ServiceHistory
- Voucher + UserVoucher
- Promotion + UserPromotion
- Review

## Tags
#tech-stack #database #prisma #orm
