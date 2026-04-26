<!-- refreshed: 2026-04-26 -->
# Architecture

**Analysis Date:** 2026-04-26

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    seven7barber-web                         │
│              (Next.js 16 / Vinext / React 19)               │
├──────────────────┬──────────────────┬───────────────────────┤
│   Pages (app/)   │  Components/     │   lib/                │
│  `src/app/`      │  `src/components/`│  `src/lib/`           │
└────────┬─────────┴──────────────────┴──────────┬────────────┘
         │                                        │
         │  HTTP REST                             │
         ▼                                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   seven7barber-api                          │
│                    (NestJS 11)                              │
├──────────────────┬──────────────────┬───────────────────────┤
│   Auth Module    │   User Module    │   Prisma Module       │
│  `src/auth/`     │  `src/user/`     │   `src/prisma/`       │
│  `src/email/`    │                  │                       │
└────────┬─────────┴──────────────────┴──────────┬────────────┘
         │                                        │
         ▼                                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL (Supabase)                    │
│                   `seven7barber-api/prisma/`                │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   packages/shared                           │
│              `packages/shared/src/`                         │
│              types/, constants/                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| seven7barber-web | UI layer, pages, components | `seven7barber-web/src/` |
| seven7barber-api | REST API, business logic | `seven7barber-api/src/` |
| AuthModule | JWT authentication, guards | `seven7barber-api/src/auth/` |
| UserModule | User CRUD operations | `seven7barber-api/src/user/` |
| PrismaModule | Database access layer | `seven7barber-api/src/prisma/` |
| packages/shared | Shared types, constants | `packages/shared/src/` |

## Pattern Overview

**Overall:** Layered Monorepo with Workspace Packages

**Key Characteristics:**
- Bun as package manager for all workspaces
- NestJS modular architecture for backend
- Next.js App Router for frontend (Vinext variant)
- Prisma ORM for database operations
- Shared types package for cross-package type safety

## Layers

**Frontend (seven7barber-web):**
- Purpose: User interface and client-side logic
- Location: `seven7barber-web/src/`
- Contains: Pages (`app/`), Components (`components/`), Utilities (`lib/`)
- Depends on: packages/shared, external APIs
- Used by: Browser clients

**Backend (seven7barber-api):**
- Purpose: REST API, business logic, authentication
- Location: `seven7barber-api/src/`
- Contains: NestJS modules (auth, user, prisma, email)
- Depends on: Prisma, PostgreSQL
- Used by: Frontend, mobile clients

**Shared (packages/shared):**
- Purpose: Cross-package type definitions and constants
- Location: `packages/shared/src/`
- Contains: `types/`, `constants/`, `index.ts`
- Depends on: None
- Used by: seven7barber-web, seven7barber-api

**Database:**
- Purpose: Persistent data storage
- Location: `seven7barber-api/prisma/schema.prisma`
- Contains: User, appointment, service, review, voucher models
- Provider: PostgreSQL (Supabase)

## Data Flow

### Primary Request Path (Authentication)

1. **Client Request** - Browser sends HTTP request to API
2. **NestJS Gate/Guard** - `jwt-auth.guard.ts` validates JWT token
3. **Controller** - `auth.controller.ts` handles route
4. **Service** - `auth.service.ts` processes business logic
5. **Prisma** - `prisma.service.ts` executes database operations
6. **PostgreSQL** - Returns data to Prisma
7. **Response** - Data flows back through layers to client

### Frontend Page Load

1. **Page Request** - `src/app/page.tsx` renders
2. **Components** - `HeaderAuth`, shadcn/ui components
3. **Auth Check** - Session/token verification
4. **API Calls** - Fetch data from seven7barber-api

**State Management:**
- React useState/useEffect for local state
- next-auth for session management (web)
- JWT tokens for API authentication

## Key Abstractions

**PrismaService:**
- Purpose: Database access singleton
- Examples: `seven7barber-api/src/prisma/prisma.service.ts`
- Pattern: NestJS Global module singleton

**AuthModule:**
- Purpose: JWT-based authentication
- Examples: `seven7barber-api/src/auth/`
- Pattern: Passport Strategy + NestJS Guards

**Shared Types:**
- Purpose: Type-safe contracts between packages
- Examples: `packages/shared/src/types/index.ts`
- Pattern: Barrel export re-export

## Entry Points

**Frontend:**
- Location: `seven7barber-web/src/app/`
- Triggers: Browser navigation to routes
- Responsibilities: Page rendering, component composition

**Backend:**
- Location: `seven7barber-api/src/main.ts`
- Triggers: `npm run start:dev` or `nest start`
- Responsibilities: NestJS application bootstrap

## Architectural Constraints

- **Threading:** Node.js event loop (single-threaded), NestJS handles concurrent requests
- **Global state:** PrismaService as singleton via `PrismaModule`
- **Circular imports:** None detected in current structure
- **Package manager:** Bun required for workspace resolution

## Anti-Patterns

### Placeholder Modules

**What happens:** Some modules are minimal stubs with no real implementation
**Why it's wrong:** Codebase is not functional end-to-end
**Do this instead:** Implement full feature modules when ready

### Empty Shared Types

**What happens:** `packages/shared/src/types/` is empty, `constants/` has no files
**Why it's wrong:** Shared types not yet utilized across packages
**Do this instead:** Add shared types as features are built

## Error Handling

**Strategy:** NestJS built-in exception handling with try-catch in services

**Patterns:**
- Service methods throw exceptions on failure
- Controllers rely on NestJS global exception filters
- Prisma errors caught and transformed

## Cross-Cutting Concerns

**Logging:** Console output (no structured logging configured)
**Validation:** Zod (planned for forms), class-validator (API)
**Authentication:** JWT with Passport strategy, `jwt-auth.guard.ts`

---

*Architecture analysis: 2026-04-26*
