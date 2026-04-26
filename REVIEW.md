---
phase: full-codebase
depth: deep
date: 2026-04-26
agent: gsd-code-reviewer
files-reviewed: 88 production files
---

# Code Review — Full Codebase

## Executive Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 12 | BLOCK |
| HIGH | 18 | Must fix before deploy |
| MEDIUM | 18 | Should fix |
| LOW | 10 | Nice to fix |

**Verdict: BLOCK** — 12 critical issues must be resolved before any deployment.

---

## CRITICAL Findings

### C1 | Hardcoded JWT Fallback Secret
**Files:** `seven7barber-api/src/auth/auth.module.ts:15`, `seven7barber-api/src/auth/jwt.strategy.ts:11`

Both files use `process.env.JWT_SECRET || 'fallback_secret_key_for_development'`. If `JWT_SECRET` is unset, any attacker can forge valid JWT tokens.

**Fix:** Fail fast at startup if `JWT_SECRET` is missing.

```ts
secret: (() => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  return process.env.JWT_SECRET;
})(),
```

---

### C2 | CORS Allows All Origins with Credentials
**File:** `seven7barber-api/src/main.ts:13-16`

`origin: true` reflects any request's `Origin` header back as `Access-Control-Allow-Origin` with `credentials: true`. Any malicious website can make authenticated cross-origin requests.

**Fix:** Whitelist explicit origins.

```ts
app.enableCors({
  origin: [process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
});
```

---

### C3 | Duplicate CORS — Controller Reflects Any Origin
**File:** `seven7barber-api/src/auth/auth-better.controller.ts:18-19`

`res.header("Access-Control-Allow-Origin", origin)` creates a second CORS-permissive layer that bypasses global restrictions.

**Fix:** Remove manual CORS headers; let `enableCors()` handle it.

---

### C4 | Admin Endpoints Completely Unprotected
**File:** `seven7barber-api/src/admin/admin.controller.ts:4`

All admin endpoints (appointments, clients, metrics) have zero authentication. Any anonymous user can access them.

**Fix:** Add `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('ADMIN')`.

---

### C5 | Services CRUD Endpoints Unprotected
**File:** `seven7barber-api/src/services/services.controller.ts:8`

`POST/PATCH/DELETE /services` are fully public. Anyone can create, modify, or delete services.

**Fix:** Add admin-only guards on mutating endpoints.

---

### C6 | Voucher Creation/Deactivation Unprotected
**File:** `seven7barber-api/src/vouchers/vouchers.controller.ts:26-52`

Anyone can create vouchers with arbitrary discounts or deactivate existing ones.

**Fix:** Admin-only guard required.

---

### C7 | Notifications Endpoint — Email Relay Vulnerability
**File:** `seven7barber-api/src/notifications/notifications.controller.ts:8`

`POST /notifications/send` allows anyone to send emails to arbitrary addresses using the app's template system.

**Fix:** Remove from public API or guard with admin auth.

---

### C8 | No Global ValidationPipe Configured
**File:** `seven7barber-api/src/main.ts:8-39`

`main.ts` never calls `app.useGlobalPipes(new ValidationPipe(...))`. All class-validator decorators are dead code. All `@Body()` and `@Query()` params are unvalidated.

**Fix:** Add to `main.ts`:
```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
```

---

### C9 | Hardcoded `localhost` API URL in Client Bundle
**Files:** `seven7barber-web/src/lib/auth-client.ts:5`, `seven7barber-web/src/app/login/page.tsx:9`, `seven7barber-web/src/server/auth.ts:3`

All use `http://localhost:3000`. In production, API calls will fail or hit localhost on the user's machine.

**Fix:** Use `NEXT_PUBLIC_API_URL` for client code, `process.env.API_URL` for server code.

---

### C10 | No CSRF Protection on Auth Endpoints
**Files:** `seven7barber-web/src/server/auth.ts`, `seven7barber-web/src/app/login/page.tsx`

All auth requests use `credentials: "include"` but send no CSRF token. Any malicious site can trigger auth actions.

**Fix:** Implement double-submit cookie pattern or synchronizer token.

---

### C11 | Admin Page Has Zero Access Control
**File:** `seven7barber-web/src/app/admin/page.tsx:47`

The admin dashboard is a plain Server Component with no auth check. Any unauthenticated user can access `/admin`.

**Fix:** Add middleware or server-side session check.

---

### C12 | Booking Submit Is a Fake Stub
**File:** `seven7barber-web/src/app/booking/wizard/wizard.tsx:73-79`

The entire booking flow culminates in a fake `setTimeout` and `alert()`. No API call is made. Users will lose their booking.

**Fix:** Replace with actual API call to the booking endpoint.

---

## HIGH Findings

### H1 | No Input Validation on Auth Endpoints
**Files:** `seven7barber-api/src/auth/auth.controller.ts:11,20`

