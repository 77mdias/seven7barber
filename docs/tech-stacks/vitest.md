# Tech Stack: Vitest Testing

## Overview
Next-generation testing framework powered by Vite, Jest-compatible.

## Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

## tsconfig.json (globals)
```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

## Basic Test Structure
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Calculator', () => {
  let calc: Calculator;
  
  beforeEach(() => {
    calc = new Calculator();
  });
  
  it('adds two numbers', () => {
    expect(calc.add(1, 2)).toBe(3);
  });
  
  it('handles zero', () => {
    expect(calc.add(0, 0)).toBe(0);
  });
  
  describe('with negative numbers', () => {
    it('subtracts correctly', () => {
      expect(calc.add(-1, -2)).toBe(-3);
    });
  });
});
```

## Assertions
```typescript
expect(value).toBe(3);              // === equality
expect(value).toEqual(obj);          // deep equality
expect(value).toBeTruthy();         // truthy check
expect(value).toBeFalsy();           // falsy check
expect(value).toBeNull();            // null check
expect(() => fn()).toThrow();        // exception
expect(arr).toContain(item);         // array contains
expect(str).toMatch(/regex/);       // regex match
expect(obj).toMatchSnapshot();       // snapshot
expect(mock).toHaveBeenCalled();     // mocks
```

## Mocks
```typescript
import { vi } from 'vitest';

const mockFn = vi.fn(() => 'mocked');
const spy = vi.spyOn(obj, 'method');

beforeEach(() => {
  vi.clearAllMocks();
});
```

## In-Source Testing
```typescript
export function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0);
}

// #region in-source test suites
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('add', () => {
    expect(add()).toBe(0);
    expect(add(1)).toBe(1);
  });
}
// #endregion
```

## Supertest (Integration)
```typescript
import { supertest } from '@supertest/supertest';

const response = await supertest(app.getHttpServer())
  .post('/api/resource')
  .send({ data: 'value' })
  .expect(201)
  .expect('Content-Type', /json/);
```

## Commands
```bash
bun test                  # Run all tests
bun test src/auth/       # Specific module
bun run test:watch       # Watch mode
bun run test:coverage    # Coverage report
```

## Tags
#tech-stack #testing #vitest
