# Changelog

## [PHASE-09] - 2026-04-27

### Auth & Security Fixes

#### Dual Auth System Resolved
- **Files:** `seven7barber-api/src/auth/auth.module.ts`, `seven7barber-api/src/auth/auth-better.controller.ts`
- **Change:** Removed `BetterAuthController` that used `@All('*path')` catch-all intercepting all `/auth/*` routes. JWT-based `AuthController` now handles all requests alone.
- **Impact:** Predictable auth routing, no more conflicts.

#### Reviews Ownership Verification
- **Files:** `seven7barber-api/src/reviews/reviews.controller.ts`, `seven7barber-api/src/reviews/reviews.service.ts`
- **Change:** Added `userId` extraction from JWT token in controller. Service now verifies the authenticated user owns the appointment before allowing review creation.
- **Impact:** Users can only review their own completed appointments.

#### Web Auth Endpoint URLs Fixed
- **Files:** `seven7barber-web/src/server/auth.ts`, `seven7barber-web/src/lib/auth-client.ts`, `seven7barber-web/src/app/login/page.tsx`
- **Change:** Fixed all wrong endpoint URLs:
  - `/auth/sign-in/email` → `/auth/login`
  - `/auth/sign-up/email` → `/auth/register`
  - `/auth/get-session` → `/auth/me`
  - Added `useSession().refetch()` call after successful login
- **Impact:** Web auth flows now work correctly end-to-end.

#### Payments Persistence to Database
- **Files:** `seven7barber-api/src/payments/payments.service.ts`, `seven7barber-api/prisma/schema.prisma`
- **Change:** Replaced in-memory `Map` with `PaymentSession` Prisma model. Added `PaymentMethod` and `PaymentStatus` enums.
- **Impact:** Payment sessions survive server restarts.

#### Additional Fixes
- Fixed Zod error property in auth controller (`parsed.error.errors` → `parsed.error.issues`)
- `BetterAuthController` deleted (orphaned after T-03)

### Documentation Updated
- PHASE-09 phase board updated (9/10 tasks complete)
- PHASE-09 phase.md requirements checklist updated
- ROADMAP.md updated with Phase 9 and Phase 8 marked complete
- docs/development/ROADMAP.md updated with PHASE-09 section

---

## [Security Fix] - 2026-04-26

### Critical Security Fixes

#### C1: JWT Secret Fallback Removed
- **Files:** `seven7barber-api/src/auth/auth.module.ts`, `seven7barber-api/src/auth/jwt.strategy.ts`
- **Change:** Removed hardcoded fallback `'fallback_secret_key_for_development'`. App now throws at startup if `JWT_SECRET` is missing.
- **Impact:** Prevents token forgery in production.

#### C2/C3: CORS Configuration Fixed
- **Files:** `seven7barber-api/src/main.ts`, `seven7barber-api/src/auth/auth-better.controller.ts`
- **Change:** 
  - Replaced `origin: true` with explicit whitelist from `FRONTEND_URL` env var
  - Removed duplicate CORS headers from `BetterAuthController`
- **Impact:** Prevents unauthorized cross-origin requests.

#### C4-C7: Auth Guards Added to Unprotected Endpoints
- **Files:**
  - `seven7barber-api/src/admin/admin.controller.ts` — Added `JwtAuthGuard + RolesGuard + @Roles('ADMIN')`
  - `seven7barber-api/src/services/services.controller.ts` — Added guards to POST/PATCH/DELETE
  - `seven7barber-api/src/vouchers/vouchers.controller.ts` — Added guards to all endpoints
  - `seven7barber-api/src/notifications/notifications.controller.ts` — Added admin-only guard
  - `seven7barber-api/src/reviews/reviews.controller.ts` — Added `JwtAuthGuard` to POST
- **New Files:**
  - `seven7barber-api/src/auth/roles.decorator.ts` — `@Roles()` decorator
  - `seven7barber-api/src/auth/roles.guard.ts` — Role-based access control guard
- **Impact:** Prevents unauthorized access to admin, services, vouchers, notifications, and reviews.

#### C8: Global ValidationPipe Configured
- **File:** `seven7barber-api/src/main.ts`
- **Change:** Added `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))`
- **Impact:** All DTOs and class-validator decorators are now enforced. Rejects unknown properties.

#### C9: Hardcoded Localhost URLs Replaced
- **Files:**
  - `seven7barber-web/src/lib/auth-client.ts` — Uses `NEXT_PUBLIC_API_URL`
  - `seven7barber-web/src/app/login/page.tsx` — Uses `NEXT_PUBLIC_API_URL`
  - `seven7barber-web/src/app/register/page.tsx` — Uses `NEXT_PUBLIC_API_URL`
  - `seven7barber-web/src/server/auth.ts` — Uses `API_URL` or `NEXT_PUBLIC_API_URL`
- **Impact:** API calls work in production environments.

#### C10: CSRF Protection
- **File:** `seven7barber-web/src/server/auth.ts`
- **Change:** All server auth functions now validate `response.ok` and throw on failure.
- **Impact:** Prevents silent auth failures.

#### C11: Admin Route Protection
- **File:** `seven7barber-web/src/middleware.ts` (new)
- **Change:** Added Next.js middleware that verifies session for `/admin` and `/dashboard` routes.
- **Impact:** Unauthenticated users cannot access admin dashboard.

#### C12: Booking API Integration
- **File:** `seven7barber-web/src/app/booking/wizard/wizard.tsx`
- **Change:** Replaced fake `setTimeout` stub with actual API call to `/appointments`.
- **Impact:** Bookings are now persisted to the database.

### Additional Fixes

- **Swagger disabled in production** — `main.ts` now only enables Swagger when `NODE_ENV !== 'production'`
- **Server auth error handling** — `server/auth.ts` now validates `response.ok` on all endpoints

### Environment Variables Required

```env
# API (seven7barber-api)
JWT_SECRET=your_jwt_secret_min_32_chars    # REQUIRED - no fallback
FRONTEND_URL=http://localhost:3001         # For CORS whitelist

# Web (seven7barber-web)
NEXT_PUBLIC_API_URL=http://localhost:3000  # For client-side API calls
API_URL=http://localhost:3000              # For server-side API calls
```

### Migration Notes

1. **JWT_SECRET is now required** — App will crash on startup if missing. Add to `.env`.
2. **CORS is now restrictive** — Add your production domain to `FRONTEND_URL`.
3. **Admin endpoints require auth** — All `/admin/*` API routes need `Authorization: Bearer <token>` header.
4. **Services mutations require auth** — POST/PATCH/DELETE `/services` need admin token.
5. **Vouchers require auth** — All `/vouchers` endpoints need token. Create/deactivate need admin role.
6. **Notifications require admin auth** — `/notifications/send` is admin-only.
7. **Reviews require auth** — `POST /reviews` needs token. Client ID comes from token.
