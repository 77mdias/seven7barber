# PLAN-07A: Security Hardening Implementation

**Phase:** 07
**Status:** PLANNING
**Tasks:** 8

---

## Phase Goal
Fix all HIGH severity security issues from REVIEW.md to establish production-ready security posture.

---

## Task Breakdown

### Task 1: Fix Availability Race Condition
**Priority:** HIGH
**Files:** `availability.service.ts`, `booking.service.ts`

1. Add Prisma transaction with SERIALIZABLE isolation to booking flow
2. Add atomic check-and-book pattern
3. Add tests for concurrent booking scenario

**Verification:** Two simultaneous bookings for same slot → one succeeds, one fails

---

### Task 2: Fix Timezone Handling
**Priority:** HIGH
**Files:** `availability.service.ts`

1. Replace `getHours()`/`getMinutes()` with `getUTCHours()`/`getUTCMinutes()`
2. Ensure all Date comparisons use UTC
3. Add comment explaining UTC handling

**Verification:** Slots calculated correctly regardless of server timezone

---

### Task 3: Complete Voucher userId Spoofing Fix
**Priority:** HIGH
**Files:** `vouchers.service.ts`

1. Verify service uses `req.user.id` not body userId
2. Add integration test

**Verification:** Voucher operations always use authenticated user

---

### Task 4: Payment Signature Verification
**Priority:** HIGH
**Files:** `payments.service.ts`

1. Replace hardcoded signature with HMAC-SHA256 verification
2. Add PAYMENT_WEBHOOK_SECRET env var
3. Update error message

**Verification:** Invalid signatures are rejected

---

### Task 5: OAuth Token Encryption
**Priority:** HIGH
**Files:** `auth.service.ts` or new `encryption.service.ts`, `prisma/schema.prisma`

1. Create encryption utility functions (encryptToken, decryptToken)
2. Update Account model operations to encrypt/decrypt
3. Add TOKEN_ENCRYPTION_KEY env var

**Verification:** Tokens stored are not readable as plain text

---

### Task 6: Auth Response Validation
**Priority:** HIGH
**Files:** `server/auth.ts`, `lib/auth-client.ts`

1. Add `response.ok` check to all auth functions
2. Throw descriptive errors on failure

**Verification:** Silent auth failures eliminated

---

### Task 7: Token Refresh Mechanism
**Priority:** HIGH
**Files:** `auth.controller.ts`, `auth.service.ts`, `auth.module.ts`

1. Add `refreshTokens` method in AuthService
2. Create `POST /auth/refresh` endpoint
3. Add refresh token to User model (if not exists)

**Verification:** Expired JWT can be refreshed

---

### Task 8: Rate Limiting
**Priority:** HIGH
**Files:** `auth.module.ts`, `main.ts`

1. Install @nestjs/throttler
2. Configure ThrottlerModule with 5 attempts/minute
3. Apply to auth endpoints

**Verification:** 6th attempt returns 429

---

## Implementation Order

1. Task 4 (Payment signature) — quick fix, high impact
2. Task 1 (Race condition) — core booking integrity
3. Task 6 (Auth response) — prevents silent failures
4. Task 8 (Rate limiting) — brute force protection
5. Task 7 (Token refresh) — session management
6. Task 2 (Timezone) — data consistency
7. Task 3 (Voucher) — partial fix already done
8. Task 5 (Token encryption) — largest change, defer to end

---

## Testing Strategy

```bash
# Run security-specific tests
bun test src/auth/
bun test src/availability/
bun test src/payments/

# Manual verification
# - Concurrent booking test (2 terminals)
# - Payment callback with invalid signature
# - Rate limit test (send 6 requests)
```

---

## Rollback Plan

If issues arise:
1. Revert individual task changes via git
2. PHASE-06 is complete, can still deploy with known HIGH issues
3. Document which tasks are safe to defer

---

## Dependencies

- @nestjs/throttler package
- PAYMENT_WEBHOOK_SECRET env
- TOKEN_ENCRYPTION_KEY env (32 hex chars)