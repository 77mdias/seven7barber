---
last-updated: 2026-04-26
agent-version: 1.1
---

# Better-Auth Migration Context

## Status: ✅ WEB FIXED - READY TO TEST

## ✅ 已完成
1. ✅ better-auth.ts - createBetterAuth factory with prismaAdapter
2. ✅ auth-better.controller.ts - generic handler with toNodeHandler (Express)
3. ✅ auth.module.ts - registered BetterAuthController
4. ✅ Build succeeds - API compiles
5. ✅ seven7barber-web/src/server/auth.ts - server actions (API caller only, no better-auth imports)
6. ✅ Prisma schema updated with User, Session, Account, Verification models
7. ✅ Migration applied successfully to local postgres
8. ✅ **FIXED** web error: renamed `lib/auth.ts` → `lib/auth.server.ts` to prevent Vite from bundling server-only code

## ⚠️ DATABASE CONFIG
- Using LOCAL Docker postgres (Supabase unreachable)
- DATABASE_URL=postgresql://seven7barber:password123@localhost:5432/seven7barber

## 📝 Key Fixes
- Import path: `better-auth/adapters/prisma` not `better-auth/dist/adapters/prisma-adapter`
- Handler: `toNodeHandler(auth)` takes 2 args, not 3
- TypeScript: Use `any` for Express Request/Response to avoid isolatedModules issues
- **WEB**: Use `.server.ts` suffix for files with server-only imports

## 🎯 下一步
1. Start API: `cd seven7barber-api && bun run start:dev`
2. Start Web: `cd seven7barber-web && bun run dev`
3. Test signup: `curl -X POST http://localhost:3000/auth/sign-up -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123","name":"Test"}'`

## 变更记录
- 2026-04-26: Created better-auth.ts factory
- 2026-04-26: Created auth-better.controller.ts com generic handler
- 2026-04-26: Updated auth.module.ts to include BetterAuthController
- 2026-04-26: Fixed adapter import path
- 2026-04-26: Build passing
- 2026-04-26: Added better-auth models to schema
- 2026-04-26: Migration applied to local postgres
- 2026-04-26: Fixed web 500 error - renamed lib/auth.ts → lib/auth.server.ts