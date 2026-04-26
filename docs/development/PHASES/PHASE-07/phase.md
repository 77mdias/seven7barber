---
phase: 7
name: "Security Hardening"
slug: "security-hardening"
status: "complete"
goal: "Fix all HIGH severity security issues identified in REVIEW.md to ensure production-ready security posture."
description: "Address all HIGH severity findings from the codebase review including availability race conditions, timezone handling, voucher userId spoofing, payment signature verification, OAuth token encryption, and auth response validation."
depends_on: "06"
requirements:
  - "REQ-SEC-01: Fix availability race condition (H7) - Use Prisma transaction with SERIALIZABLE isolation"
  - "REQ-SEC-02: Fix timezone handling (H8) - Store and compare in UTC consistently"
  - "REQ-SEC-03: Fix voucher userId spoofing (H9) - Already partially fixed in vouchers.controller.ts"
  - "REQ-SEC-04: Implement proper payment signature verification (H10)"
  - "REQ-SEC-05: Encrypt OAuth tokens at rest (H17) - Use @nestjs/jwt with proper encryption"
  - "REQ-SEC-06: Auth response validation (H11) - Check response.ok in all server auth functions"
  - "REQ-SEC-07: Add token refresh mechanism (H18) - Implement /auth/refresh endpoint"
  - "REQ-SEC-08: Rate limiting (H4) - Add @nestjs/throttler for brute force protection"
created: "2026-04-26"
last_updated: "2026-04-26"
---

# PHASE-07: Security Hardening

**Status:** 🟡 PLANNING
**Goal:** Fix all HIGH severity security issues identified in REVIEW.md

## 🎯 Objectives

1. **Race Condition Fix** — Atomic check-and-book for availability with Prisma transactions
2. **Timezone Consistency** — Ensure all dateTime comparisons use UTC
3. **Payment Signature** — Replace hardcoded signature with real verification
4. **Token Refresh** — Add JWT refresh endpoint and mechanism
5. **Rate Limiting** — Add throttler guard to prevent brute force

## 📋 Requirements

| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| REQ-SEC-01 | Availability race condition | ⏳ Pending | H7 - needs Prisma transaction |
| REQ-SEC-02 | Timezone handling | ⏳ Pending | H8 - UTC consistency |
| REQ-SEC-03 | Voucher userId spoofing | ✅ Partial | vouchers.controller fixed, service still needs check |
| REQ-SEC-04 | Payment signature verification | ⏳ Pending | H10 - replace hardcoded signature |
| REQ-SEC-05 | OAuth token encryption | ⏳ Pending | H17 - encrypt at rest |
| REQ-SEC-06 | Auth response validation | ⏳ Pending | H11 - check response.ok |
| REQ-SEC-07 | Token refresh mechanism | ⏳ Pending | H18 - add /auth/refresh |
| REQ-SEC-08 | Rate limiting | ⏳ Pending | H4 - add @nestjs/throttler |

## 🔗 Dependencies

- PHASE-06: Launch (must be complete)

## 📁 Structure

```
docs/development/PHASES/PHASE-07/
├── phase.md              # This file
├── phase-board.md        # Task board
├── SPECS/
│   └── SPEC-security.md   # Security specification
└── plans/
    └── 07a-PLAN.md       # Main security plan
```

## 🚀 Quick Links

- [REVIEW.md](../../../../REVIEW.md) — Source of security findings
- [ROADMAP.md](../../../../ROADMAP.md)
- [PHASE-06 Board](../PHASE-06/phase-board.md)

## 🔒 Security Checklist

- [ ] Prisma SERIALIZABLE transaction for booking
- [ ] UTC timezone handling for all dateTime
- [ ] Payment gateway signature verification
- [ ] Encrypted token storage
- [ ] Token refresh endpoint
- [ ] Rate limiting on auth endpoints
- [ ] Auth response validation