Both `login()` and `register()` accept `@Body() req: any` — no DTO, no validation. An attacker can inject arbitrary Prisma fields (e.g., `role: 'ADMIN'`).

**Fix:** Create strict DTOs with Zod/class-validator.

---

### H2 | Weak Password Policy
**File:** `seven7barber-api/src/auth/better-auth.ts:15`

`minPasswordLength: 6` with no complexity requirements. OWASP recommends minimum 8 characters.

---

### H3 | Dual Auth Systems on Same Path
**Files:** `seven7barber-api/src/auth/auth.controller.ts:6`, `seven7barber-api/src/auth/auth-better.controller.ts:6`

Both controllers use `@Controller('auth')`. The `@All("*path")` catch-all creates unpredictable behavior.

**Fix:** Pick one strategy or use different base paths.

---

### H4 | No Rate Limiting on Auth Endpoints
**Files:** `seven7barber-api/src/auth/auth.controller.ts`, `seven7barber-api/src/auth/auth-better.controller.ts`

No brute-force protection. Unlimited password attempts allowed.

**Fix:** Add `@nestjs/throttler`.

---

### H5 | OAuth Tokens Stored in Plaintext
**File:** `seven7barber-api/prisma/schema.prisma:71-73`

`accessToken`, `refreshToken`, `idToken` stored as plain `String?`. Database compromise exposes all tokens.

---

### H6 | Reviews Endpoint Has No Auth
**File:** `seven7barber-api/src/reviews/reviews.controller.ts:8-19`

Anyone can submit reviews for any appointment ID without being the actual client.

---

### H7 | Availability Race Condition — Double Booking
**File:** `seven7barber-api/src/availability/availability.service.ts:51-98`

No atomic check-and-book. Two clients can book the same slot simultaneously.

**Fix:** Use Prisma transaction with `SERIALIZABLE` isolation or unique constraint on `(barberId, dateTime, status)`.

---

### H8 | Availability Timezone Issue
**File:** `seven7barber-api/src/availability/availability.service.ts:84-85`

Uses server's local timezone for hour extraction, but `dateTime` is stored in UTC. Slot calculations off by hours.

---

### H9 | Voucher Validate/Accepts Arbitrary userId
**File:** `seven7barber-api/src/vouchers/vouchers.controller.ts:9-23`

Both endpoints accept `userId` from request body. Users can impersonate others.

**Fix:** Get userId from `req.user.id` via auth guard.

---

### H10 | Payments Callback Uses Hardcoded Signature
**File:** `seven7barber-api/src/payments/payments.service.ts:88-89`

`const validSignature = 'valid-signature'` — anyone can approve payments.

---

### H11 | Auth Response Never Validated
**Files:** `seven7barber-web/src/server/auth.ts:12,22,30,37`

None of the server auth functions check `response.ok`. Callers silently get error payloads.

---

### H12 | Session Hook Doesn't Refetch After Login
**File:** `seven7barber-web/src/lib/auth-client.ts:38-40`

`useSession` fetches once on mount. After login, header doesn't update.

---

### H13 | Register Page Duplicates Auth Logic
**File:** `seven7barber-web/src/app/register/page.tsx:21`

Hardcoded URL + duplicated fetch instead of using shared `signUp` function.

---

### H14 | No Error Boundaries Anywhere
**Files:** All web routes

No `error.tsx` files. Any component crash = white screen.

---

### H15 | Barbers Endpoint Leaks Sensitive Data
**Files:** `seven7barber-api/src/services/barbers.service.ts:9-12,15-21`

No `select` clause — returns full `User` model including password hash.

---

### H16 | Payments Sessions in Global Mutable Map
**File:** `seven7barber-api/src/payments/payments.service.ts:39,43`

In-memory store. Server restart loses data. Not production-ready.

---

### H17 | Account Model Stores OAuth Tokens in Plaintext
**File:** `seven7barber-api/prisma/schema.prisma:71-73`

`accessToken`, `refreshToken`, `idToken` stored as plain `String?`.

---

### H18 | No Token Refresh Mechanism
**File:** `seven7barber-api/src/auth/auth.module.ts:16`

JWT expires in 1 day but no `/auth/refresh` endpoint exists.

---

## MEDIUM Findings

