# AGENTS.md — Seven7Barber Development Guide

## Monorepo Structure

This is a **Bun workspace monorepo** with two apps:
- `seven7barber-web/` — Next.js 16 frontend (React 19, shadcn/ui, Tailwind v4)
- `seven7barber-api/` — NestJS 11 backend (Prisma ORM, PostgreSQL, Jest)
- `packages/` — Shared packages

---

## Build & Run Commands

### Root (Docker orchestration)
```bash
bun install                  # Install all deps (from root)
bun run dev                  # docker compose up (full stack)
bun run api:dev              # API dev server only (watch mode)
bun run web:dev              # Web dev server only
```

### API (seven7barber-api/)
```bash
bun run build                # nest build
bun run start:dev            # nest start --watch
bun run start:prod           # node dist/main
bun run lint                 # eslint "{src,apps,libs,test}/**/*.ts" --fix
bun run format               # prettier --write "src/**/*.ts" "test/**/*.ts"
bun run test                 # jest (all unit tests)
bun run test:watch           # jest --watch
bun run test:cov             # jest --coverage
bun run test:e2e             # jest --config ./test/jest-e2e.json
```

**Run a single test file:**
```bash
bunx jest src/services/services.service.spec.ts
bunx jest --testPathPattern="booking.service.spec"
```

### Web (seven7barber-web/)
```bash
bun run dev                  # next dev
bun run build                # next build
bun run lint                 # eslint
bun run dev:vinext           # vinext dev --port 3001
```

### Database (Prisma)
```bash
bunx prisma migrate dev      # Create/apply migrations
bunx prisma generate         # Regenerate client
bunx prisma studio           # Visual DB browser
bunx prisma db push          # Push schema without migration
```

---

## Code Style Guidelines

### Formatting (Prettier)
- **Single quotes** everywhere (`'string'`, not `"string"`)
- **Trailing commas** in all multi-line constructs (all)
- Semicolons required
- End of line: auto

### API (NestJS / TypeScript)
- Strict TS: `strictNullChecks`, `noImplicitAny`, `strictBindCallApply` enabled
- Use **NestJS decorators**: `@Injectable()`, `@Controller()`, `@Module()`, `@UseGuards()`
- **No `@typescript-eslint/no-explicit-any`** — disabled; `any` allowed but prefer proper types
- **`no-floating-promises`**: warn level — always `await` or `.catch()` promises
- **Module pattern**: each feature is `src/<feature>/` with `.module.ts`, `.service.ts`, `.controller.ts`, `.spec.ts`
- **Validation**: use Zod for runtime validation (available in deps)
- **Auth**: JWT via `@nestjs/jwt` + `passport-jwt`; guards in `src/auth/`
- **ORM**: Prisma — schema at `prisma/schema.prisma`; inject `PrismaService` via `PrismaModule`
- **Error handling**: throw NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`, `ConflictException`, `UnauthorizedException`)
- **Imports**: use relative paths within modules; NestJS packages via `@nestjs/*`

### Web (Next.js / React)
- **Next.js 16 App Router** — pages in `src/app/**/page.tsx`
- **Path alias**: `@/*` maps to `./src/*`
- **Components**: `src/components/` with `ui/` for shadcn primitives, feature folders for domain components
- **Styling**: Tailwind CSS v4 utility classes; use `cn()` helper from `@/lib/utils` (clsx + tailwind-merge)
- **UI library**: shadcn/ui (v4) built on `@base-ui/react` + `class-variance-authority`
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for filenames

### Testing Conventions
- **API unit tests**: `*.spec.ts` files co-located with source; use **Jest** with `jest.fn()` mocks
- **Test naming**: `C<id> | <phase> | <description>` (e.g., `C1 | RED | findAll_returns_only_active_services`)
- **Test pattern**: Arrange → Act → Assert with comments
- **Prisma mocking**: create `createMockPrisma()` factory with `jest.fn()` for each model method
- **E2E tests**: `test/jest-e2e.json` config, files in `test/` directory
- **Web tests**: Vitest with `@testing-library/react`; spec files at `*.spec.ts` / `*.spec.tsx`

### File & Folder Naming
- **API**: camelCase files (`auth.service.ts`, `jwt-auth.guard.ts`); feature modules in `src/<feature>/`
- **Web**: kebab-case files (`header-auth.tsx`, `service-card.tsx`); `page.tsx` for routes
- **Prisma models**: PascalCase (`User`, `Appointment`, `TimeSlot`)

### Design System (UI Tokens)
| Token | Value |
|-------|-------|
| Primary | `#732F3B` (wine/rose) |
| Primary Dark | `#401021` |
| Neutrals | `#111`, `#272727`, `#bababa`, `#fff` |
| Heading font | Oswald (`font-heading`) |
| Body font | Poppins (`font-sans`) |

### Environment Variables
- **Web**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD`
- **API**: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLOUDINARY_*`, `ABACATE_PAY_*`, `SMTP_*`, `FRONTEND_URL`

### Important Notes
- Package manager is **Bun** — do NOT use npm or yarn
- Prisma schema source of truth: `seven7barber-api/prisma/schema.prisma`
- When writing Next.js code, check `node_modules/next/dist/docs/` for API changes — this is Next.js 16 with breaking changes from training data
- shadcn components use `@base-ui/react` primitives (NOT Radix) — check existing `src/components/ui/` before adding new components
