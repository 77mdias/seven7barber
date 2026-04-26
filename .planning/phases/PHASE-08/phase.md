---
phase: 8
name: "Code Quality & Polish"
slug: "code-quality"
status: "planning"
goal: "Fix all MEDIUM severity issues and improve overall code quality and robustness."
description: "Address all MEDIUM severity findings from REVIEW.md including admin error handling, double validation, barbers data leak, missing error boundaries, and non-functional UI elements."
depends_on: "07"
requirements:
  - "REQ-QUAL-01: Admin error handling (M1) - Use NestJS exceptions instead of throw new Error()"
  - "REQ-QUAL-02: Input validation on admin (M2) - Add date filter validation and pagination limit"
  - "REQ-QUAL-03: Remove double Zod validation (M3) - Single validation point"
  - "REQ-QUAL-04: Barbers data leak (M15) - Add select clause to exclude password hash"
  - "REQ-QUAL-05: Add error boundaries (H14) - Create error.tsx for all web routes"
  - "REQ-QUAL-06: Fix non-functional UI (M13, M14) - Booking cancel button, hero CTA"
  - "REQ-QUAL-07: Fix case sensitivity (L4) - Voucher code lookup case-insensitive"
  - "REQ-QUAL-08: Noop provider wrapper (M15) - Remove or implement properly"
created: "2026-04-26"
last_updated: "2026-04-26"
---

# PHASE-08: Code Quality & Polish

**Status:** 🟡 PLANNING
**Goal:** Fix all MEDIUM severity issues and improve code quality

## 🎯 Objectives

1. **Error Handling** — Use NestJS built-in exceptions properly
2. **Data Privacy** — Prevent password hash leaks in barber queries
3. **Error Boundaries** — Add React error.tsx for graceful failures
4. **UI Completeness** — Fix all non-functional elements

## 📋 Requirements

| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| REQ-QUAL-01 | Admin error handling | ⏳ Pending | M1 - use NestJS exceptions |
| REQ-QUAL-02 | Admin input validation | ⏳ Pending | M2 - date filters, pagination |
| REQ-QUAL-03 | Double Zod validation | ⏳ Pending | M3 - single validation point |
| REQ-QUAL-04 | Barbers data leak | ⏳ Pending | M15 - exclude password hash |
| REQ-QUAL-05 | Error boundaries | ⏳ Pending | H14 - error.tsx files |
| REQ-QUAL-06 | Non-functional UI | ⏳ Pending | M13, M14 - cancel, hero CTA |
| REQ-QUAL-07 | Case sensitive voucher | ⏳ Pending | L4 - case-insensitive lookup |
| REQ-QUAL-08 | Provider wrapper | ⏳ Pending | M15 - implement or remove |

## 🔗 Dependencies

- PHASE-07: Security Hardening (must be complete)

## 📁 Structure

```
docs/development/PHASES/PHASE-08/
├── phase.md              # This file
├── phase-board.md        # Task board
├── SPECS/
│   └── SPEC-quality.md   # Quality specification
└── plans/
    └── 08a-PLAN.md       # Main quality plan
```

## 🚀 Quick Links

- [REVIEW.md](../../../../REVIEW.md) — Source of quality findings
- [ROADMAP.md](../../../../ROADMAP.md)
- [PHASE-07 Board](../PHASE-07/phase-board.md)

## 📊 Quality Metrics Target

- Zero data leaks (password hashes, internal errors)
- Zero non-functional UI elements
- Error boundaries on all routes
- Proper exception usage throughout