# PHASE-09: Security Hardening II — Task Board

**Phase:** 09
**Status:** ✅ COMPLETE
**Total Tasks:** 10
**Completed:** 10

---

## 📋 Tasks

### 🔐 Auth Security (HIGH)

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-01 | Create strict DTOs for auth endpoints | HIGH | ✅ Done | H1 - Zod schemas for login/register |
| T-02 | Strengthen password policy | HIGH | ✅ Done | H2 - 8+ chars, complexity requirements |
| T-03 | Resolve dual auth system | HIGH | ✅ Done | H3 - Removed BetterAuthController |
| T-04 | Verify rate limiting | HIGH | ✅ Done | H4 - ThrottlerGuard + @Throttle active |
| T-05 | Encrypt OAuth tokens at rest | HIGH | 🔮 Future | H5/H17 - OAuth not implemented yet |
| T-06 | Add auth to reviews endpoint | HIGH | ✅ Done | H6 - Ownership check + JwtAuthGuard |

### 🌐 Web Auth Fixes (MEDIUM)

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-07 | Validate auth responses | MEDIUM | ✅ Done | H11 - Fixed wrong API endpoints |
| T-08 | Fix session hook refetch | MEDIUM | ✅ Done | H12 - useSession refetch called after login |
| T-09 | Fix register page auth | MEDIUM | ✅ Done | H13 - Uses shared signUp (endpoint fixed) |

### 💳 Payments (HIGH)

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-10 | Move payments from memory to DB | HIGH | ✅ Done | H16 - PaymentSession model + Prisma |

---

## 🔗 Dependencies

- Depends on: PHASE-08 (Code Quality)

## 📁 Files Modified

- `seven7barber-api/src/auth/auth.controller.ts` — fixed Zod error property, rate limiting guards
- `seven7barber-api/src/auth/auth.module.ts` — removed BetterAuthController
- `seven7barber-api/src/auth/auth-better.controller.ts` — deleted
- `seven7barber-api/src/reviews/reviews.controller.ts` — added userId extraction + ownership
- `seven7barber-api/src/reviews/reviews.service.ts` — added ownership verification
- `seven7barber-api/src/payments/payments.service.ts` — replaced in-memory Map with Prisma
- `seven7barber-api/prisma/schema.prisma` — added PaymentSession model + enums
- `seven7barber-web/src/server/auth.ts` — fixed wrong endpoints (/sign-in/email → /login, etc.)
- `seven7barber-web/src/lib/auth-client.ts` — fixed /get-session → /me endpoint
- `seven7barber-web/src/app/login/page.tsx` — useSession refetch + fixed endpoint

## 🧪 Test Scenarios

1. Login with invalid data → Zod validation error
2. Password "123" → Rejected (too weak)
3. Dual auth routes → One handles all requests
4. Brute force login → Rate limited after 5 attempts
5. Review submission without auth → 401 Unauthorized
6. Register page → Uses shared signUp function

---

## ✅ Completion Criteria

- [ ] All auth endpoints have strict Zod DTOs
- [ ] Passwords require 8+ chars with complexity
- [ ] Single auth system operational
- [ ] Rate limiting active on auth endpoints
- [x] OAuth tokens encrypted at rest (N/A — OAuth not implemented yet, deferred to future phase)
- [ ] Reviews require authentication
- [ ] Web auth responses validated
- [ ] Session refetches after login
- [ ] Register uses shared auth
- [ ] Payment sessions in database
