# Testing Patterns

**Analysis Date:** 2026-04-26

## Test Framework

**API - Jest:**
- Runner: Jest `^30.0.0`
- Config in `seven7barber-api/package.json` (jest section)
- Test environment: `node`
- Transform: `ts-jest` for TypeScript files

**Web - Vitest (not yet configured):**
- Per CLAUDE.md, Vitest is planned but no Vitest config found
- Vite config (`seven7barber-web/vite.config.ts`) only has Vinext plugin, no test setup

## Run Commands

**API:**
```bash
bun test                    # Run all tests
bun test src/auth/          # Run tests for specific module
bun run test:watch          # Watch mode
bun run test:cov            # Coverage report
bun test:e2e                # E2E tests (separate config)
```

**Web:**
- No test commands configured yet

## Test File Organization

**Location - API:**
- Unit tests: Co-located with source files (`src/**/*.spec.ts`)
- E2E tests: `test/` directory at project root

**Naming:**
- Unit tests: `*.spec.ts` (e.g., `app.controller.spec.ts`)
- E2E tests: `*.e2e-spec.ts` (e.g., `app.e2e-spec.ts`)

## Test Structure

**Unit Test Pattern (API):**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
```

**E2E Test Pattern (API):**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
```

## Mocking

**Framework:** NestJS Testing module (`@nestjs/testing`)

**Pattern:** Use `Test.createTestingModule()` to inject mock providers

**Existing mock files:** None found yet

## Test Configuration

**Jest Config (API - from package.json):**
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
```

**E2E Config (`seven7barber-api/test/jest-e2e.json`):**
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

## Coverage

**API:**
- Coverage output directory: `../coverage` (project root)
- Coverage collection: All `.ts` and `.js` files

## Test Dependencies

**API:**
- `@nestjs/testing` - Testing utilities
- `supertest` - HTTP assertions
- `ts-jest` - TypeScript transformer
- `@types/supertest` - TypeScript types

## Test Types

**Unit Tests:**
- Co-located with source files in `src/`
- Single module/component testing
- Uses NestJS `TestingModule`

**Integration/E2E Tests:**
- Located in `test/` directory
- Full application context with `AppModule`
- Uses Supertest for HTTP assertions

---

*Testing analysis: 2026-04-26*
