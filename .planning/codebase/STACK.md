# Technology Stack

**Analysis Date:** 2026-04-26

## Languages

**Primary:**
- TypeScript 5.7.3 - Used across all packages (api, web, shared)

**Secondary:**
- None detected

## Runtime

**Environment:**
- Bun - Package manager and runtime for monorepo management
- Node.js - Runtime for NestJS API (via `nest start`)

**Package Manager:**
- Bun 1.x - Workspace-based monorepo
- Lockfile: `bun.lock` (present at root and individual packages)

## Frameworks

**Core:**
- **Backend:** NestJS 11.0.1 - API framework
- **Frontend:** Next.js 16.2.4 - React framework (with Vinext 0.0.44 experimental)
- **UI Components:** shadcn 4.5.0 - Component library
- **Form Handling:** React Hook Form (implied by shadcn patterns)
- **Validation:** Zod (implied by shadcn patterns)

**Styling:**
- Tailwind CSS 4 - Utility-first CSS
- tw-animate-css 1.4.0 - Animation utilities
- class-variance-authority 0.7.1 - Component variants
- clsx 3.5.1 - Conditional classes

**Testing:**
- Jest 30.0.0 - Test runner
- ts-jest 29.2.5 - TypeScript support for Jest
- Supertest 7.0.0 - HTTP assertions for integration tests

**Build/Dev:**
- Vite 8.0.10 - Build tool (used by Vinext)
- @vitejs/plugin-react 6.0.1 - React support
- @vitejs/plugin-rsc 0.5.24 - React Server Components support
- ts-node 10.9.2 - TypeScript execution
- ts-loader 9.5.2 - TypeScript loading for Webpack
- NestJS CLI 11.0.0 - NestJS scaffolding and build

**Database:**
- Prisma 7.8.0 - ORM
- PostgreSQL - Database (via Supabase or Docker)

## Key Dependencies

**Critical:**
- `prisma` 7.8.0 - Database schema management
- `@prisma/client` 7.8.0 - Database client
- `next` 16.2.4 - Frontend framework
- `@nestjs/core` 11.0.1 - NestJS core

**Authentication:**
- `@nestjs/jwt` 11.0.2 - JWT support
- `@nestjs/passport` 11.0.5 - Passport integration
- `passport-jwt` 4.0.1 - JWT strategy
- `bcrypt` 6.0.0 - Password hashing
- `next-auth` 4.24.14 - Frontend authentication

**UI/UX:**
- `lucide-react` 1.11.0 - Icons
- `@base-ui/react` 1.4.1 - Base UI components
- `tailwind-merge` 3.5.0 - Tailwind merge utility
- `react` 19.2.5 - UI library
- `react-dom` 19.2.5 - DOM renderer

## Configuration

**Environment:**
- Root: `docker-compose.yml` orchestrates all services
- API: `seven7barber-api/.env` - Environment configuration
- Web: `NEXT_PUBLIC_API_URL` - Client-side API URL

**Build:**
- Root: `package.json` (workspaces)
- API: `tsconfig.json`, `nest-cli.json`
- Web: `tsconfig.json`, `next.config.ts`, `vite.config.ts`, `postcss.config.mjs`, `components.json`

## Platform Requirements

**Development:**
- Bun runtime
- Docker & Docker Compose (for PostgreSQL)
- Node.js (for NestJS)

**Production:**
- Containerized via Docker (see `docker-compose.yml`)
- PostgreSQL 15 (via Docker volume or Supabase)

## Project Structure

```
seven7barber/                    # Root monorepo
├── packages/
│   └── shared/                  # Shared types/utilities
├── seven7barber-api/            # NestJS backend
│   ├── prisma/                  # Database schema
│   └── src/                     # API source
├── seven7barber-web/            # Next.js frontend
│   └── src/                     # Web source
├── docker-compose.yml           # Service orchestration
└── package.json                 # Workspace root
```

---

*Stack analysis: 2026-04-26*
