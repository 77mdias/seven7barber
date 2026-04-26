# Tempest Seven7Barber - Technical Specification

**Version:** 1.0
**Date:** 2026-04-24
**Status:** ✅ Final (Implementation Complete)

---

## 1. Overview

This document outlines the technical architecture, data models, API contracts, and implementation guidelines for the Tempest Seven7Barber system.

---

## 2. Repository Structure

### Monorepo (Recommended)
```
seven7barber/
├── apps/
│   ├── web/           # Vinext frontend
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── api/           # NestJS backend
│   │   ├── src/
│   │   ├── test/
│   │   ├── package.json
│   │   └── nest-cli.json
├── packages/
│   └── shared/        # Shared types and schemas
│       ├── types/
│       └── zod-schemas/
├── docker-compose.yml
├── package.json
└── bun.lockb
```

### Alternative: Separate Repos
- `seven7barber-web` - Frontend only (Cloudflare Pages)
- `seven7barber-api` - Backend only (Render)

**Recommendation:** Separate repos for clearer portfolio presentation.

---

## 3. Frontend (Vinext/Next.js)

### Tech Stack
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod
- **State:** React Context + Server Actions
- **Package Manager:** Bun

### Directory Structure
```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Auth group
│   │   ├── signin/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── (main)/            # Main app group
│   │   ├── page.tsx       # Home
│   │   ├── services/
│   │   ├── scheduling/
│   │   ├── dashboard/
│   │   └── profile/
│   └── api/               # API routes (if needed)
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── home/              # Home page components
│   ├── booking/           # Booking wizard components
│   └── dashboard/         # Dashboard components
├── lib/
│   ├── prisma.ts          # Prisma client (if used)
│   ├── auth.ts            # NextAuth config
│   └── utils.ts           # Helpers (cn)
├── server/
│   └── actions/           # Server Actions
└── types/                 # TypeScript types
```

### Key Configuration

**Vite/Next.js Config:**
```typescript
// vite.config.ts (Vinext)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

**Tailwind Config:**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#732F3B',
        'primary-dark': '#401021',
        black: '#111111',
        'dark-gray': '#272727',
        muted: '#bababa',
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Design System Integration
- Primary button: `bg-primary hover:bg-primary-dark text-white`
- Dark button: `bg-black hover:bg-primary text-white`
- Card: `bg-white border border-gray-200 p-6`
- Section: `bg-light py-16` (alternating)
- Hero: `bg-black text-white` with gradient overlay

---

## 4. Backend (NestJS)

### Tech Stack
- **Framework:** NestJS 10+
- **Language:** TypeScript (strict mode)
- **ORM:** Prisma
- **Validation:** Zod + class-validator
- **Testing:** Vitest + Supertest
- **Package Manager:** Bun

### Directory Structure
```
src/
├── main.ts
├── app.module.ts
├── auth/                 # Auth module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   ├── guards/
│   └── dto/
├── users/               # Users module
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── appointments/        # Appointments module
│   ├── appointments.controller.ts
│   ├── appointments.service.ts
│   ├── dto/
│   └── exceptions/
├── services/            # Services catalog module
├── reviews/             # Reviews module
├── vouchers/            # Vouchers module
├── payments/            # Payment integration module
├── admin/               # Admin dashboard module
└── common/              # Shared utilities
    ├── decorators/
    ├── filters/
    ├── interceptors/
    └── pipes/
```

### Database (Prisma Schema)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CLIENT
  BARBER
  ADMIN
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum VoucherType {
  FREE_SERVICE
  DISCOUNT_PERCENTAGE
  DISCOUNT_FIXED
  CASHBACK
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  password      String?
  role          Role      @default(CLIENT)
  verified      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  appointments  Appointment[]
  serviceHistory ServiceHistory[]
  vouchers      UserVoucher[]
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model BarberProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  bio         String?
  rating      Float    @default(0)
  reviewCount Int      @default(0)
  isActive    Boolean  @default(true)

  user        User     @relation(fields: [userId], references: [id])
  appointments Appointment[]
}

model Service {
  id          String   @id @default(cuid())
  name        String
  description String?
  duration    Int      // minutes
  price       Float
  category    String?
  isActive    Boolean  @default(true)
  image       String?

  appointments    Appointment[]
  serviceHistory  ServiceHistory[]

  @@index([category])
}

model Appointment {
  id        String   @id @default(cuid())
  clientId  String
  barberId  String
  serviceId String
  dateTime  DateTime
  status    AppointmentStatus @default(SCHEDULED)
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  client     User           @relation(fields: [clientId], references: [id])
  barber     BarberProfile  @relation(fields: [barberId], references: [id])
  service    Service        @relation(fields: [serviceId], references: [id])

  @@index([clientId])
  @@index([barberId])
  @@index([dateTime])
}

model ServiceHistory {
  id           String   @id @default(cuid())
  appointmentId String   @unique
  userId       String
  serviceId    String
  rating       Int?
  feedback     String?
  images       String[]
  paymentMethod String?
  paymentStatus String?
  createdAt    DateTime @default(now())

  appointment Appointment @relation(fields: [appointmentId], references: [id])
  user        User        @relation(fields: [userId], references: [id])
  service     Service      @relation(fields: [serviceId], references: [id])
}

model Voucher {
  id          String     @id @default(cuid())
  code        String     @unique
  type        VoucherType
  value       Float
  minServices Int        @default(1)
  expiresAt   DateTime?
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())

  users UserVoucher[]
}

model UserVoucher {
  id        String    @id @default(cuid())
  userId    String
  voucherId String
  usedAt    DateTime?

  user    User    @relation(fields: [userId], references: [id])
  voucher Voucher @relation(fields: [voucherId], references: [id])

  @@unique([userId, voucherId])
}

model Promotion {
  id          String   @id @default(cuid())
  title       String
  description String?
  type        VoucherType
  value       Float
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(true)
  image       String?

  users UserPromotion[]
}

model UserPromotion {
  id           String    @id @default(cuid())
  userId       String
  promotionId  String
  assignedAt   DateTime  @default(now())
  usedAt       DateTime?

  user       User       @relation(fields: [userId], references: [id])
  promotion  Promotion  @relation(fields: [promotionId], references: [id])

  @@unique([userId, promotionId])
}
```

