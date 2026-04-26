# SPEC: Migrate from NextAuth to Better-Auth

**Phase:** TASK-025
**Status:** IN PROGRESS
**Created:** 2026-04-26

## 1. Context

NextAuth v4 is incompatible with Vinext (SSR via Vite). The error `(0 , __vite_ssr_import_0__.default) is not a function` occurs because next-auth v4 uses CommonJS exports incompatible with Vite's ESM SSR.

Better-Auth is framework-agnostic, ESM-first, and works seamlessly with Vinext/Next.js.

## 2. Current State

### NextAuth Implementation
- `/seven7barber-web/src/lib/auth.ts` - Auth options with CredentialsProvider
- `/seven7barber-web/src/app/api/auth/[...nextauth]/route.ts` - NextAuth handler

### Problems
- CredentialsProvider is not a function in Vite SSR context
- next-auth v4 CJS exports incompatible with ESM bundlers
- No path to fix without major rework

## 3. Target State

### Better-Auth Implementation
```
src/lib/
├── auth.ts          # Server: better-auth instance
└── auth-client.ts  # Client: authClient for browser

src/app/api/auth/[...betterauth]/route.ts  # Better-Auth handler
```

## 4. Implementation

### 4.1 Install Dependencies

```bash
cd seven7barber-web
bun add better-auth
```

### 4.2 Server Setup (auth.ts)

```typescript
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
});
```

### 4.3 API Route Handler

```typescript
// src/app/api/auth/[...betterauth]/route.ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const handler = toNextJsHandler(auth);

export { handler as GET, handler as POST };
```

### 4.4 Client Setup (auth-client.ts)

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});
```

### 4.5 Helper Hooks

```typescript
// src/hooks/use-auth.ts
import { useAuth } from "better-auth/react";

export const useSession = () => useAuth();
```

## 5. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sign-up` | POST | Register new user |
| `/api/auth/sign-in` | POST | Login user |
| `/api/auth/sign-out` | POST | Logout user |
| `/api/auth/session` | GET | Get current session |

## 6. Migration Steps

- [x] 6.1 Install better-auth
- [x] 6.2 Create server auth instance
- [x] 6.3 Create API route handler
- [ ] 6.4 Create client auth helpers
- [ ] 6.5 Update login/signup components
- [ ] 6.6 Update protected routes
- [ ] 6.7 Remove next-auth
- [ ] 6.8 Test full auth flow

## 7. References

- [Better-Auth Docs](https://www.better-auth.com/)
- [Better-Auth GitHub](https://github.com/better-auth/better-auth)
