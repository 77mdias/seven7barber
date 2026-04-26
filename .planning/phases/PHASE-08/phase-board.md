# PHASE-08: Code Quality & Polish — Task Board

**Phase:** 08
**Status:** 🟡 PLANNING
**Total Tasks:** 8
**Completed:** 0

---

## 📋 Tasks

### 📊 Code Quality

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-01 | Fix admin error handling - use NestJS exceptions | MEDIUM | ⏳ Pending | Replace throw new Error() |
| T-02 | Add input validation on admin date filters | MEDIUM | ⏳ Pending | Add pagination limit |
| T-03 | Remove double Zod validation | MEDIUM | ⏳ Pending | Single validation point |
| T-04 | Fix barbers data leak - exclude password hash | MEDIUM | ⏳ Pending | Add select clause |
| T-05 | Add error boundaries to all web routes | MEDIUM | ⏳ Pending | error.tsx files |
| T-06 | Fix non-functional UI elements | MEDIUM | ⏳ Pending | Cancel button, hero CTA |
| T-07 | Fix case sensitive voucher lookup | LOW | ⏳ Pending | Case-insensitive |
| T-08 | Fix or remove noop provider wrapper | LOW | ⏳ Pending | providers.tsx |

---

## 🔗 Dependencies

- Depends on: PHASE-07 (Security Hardening)

## 📁 Files to Modify

- `seven7barber-api/src/admin/admin.service.ts`
- `seven7barber-api/src/services/barbers.service.ts`
- `seven7barber-api/src/vouchers/vouchers.service.ts`
- `seven7barber-web/src/components/providers.tsx`
- `seven7barber-web/src/app/booking/wizard/steps/confirm.tsx`
- `seven7barber-web/src/app/page.tsx`
- All web routes → add error.tsx

## 🧪 Test Scenarios

1. Admin endpoint error → proper NestJS exception returned
2. Barbers list → no password hashes in response
3. Error boundary triggered → graceful fallback UI
4. Cancel booking → actual cancellation API called
5. Hero CTA click → navigation works

---

## ✅ Completion Criteria

- [ ] Admin errors return proper 4xx status codes
- [ ] No password hash leaks in any API response
- [ ] All web routes have error boundaries
- [ ] All UI elements are functional
- [ ] Double validation removed