### API Endpoints

#### Auth Controller
```
POST   /auth/register         - Register new user
POST   /auth/login            - Login user
POST   /auth/logout           - Logout user
POST   /auth/forgot-password  - Send reset email
POST   /auth/reset-password   - Reset password with token
POST   /auth/verify-email     - Verify email token
GET    /auth/me               - Get current user
```

#### Appointments Controller
```
GET    /appointments                    - List appointments (filtered)
POST   /appointments                    - Create appointment
GET    /appointments/:id                - Get appointment details
PATCH  /appointments/:id                - Update appointment (status)
DELETE /appointments/:id                - Cancel appointment
GET    /appointments/availability       - Get available slots
GET    /appointments/my                 - Get current user's appointments
```

#### Services Controller
```
GET    /services                        - List all active services
GET    /services/:id                     - Get service details
POST   /services                        - Create service (admin)
PATCH  /services/:id                    - Update service (admin)
DELETE /services/:id                    - Delete service (admin)
```

#### Reviews Controller
```
GET    /reviews                         - List reviews (public, paginated)
POST   /reviews                         - Create review (after appointment)
GET    /reviews/stats                   - Get review statistics
PATCH  /reviews/:id                     - Update review
DELETE /reviews/:id                     - Delete review (admin)
```

#### Vouchers Controller
```
POST   /vouchers/validate               - Validate voucher code
POST   /vouchers/redeem                 - Redeem voucher for user
GET    /vouchers                        - List vouchers (admin)
POST   /vouchers                        - Create voucher (admin)
```

#### Admin Controller
```
GET    /admin/metrics                   - Get dashboard metrics (mock data)
GET    /admin/barbers                    - List barbers
GET    /admin/users                     - List users (paginated)
GET    /admin/appointments             - List all appointments
PATCH  /admin/appointments/:id          - Admin update appointment
```

### Error Handling
```typescript
// Standard error response
{
  statusCode: number,
  message: string | string[],
  error: string
}

// Custom exceptions
- NotFoundException
- BadRequestException
- UnauthorizedException
- ForbiddenException
- ConflictException
```

---

## 5. Testing Strategy

### Vitest + Supertest Setup

**Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

### Test Structure
```
src/
├── appointments/
│   ├── appointments.controller.spec.ts
│   └── appointments.service.spec.ts
├── auth/
│   └── auth.service.spec.ts
└── ...
```

### Example Test
```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { INestApplication } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { AppModule } from '../app.module'
import * as request from 'supertest'

describe('AuthController', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('/auth/register (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      })
      .expect(201)
  })
})
```

---

## 6. Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: seven7barber
      POSTGRES_PASSWORD: seven7barber_dev
      POSTGRES_DB: seven7barber
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://seven7barber:seven7barber_dev@postgres:5432/seven7barber
      JWT_SECRET: dev_secret_change_in_production
      FRONTEND_URL: http://localhost:5173
    depends_on:
      - postgres

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - api

volumes:
  postgres_data:
```

### Dockerfiles

**apps/api/Dockerfile:**
```dockerfile
FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=install /app/node_modules node_modules
COPY . .
RUN bun run build

FROM base AS runtime
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules
EXPOSE 3001
CMD ["bun", "run", "start"]
```

---

## 7. External Services Configuration

### Supabase
```env
DATABASE_URL=postgresql://user:password@host:5432/db
DIRECT_URL=postgresql://user:password@host:5432/db
```

### Cloudinary
```env
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Abacate Pay (Mock)
```env
ABACATE_PAY_API_KEY=test_key
ABACATE_PAY_MERCHANT_ID=test_merchant
ABACATE_PAY_SANDBOX=true
```

### Email (SMTP)
```env
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=hello@yourdomain.com
SMTP_PASS=your_password
EMAIL_FROM=hello@yourdomain.com
```

---

## 8. Security Considerations

- JWT tokens with short expiration (15min) + refresh tokens
- Password hashing with bcrypt (12 rounds)
- Rate limiting on auth endpoints
- Input validation with Zod on all endpoints
- CORS configured for frontend origin only
- SQL injection prevention via Prisma
- XSS prevention via React default escaping

---

## 9. Environment Variables

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD=your_cloud
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_CLOUD_NAME=...
ABACATE_PAY_API_KEY=...
ABACATE_PAY_SANDBOX=true
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
FRONTEND_URL=http://localhost:5173
```

---

## 10. Deployment

### Cloudflare Pages (Frontend)
1. Connect repo to Cloudflare Pages
2. Build command: `bun install && bun run build`
3. Environment variables in Cloudflare dashboard
4. Deploy on push to main

### Render (Backend)
1. Connect repo to Render
2. Create Web Service
3. Build command: `bun install && bun run build`
4. Start command: `bun run start`
5. Environment variables in Render dashboard
6. Auto-deploy from main branch

---

## 11. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run type-check
      - run: bun run lint
      - run: bun test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install && bun run build
```