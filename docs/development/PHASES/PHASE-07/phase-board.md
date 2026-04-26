# PHASE-07: Security Hardening — Task Board

**Phase:** 07
**Status:** 🟡 PLANNING
**Total Tasks:** 8
**Completed:** 0

---

## 📋 Tasks

### 🔒 Security Fixes

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-01 | Fix availability race condition with Prisma transaction | HIGH | ⏳ Pending | Use SERIALIZABLE isolation |
| T-02 | Fix timezone handling - UTC consistency | HIGH | ⏳ Pending | Store/compare in UTC |
| T-03 | Complete voucher userId spoofing fix | HIGH | ⏳ Pending | Check vouchers.service.ts |
| T-04 | Implement payment signature verification | HIGH | ⏳ Pending | Replace hardcoded signature |
| T-05 | Encrypt OAuth tokens at rest | HIGH | ⏳ Pending | Use proper encryption |
| T-06 | Add auth response validation | HIGH | ⏳ Pending | Check response.ok in auth.ts |
| T-07 | Implement token refresh mechanism | HIGH | ⏳ Pending | Add /auth/refresh endpoint |
| T-08 | Add rate limiting | HIGH | ⏳ Pending | @nestjs/throttler |

---

## 🔗 Dependencies

- Depends on: PHASE-06 (Launch)

## 📁 Files to Modify

- `seven7barber-api/src/availability/availability.service.ts`
- `seven7barber-api/src/payments/payments.service.ts`
- `seven7barber-api/src/vouchers/vouchers.service.ts`
- `seven7barber-api/src/auth/auth.module.ts`
- `seven7barber-api/src/auth/auth.controller.ts`
- `seven7barber-api/src/auth/auth.service.ts`
- `seven7barber-api/prisma/schema.prisma`

## 🧪 Test Scenarios

1. Two concurrent booking requests → only one succeeds
2. Payment callback with invalid signature → rejected
3. Voucher validate with different userId → uses authenticated user
4. Expired JWT → refresh token flow works
5. Brute force login → rate limited after 5 attempts

---

## ✅ Completion Criteria

- [ ] Prisma transaction prevents double booking
- [ ] All dates stored/compared in UTC
- [ ] Payment signatures properly verified
- [ ] OAuth tokens encrypted at rest
- [ ] Token refresh endpoint functional
- [ ] Rate limiting active on auth endpoints