---
phase: 9
name: "Security Hardening II"
slug: "security-hardening-ii"
status: "in_progress"
goal: "Resolve all remaining HIGH severity findings from REVIEW.md to achieve production-ready security posture."
description: "Address remaining HIGH severity issues not covered by PHASE-07: auth DTOs, password policy, dual auth resolution, rate limiting verification, OAuth token encryption, reviews auth, web auth fixes, and payments persistence."
depends_on: "08"
requirements:
  - "REQ-HARD-01: Create strict DTOs for auth endpoints (H1)"
  - "REQ-HARD-02: Strengthen password policy to 8+ chars with complexity (H2)"
  - "REQ-HARD-03: Resolve dual auth system conflict - pick one strategy (H3)"
  - "REQ-HARD-04: Verify rate limiting is properly configured (H4)"
  - "REQ-HARD-05: Encrypt OAuth tokens at rest (H5/H17)"
  - "REQ-HARD-06: Add authentication to reviews endpoint (H6)"
  - "REQ-HARD-07: Validate auth responses in web (H11)"
  - "REQ-HARD-08: Fix session hook to refetch after login (H12)"
  - "REQ-HARD-09: Fix register page to use shared auth (H13)"
  - "REQ-HARD-10: Move payments from global map to database (H16)"
created: "2026-04-27"
last_updated: "2026-04-27"
---

# PHASE-09: Security Hardening II

**Status:** 🟡 PLANNING
**Goal:** Resolve all remaining HIGH severity findings from REVIEW.md

## 🎯 Objectives

1. **Auth DTOs** — Create strict input validation for login/register
2. **Password Policy** — Strengthen to 8+ chars with complexity requirements
3. **Dual Auth Resolution** — Pick one auth system, remove conflicts
4. **OAuth Token Security** — Encrypt tokens at rest in database
5. **Reviews Auth** — Ensure only authenticated users can submit reviews
6. **Web Auth Fixes** — Validate responses, fix session, deduplicate code
7. **Payments Persistence** — Move from in-memory to database

## 📋 Requirements

| ID | Requirement | Status | Priority |
|----|-------------|--------|----------|
| REQ-HARD-01 | Auth DTOs | ✅ Done | HIGH |
| REQ-HARD-02 | Password policy | ✅ Done | HIGH |
| REQ-HARD-03 | Dual auth resolution | ⏳ Pending | HIGH |
| REQ-HARD-04 | Rate limiting verification | ⏳ Pending | HIGH |
| REQ-HARD-05 | OAuth token encryption | ⏳ Pending | HIGH |
| REQ-HARD-06 | Reviews auth | ⏳ Pending | HIGH |
| REQ-HARD-07 | Web auth response validation | ✅ Done | MEDIUM |
| REQ-HARD-08 | Session hook refetch | ⏳ Pending | MEDIUM |
| REQ-HARD-09 | Register page dedup | ✅ Done | MEDIUM |
| REQ-HARD-10 | Payments persistence | ⏳ Pending | HIGH |

## 🔗 Dependencies

- PHASE-08: Code Quality & Polish (must be complete)

## 📁 Structure

```
docs/development/PHASES/PHASE-09/
├── phase.md              # This file
├── phase-board.md        # Task board
├── SPECS/
│   └── SPEC-hardening.md # Hardening specification
└── plans/
    └── 09a-PLAN.md      # Main hardening plan
```

## 🚀 Quick Links

- [REVIEW.md](../../../REVIEW.md) — Source of security findings
- [ROADMAP.md](../../../ROADMAP.md)
- [PHASE-08 Board](../PHASE-08/phase-board.md)
- [PHASE-07 Board](../PHASE-07/phase-board.md)

## 🔒 Security Checklist

- [ ] Strict Zod DTOs for all auth endpoints
- [ ] Password policy: 8+ chars, uppercase, lowercase, number, special
- [ ] Single auth system (remove auth-better or auth controller)
- [ ] Rate limiting active on all auth endpoints
- [ ] OAuth tokens encrypted with AES-256
- [ ] Reviews require authenticated user
- [ ] Auth response.ok checked in all fetch calls
- [ ] Session refetches after login
- [ ] Register uses shared signUp function
- [ ] Payment sessions stored in database, not memory
