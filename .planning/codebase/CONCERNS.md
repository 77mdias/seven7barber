# Codebase Concerns

**Analysis Date:** 2026-04-26

## Security Considerations

**Hardcoded JWT Secret:**
- Risk: JWT secret fallback is hardcoded in production code
- Files: `seven7barber-api/src/auth/jwt.strategy.ts:11`
- Current mitigation: Uses `process.env.JWT_SECRET` when available
- Recommendations: Fail fast if `JWT_SECRET` is not set; do not fall back to predictable values

**Environment File with Credentials:**
- Risk: Database connection string present in `.env` file
- Files: `seven7barber-api/.env`
- Current mitigation: `.env` is gitignored
- Recommendations: Never commit `.env`; use secrets management in production

**Missing Input Validation:**
- Risk: Auth endpoints accept `any` types without validation
- Files:
  - `seven7barber-api/src/auth/auth.controller.ts:10` - `login(@Body() req: any)`
  - `seven7barber-api/src/auth/auth.controller.ts:19` - `register(@Body() req: any)`
  - `seven7barber-api/src/auth/auth.service.ts:35` - `register(data: any)`
- Impact: No protection against malformed or malicious input
- Recommendations: Add DTOs with class-validator decorators

**Frontend API URL Hardcoded Fallback:**
- Risk: Frontend defaults to `localhost:3000` if env var is missing
- Files: `seven7barber-web/src/lib/auth.ts:16`
- Recommendations: Fail build if `NEXT_PUBLIC_API_URL` is not set in production

## Tech Debt

**Mock Email Service:**
- Issue: `EmailService` only logs to console, no actual email sending
- Files: `seven7barber-api/src/email/email.service.ts`
- Impact: Users cannot receive confirmation emails, password resets, etc.
- Fix approach: Implement actual email service using SMTP or a provider like Resend/SendGrid

**Empty User Controller:**
- Issue: `UserController` has no route handlers
- Files: `seven7barber-api/src/user/user.controller.ts:3-4`
- Impact: No API endpoints for user management (profile, update, delete)
- Fix approach: Add REST endpoints for user CRUD operations

**Missing Modules from Schema:**
- Issue: Database schema defines models with no corresponding service/controller
- Missing implementations:
  - `Appointment` model - no `appointments/` module
  - `Service` model - no `services/` module
  - `ServiceHistory`/`Review` - no `reviews/` module
  - `Voucher` - no `vouchers/` module
  - `Promotion` - no `promotions/` module
  - `Admin` functionality - no `admin/` module
- Files: `seven7barber-api/prisma/schema.prisma`

**Hardcoded Service Data:**
- Issue: Services array is hardcoded in frontend component
- Files: `seven7barber-web/src/app/page.tsx:159-163`
- Impact: Price/service changes require code deployments
- Fix approach: Fetch services from API endpoint

## Known Bugs

**Auth Silent Failure:**
- Symptom: `validateUser` returns `null` silently on auth failure
- Files: `seven7barber-api/src/auth/auth.service.ts:13-19`
- Trigger: Invalid credentials produce no error response distinction
- Workaround: Check `res.ok` on frontend before parsing JSON

## Test Coverage Gaps

**No Business Logic Tests:**
- What's not tested: AuthService, UserService, EmailService have no unit tests
- Files: All `src/` files lack `*.spec.ts` tests except `app.controller.spec.ts`
- Risk: Auth and user management logic can break undetected

**No Integration Tests:**
- What's not tested: API endpoints have no e2e test coverage
- Files: `seven7barber-api/test/app.e2e-spec.ts` exists but appears unused
- Risk: Endpoint changes can break client integrations

**Frontend Not Tested:**
- What's not tested: No frontend test setup detected (Vitest not configured)
- Risk: UI changes can break user flows

## Performance Considerations

**Prisma Client Not Disconnected Gracefully:**
- Problem: No `onModuleDestroy` hook to disconnect Prisma on shutdown
- Files: `seven7barber-api/src/prisma/prisma.service.ts`
- Impact: Possible connection leaks during restarts

**No Database Query Optimization:**
- Problem: No pagination on user lookups
- Files: `seven7barber-api/src/user/user.service.ts`
- Impact: Could cause memory issues with large datasets

## Architectural Issues

**NextAuth Credential Provider Calls Backend Directly:**
- Problem: Frontend fetches `/auth/login` directly instead of using server action
- Files: `seven7barber-web/src/lib/auth.ts:16`
- Impact: CORS issues possible, credentials exposed to client
- Recommendations: Use server-side API calls with HttpOnly cookies

**No API Validation Layer:**
- Problem: No global validation pipe configured
- Files: `seven7barber-api/src/main.ts`
- Impact: Invalid data reaches services
- Fix approach: Add `ValidationPipe` to NestJS app

## Dependencies at Risk

**Very Recent NestJS Version:**
- Risk: `@nestjs/common@^11.0.1` is brand new (Dec 2024)
- Impact: Limited community knowledge, potential undiscovered bugs
- Migration plan: Monitor for updates; consider ^10.x for stability

**Prisma 7.x:**
- Risk: Latest Prisma version with potential edge cases
- Impact: Schema migrations may have unexpected behavior
- Recommendation: Ensure good test coverage for database operations

---

*Concerns audit: 2026-04-26*
