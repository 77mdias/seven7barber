# Coding Conventions

**Analysis Date:** 2026-04-26

## Naming Patterns

**Files:**
- TypeScript source: `kebab-case.ts` (e.g., `app.controller.ts`)
- React components: `PascalCase.tsx` (e.g., `page.tsx`, `layout.tsx`)
- Config files: `kebab-case.config.mjs`

**Functions and Variables:**
- camelCase for functions and variables (e.g., `getHello()`, `appService`)
- PascalCase for classes, components, and types (e.g., `AppController`, `AppService`)

**TypeScript Types:**
- PascalCase for interfaces and types (e.g., `AppProps`)

## Code Style

**Formatting:**
- Prettier is used for code formatting
- API Prettier config (`seven7barber-api/.prettierrc`):
  ```json
  {
    "singleQuote": true,
    "trailingComma": "all"
  }
  ```
- End of line: `auto` (platform-specific)

**Linting - API (`seven7barber-api/eslint.config.mjs`):**
- Uses `typescript-eslint` with recommended rules
- `eslint-plugin-prettier` for Prettier integration
- Key rules:
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-floating-promises`: warn
  - `@typescript-eslint/no-unsafe-argument`: warn
  - `prettier/prettier`: error with auto end-of-line

**Linting - Web (`seven7barber-web/eslint.config.mjs`):**
- Uses `eslint-config-next/core-web-vitals`
- Uses `eslint-config-next/typescript`
- Default Next.js TypeScript rules

**TypeScript Config - API (`seven7barber-api/tsconfig.json`):**
- `experimentalDecorators`: true (for NestJS decorators)
- `emitDecoratorMetadata`: true
- `strictNullChecks`: true
- `noImplicitAny`: true

**TypeScript Config - Web (`seven7barber-web/tsconfig.json`):**
- Path alias: `@/*` maps to `./src/*`
- `jsx`: react-jsx
- `moduleResolution`: bundler

## Import Organization

**API imports:**
1. External packages (e.g., `@nestjs/common`)
2. Internal modules (e.g., `./app.service`)
3. Relative imports (e.g., `../src/app.module`)

**Web imports:**
- Path aliases: `@/components`, `@/lib`, `@/ui` for local imports
- External packages first, then local aliases

## Component Structure

**NestJS (API):**
```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

**Next.js (Web):**
- Uses Next.js App Router
- Server components by default
- Client components marked with `'use client'`
- shadcn/ui components in `@/components/ui`
- Tailwind CSS 4 for styling

**Styling - Web:**
- Tailwind CSS 4 with `@tailwindcss/postcss`
- shadcn/ui components with `base-nova` style
- CSS variables for theming in `src/app/globals.css`
- Icon library: `lucide-react`

## Module Design

**API (NestJS):**
- Feature-based module structure
- Controllers handle HTTP
- Services handle business logic
- Decorators for routing (`@Controller`, `@Get`, `@Post`, etc.)

**Web:**
- App Router with route groups in `src/app/`
- Server Actions in `src/server/` (per CLAUDE.md)
- React Hook Form + Zod for forms

## Error Handling

**API:**
- Uses NestJS exception layer
- Throws standard HTTP exceptions via `@nestjs/common`

**Web:**
- React error boundaries (implied by Next.js defaults)

---

*Convention analysis: 2026-04-26*