| # | File | Issue |
|---|------|-------|
| M1 | `admin/admin.service.ts:70-71` | Uses `throw new Error()` instead of NestJS exceptions (returns 500 instead of 400) |
| M2 | `admin/admin.service.ts:36-39` | No input validation on date filters, no pagination limit |
| M3 | `services/services.controller.ts:24` | Zod parsed twice (controller + service) |
| M4 | `availability/dto/get-availability.dto.ts` | class-validator decorators never executed (no ValidationPipe) |
| M5 | `auth/auth.middleware.ts:14` | Console logging of request details in production |
| M6 | `better-auth.ts` | No CSRF protection for cookie-based sessions |
| M7 | `better-auth.ts:9` | Trusted origins hardcoded to localhost |
| M8 | `auth.controller.ts`, `auth.service.ts` | No logout / token blacklisting |
| M9 | `main.ts:31` | Swagger exposed without authentication in production |
| M10 | `auth/auth-better.controller.ts:16` | Wildcard route conflicts with JWT controller |
| M11 | `notifications/notifications.service.ts:28` | Global mutable email queue (memory leak) |
| M12 | `seven7barber-web/src/app/dashboard/appointments/page.tsx` | Mock data with no API integration |
| M13 | `seven7barber-web/src/app/dashboard/appointments/page.tsx:155` | Cancel button has no handler |
| M14 | `seven7barber-web/src/app/page.tsx:60` | Hero CTA button does nothing |
| M15 | `seven7barber-web/src/components/providers.tsx` | No-op wrapper component |
| M16 | `seven7barber-web/src/app/globals.css:12` | `--font-heading` overridden to `--font-sans` |
| M17 | `seven7barber-web/src/app/booking/wizard/steps/confirm.tsx:3` | Wrong import path for BookingState |
| M18 | `seven7barber-web/src/app/login/page.tsx:45` | No progressive enhancement on forms |

---

## LOW Findings

| # | File | Issue |
|---|------|-------|
| L1 | `auth.service.ts`, `auth.controller.ts` | `any` types pervasive — no type safety |
| L2 | `auth.service.ts`, `auth.module.ts` | No token invalidation on password change |
| L3 | `auth.middleware.ts:47-48` | Error response may leak stack traces |
| L4 | `vouchers/vouchers.service.ts:9-10` | Voucher code lookup is case-sensitive |
| L5 | `services/services.service.ts:29` | Price cast through `unknown` is fragile |
| L6 | `availability/dto/get-availability.dto.ts:9-11` | No limit on serviceIds array length |
| L7 | `reviews/reviews.service.ts:97` | Rating distribution assumes 1-5 but no guard |
| L8 | `seven7barber-web/src/app/page.tsx:135,140,145` | Social media links are `href="#"` |
| L9 | `seven7barber-web/src/app/sitemap.ts:31-42` | noIndex pages included in sitemap |
| L10 | `seven7barber-web/src/app/booking/wizard/step-indicator.tsx:3` | Unused `Link` import |

---

## Orphaned Files

| File | Issue |
|------|-------|
| `src/appointments/booking.service.spec.ts` | No corresponding production source |
| `src/appointments/time-slot.service.spec.ts` | No corresponding production source |

---

## Missing Files

| Expected | Purpose |
|----------|---------|
| `.dockerignore` (api + web) | Prevent unnecessarily large Docker build contexts |
| `src/app/**/error.tsx` | Error boundaries for all routes |
| `src/app/**/loading.tsx` | Suspense boundaries for all routes |
| `src/auth/dto/register.dto.ts` | Input validation for registration |
| `src/auth/dto/login.dto.ts` | Input validation for login |

---

## Priority Remediation Order

### Phase 1: Security Blockers (CRITICAL)
1. Remove hardcoded JWT fallback — fail on missing `JWT_SECRET` (C1)
2. Fix CORS — whitelist origins (C2, C3)
3. Add `JwtAuthGuard` + `RolesGuard` to admin, services, vouchers, notifications, reviews (C4-C7)
4. Configure `ValidationPipe` globally (C8)
5. Replace hardcoded localhost URLs with env vars (C9)
6. Add CSRF protection (C10)
7. Add auth middleware for admin routes (C11)
8. Implement actual booking API call (C12)

### Phase 2: Security Hardening (HIGH)
1. Create proper DTOs for auth endpoints (H1)
2. Increase password requirements (H2)
3. Resolve dual auth system conflict (H3)
4. Add rate limiting (H4)
5. Encrypt OAuth tokens at rest (H5)
6. Add auth to reviews (H6)
7. Fix availability race condition (H7)
8. Fix timezone handling (H8)
9. Fix voucher userId spoofing (H9)
10. Implement proper payment signature verification (H10)

### Phase 3: Code Quality (MEDIUM)
1. Fix admin error handling (M1-M2)
2. Remove double validation (M3)
3. Fix barbers data leak (M15)
4. Add error boundaries to web (H14)
5. Fix all non-functional UI elements (M13-M14)

### Phase 4: Polish (LOW)
1. Add proper types throughout (L1)
2. Fix case sensitivity issues (L4)
3. Clean up unused imports (L10)
4. Fix sitemap contradictions (L9)

---

## Metrics

| Metric | Value |
|--------|-------|
| Total files reviewed | 88 production + 16 test |
| API modules | 12 |
| Web routes | 7 |
| Auth systems | 2 (conflicting) |
| Test coverage | Low (16 test files for 88 source files) |
| Security posture | Poor (12 critical issues) |
