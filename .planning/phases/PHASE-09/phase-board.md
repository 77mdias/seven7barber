# PHASE-09: Security Hardening II — Task Board

**Phase:** 09
**Status:** 🟡 PLANNING
**Total Tasks:** 10
**Completed:** 0

---

## 📋 Tasks

### 🔐 Auth Security (HIGH)

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-01 | Create strict DTOs for auth endpoints | HIGH | ⏳ Pending | H1 - Zod schemas for login/register |
| T-02 | Strengthen password policy | HIGH | ⏳ Pending | H2 - 8+ chars, complexity requirements |
| T-03 | Resolve dual auth system | HIGH | ⏳ Pending | H3 - Pick one auth controller |
| T-04 | Verify rate limiting | HIGH | ⏳ Pending | H4 - Confirm @nestjs/throttler active |
| T-05 | Encrypt OAuth tokens at rest | HIGH | ⏳ Pending | H5/H17 - AES-256 encryption |
| T-06 | Add auth to reviews endpoint | HIGH | ⏳ Pending | H6 - Require authentication |

### 🌐 Web Auth Fixes (MEDIUM)

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-07 | Validate auth responses | MEDIUM | ⏳ Pending | H11 - Check response.ok |
| T-08 | Fix session hook refetch | MEDIUM | ⏳ Pending | H12 - Update header after login |
| T-09 | Fix register page auth | MEDIUM | ⏳ Pending | H13 - Use shared signUp |

### 💳 Payments (HIGH)

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-10 | Move payments from memory to DB | HIGH | ⏳ Pending | H16 - Replace global Map with Prisma |

---

## 🔗 Dependencies

- Depends on: PHASE-08 (Code Quality)

## 📁 Files to Modify

- `seven7barber-api/src/auth/auth.controller.ts`
- `seven7barber-api/src/auth/auth-better.controller.ts`
- `seven7barber-api/src/auth/dto/`
- `seven7barber-api/src/auth/auth.service.ts`
- `seven7barber-api/src/auth/better-auth.ts`
- `seven7barber-api/src/auth/auth.module.ts`
- `seven7barber-api/src/reviews/reviews.controller.ts`
- `seven7barber-api/src/payments/payments.service.ts`
- `seven7barber-api/prisma/schema.prisma`
- `seven7barber-web/src/server/auth.ts`
- `seven7barber-web/src/lib/auth-client.ts`
- `seven7barber-web/src/app/register/page.tsx`

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
- [ ] OAuth tokens encrypted at rest
- [ ] Reviews require authentication
- [ ] Web auth responses validated
- [ ] Session refetches after login
- [ ] Register uses shared auth
- [ ] Payment sessions in database
