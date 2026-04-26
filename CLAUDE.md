# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tempest Seven7Barber** is a barbershop appointment booking platform with two separate repositories:

- `seven7barber-web/` — Vinext (Next.js 15, React 19) frontend
- `seven7barber-api/` — NestJS backend

Currently both directories are empty placeholders; implementation begins from scratch.

**Tech Stack:** Bun (package manager), PostgreSQL (Supabase), Prisma ORM, Tailwind + shadcn/ui, Vitest

## Common Commands

```bash
# Install dependencies (from root or each subdirectory)
bun install

# Development
bun run dev              # Start dev server (watch mode in api, Vite in web)

# Build & Production
bun run build            # Production build
bun run start            # Run production server (api only)

# Quality
bun run lint             # Lint code
bun run type-check       # TypeScript check

# Testing (api only, currently)
bun test                # Run all tests
bun test src/auth/      # Run tests for specific module
bun run test:watch      # Watch mode
bun run test:coverage   # Coverage report

# Database (api only)
bun run prisma migrate   # Run migrations
bun run prisma studio   # Open Prisma Studio
```

## Architecture

### Frontend (seven7barber-web)
- **Entry:** `src/app/` — Next.js App Router pages
- **Components:** `src/components/` (ui/, booking/, home/, dashboard/)
- **Server Actions:** `src/server/` — Server-side mutations
- **Styling:** Tailwind CSS + shadcn/ui components
- **Forms:** React Hook Form + Zod validation

### Backend (seven7barber-api)
- **Entry:** `src/main.ts`
- **Modules:** `src/auth/`, `src/users/`, `src/appointments/`, `src/services/`, `src/reviews/`, `src/vouchers/`, `src/admin/`
- **Testing:** Supertest for integration tests

### Data Flow
Client (web) → REST API (api) → Prisma → PostgreSQL

## Design System (Razorcuts)

| Token | Value |
|-------|-------|
| Primary | #732F3B (wine/rose) |
| Primary Dark | #401021 |
| Neutrals | #111111, #272727, #bababa, #ffffff |
| Heading Font | Oswald |
| Body Font | Poppins |

## Environment Variables

**Frontend:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD`

**Backend:** `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN`, `CLOUDINARY_*`, `ABACATE_PAY_*`, `SMTP_*`, `FRONTEND_URL`

## Key Docs

- Full specs: `docs/specs/SPEC.md`
- Product requirements: `docs/prd/PRD.md`
- Database schema: Prisma schema in `seven7barber-api/prisma/schema.prisma`
