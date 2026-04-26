# Codebase Structure

**Analysis Date:** 2026-04-26

## Directory Layout

```
seven7barber/                    # Root (monorepo workspace)
├── package.json                 # Workspace root config (Bun)
├── docker-compose.yml           # Docker orchestration
├── CLAUDE.md                    # Project instructions
├── seven7barber-api/            # NestJS backend
│   ├── src/
│   │   ├── main.ts              # Entry point
│   │   ├── app.module.ts        # Root module
│   │   ├── app.controller.ts    # Root controller
│   │   ├── app.service.ts       # Root service
│   │   ├── auth/                # Authentication module
│   │   ├── user/                # User module
│   │   ├── prisma/              # Prisma service module
│   │   └── email/               # Email module
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── test/                    # E2E tests
│   └── package.json             # NestJS dependencies
├── seven7barber-web/            # Next.js frontend
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── globals.css      # Global styles
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Register page
│   │   │   └── api/             # API route handlers
│   │   ├── components/          # React components
│   │   │   ├── header-auth.tsx  # Auth header
│   │   │   ├── providers.tsx    # Context providers
│   │   │   └── ui/              # shadcn/ui components
│   │   └── lib/                 # Utilities
│   └── package.json             # Next.js dependencies
├── packages/                    # Shared packages
│   └── shared/
│       ├── src/
│       │   ├── index.ts         # Barrel export
│       │   ├── types/           # Shared types (empty)
│       │   └── constants/       # Shared constants (empty)
│       └── package.json
└── docs/                       # Project documentation
```

## Directory Purposes

**Root:**
- Purpose: Monorepo workspace root
- Contains: Root package.json, docker-compose.yml, CLAUDE.md
- Key files: `package.json` (workspace config)

**seven7barber-api/src/:**
- Purpose: NestJS backend source code
- Contains: Modules (auth, user, prisma, email), controllers, services
- Key files: `main.ts`, `app.module.ts`

**seven7barber-web/src/app/:**
- Purpose: Next.js App Router pages and layouts
- Contains: `page.tsx` (home), `layout.tsx`, `login/`, `register/`, `api/`
- Key files: `page.tsx`, `layout.tsx`, `globals.css`

**seven7barber-web/src/components/:**
- Purpose: React UI components
- Contains: `header-auth.tsx`, `providers.tsx`, `ui/` (shadcn)
- Key files: `header-auth.tsx`

**packages/shared/src/:**
- Purpose: Cross-package shared code
- Contains: `index.ts` (exports), `types/`, `constants/`
- Note: Currently minimal - `types/` and `constants/` are empty

**seven7barber-api/prisma/:**
- Purpose: Database schema and migrations
- Contains: `schema.prisma` with all data models
- Key files: `schema.prisma`

## Key File Locations

**Entry Points:**
- `seven7barber-api/src/main.ts`: NestJS bootstrap
- `seven7barber-web/src/app/page.tsx`: Home page (root route)

**Configuration:**
- `seven7barber-api/package.json`: NestJS, Prisma, JWT deps
- `seven7barber-web/package.json`: Next.js, React, Tailwind deps
- Root `package.json`: Bun workspaces config

**Core Logic:**
- `seven7barber-api/src/auth/`: JWT authentication
- `seven7barber-api/src/user/`: User CRUD
- `seven7barber-api/src/prisma/`: Database service

**Testing:**
- `seven7barber-api/src/app.controller.spec.ts`: Controller test
- `seven7barber-api/test/`: E2E test config

## Naming Conventions

**Files:**
- PascalCase for components, controllers, services: `AuthController.ts`
- kebab-case for directories: `seven7barber-api/`, `src/components/`

**Directories:**
- Lowercase singular for module directories: `src/auth/`, `src/user/`
- kebab-case for package names: `seven7barber-api/`

## Where to Add New Code

**New NestJS Module:**
- Create directory: `seven7barber-api/src/{module-name}/`
- Files: `{module-name}.module.ts`, `{module-name}.controller.ts`, `{module-name}.service.ts`
- Register in: `seven7barber-api/src/app.module.ts`

**New Frontend Page:**
- Create directory: `seven7barber-web/src/app/{route}/`
- Files: `page.tsx`, optional `loading.tsx`, `error.tsx`
- Register route via file-system routing

**New Component:**
- Location: `seven7barber-web/src/components/{category}/`
- Pattern: PascalCase filename, export function component

**Shared Types:**
- Location: `packages/shared/src/types/`
- Export via: `packages/shared/src/index.ts`

**New Prisma Model:**
- Edit: `seven7barber-api/prisma/schema.prisma`
- Then run: `bun run prisma migrate`

## Special Directories

**seven7barber-api/prisma/:**
- Purpose: Database schema definition
- Generated: No (committed to repo)
- Committed: Yes

**seven7barber-web/src/components/ui/:**
- Purpose: shadcn/ui component library
- Generated: Yes (via shadcn CLI)
- Committed: Yes (source components, not npm package)

**seven7barber-web/dist/:**
- Purpose: Compiled output
- Generated: Yes (build artifact)
- Committed: No (.gitignore)

**seven7barber-web/.next/:**
- Purpose: Next.js build cache
- Generated: Yes (dev/build artifact)
- Committed: No (.gitignore)

**seven7barber-web/.vinext/:**
- Purpose: Vinext (Next.js variant) cache/fonts
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-04-26*
