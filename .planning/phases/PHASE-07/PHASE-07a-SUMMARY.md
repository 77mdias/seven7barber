# Phase 07a Plan: Security Hardening Summary

**Phase:** 07
**Plan:** 07a-PLAN.md
**Status:** COMPLETED
**Completed:** 2026-04-26

## One-Liner
JWT auth with refresh rotation, HMAC-SHA256 payment signatures, rate limiting (5/min), UTC timezone handling, and throttler guards on auth endpoints.

## Implementation Summary

### Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Payment Signature (HMAC-SHA256) | 99f402cb | payments.service.ts |
| 2 | Timezone UTC Handling | 91a13b9d | availability.service.ts, admin.service.ts |
| 3 | Voucher userId Spoofing Fix | N/A (already fixed) | vouchers.service.ts, vouchers.controller.ts |
| 4 | Auth Response Validation | 44afe4b7 | server/auth.ts |
| 5 | Token Refresh Mechanism | 0721c4b4 | auth.controller.ts, auth.service.ts, auth.module.ts |
| 6 | Rate Limiting | 0721c4b4 | auth.module.ts, auth.controller.ts |
| 7 | Tests for UTC | adaead13 | availability.service.spec.ts |

### Security Fixes Applied

1. **Payment Signature (Task 4)**: Replaced hardcoded `'valid-signature'` with HMAC-SHA256 verification using `PAYMENT_WEBHOOK_SECRET` env var. Signature is computed from `sessionId` and `status`.

2. **Timezone UTC (Task 2)**: Replaced `getHours()`/`getMinutes()` with `getUTCHours()`/`getUTCMinutes()` in `availability.service.ts`. Also added UTC date construction in `admin.service.ts` for `getTodayAppointments()`.

3. **Voucher userId (Task 3)**: Confirmed service methods receive `userId` from `req.user.id` via JWT guard in `vouchers.controller.ts`. No changes needed.

4. **Auth Response Validation (Task 6)**: All auth functions in `server/auth.ts` already had `response.ok` checks. Added `refreshTokens` function for frontend token refresh support.

5. **Token Refresh (Task 7)**: Added `refreshTokens()` method to `AuthService` and `POST /auth/refresh` endpoint. Uses Prisma session lookup for refresh token validation.

6. **Rate Limiting (Task 8)**: Installed `@nestjs/throttler` (v6.5.0), configured `ThrottlerModule` with 5 attempts/minute ttl, applied `ThrottlerGuard` + `@Throttle` to `login` and `register` endpoints.

### Environment Variables Added

```env
PAYMENT_WEBHOOK_SECRET=your-payment-webhook-secret-here
TOKEN_ENCRYPTION_KEY=your-32-char-hex-key-here-1234
```

### Deferred Items

- **OAuth Token Encryption (Task 5)**: No Account model operations found in codebase. This task is a low-priority stub - tokens appear to be managed by better-auth internally. Can be revisited if OAuth features are implemented.

- **Race Condition (Task 1)**: No booking service found (only spec files exist). The atomic check-and-book pattern requires a booking service implementation before transactions can be added.

## Verification

```bash
bun test src/availability/  # 7 pass, 0 fail
bun test src/payments/       # Run payment tests
bun run lint                 # Lint check (pre-existing warnings in spec files)
```

## Commits

- `99f402cb` fix(07a-PHASE-07): replace hardcoded payment signature with HMAC-SHA256
- `91a13b9d` fix(07a-PHASE-07): replace getHours/getMinutes with UTC methods
- `0721c4b4` feat(07a-PHASE-07): add rate limiting and token refresh endpoint
- `44afe4b7` feat(07a-PHASE-07): add refreshTokens function to frontend auth
- `adaead13` test(07a-PHASE-07): update availability tests for UTC timezone handling

## Dependencies Added

- `@nestjs/throttler@6.5.0`

## Tech Stack Changes

- Added `@nestjs/throttler` for rate limiting
- Added `crypto` module for HMAC-SHA256 payment signatures
