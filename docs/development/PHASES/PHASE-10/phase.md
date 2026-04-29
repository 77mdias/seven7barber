---
phase: 10
name: "Future Enhancements"
slug: "future-enhancements"
status: "planned"
goal: "Implement additional production features post-launch to enhance user experience and business capabilities."
description: "Phase 10 covers six future enhancement features: Real OAuth providers, Push notifications, Loyalty program, Waiting list, Recurring appointments, and Multi-location support. These are marked as PROPOSTO in the roadmap and represent next-generation capabilities."
depends_on: "09"
requirements:
  - "REQ-FEAT-01: Real OAuth providers (GitHub, Google, Discord) - Replace mock OAuth with real OAuth2 flows"
  - "REQ-FEAT-02: Push notifications (Twilio SMS/WhatsApp) - Real notification delivery system"
  - "REQ-FEAT-03: Loyalty program - Points, rewards tiers, and user engagement system"
  - "REQ-FEAT-04: Waiting list - Queue management for fully-booked slots"
  - "REQ-FEAT-05: Recurring appointments - Weekly/monthly booking patterns"
  - "REQ-FEAT-06: Multi-location - Support for multiple barbershop branches"
created: "2026-04-27"
last_updated: "2026-04-27"
---

# PHASE-10: Future Enhancements

**Status:** 🔮 PROPOSTO
**Goal:** Implement additional production features post-launch

## 🎯 Objectives

1. **Real OAuth** — Replace mock OAuth with real OAuth2 providers (GitHub, Google, Discord)
2. **Push Notifications** — Implement Twilio SMS/WhatsApp notification delivery
3. **Loyalty Program** — Build points, rewards tiers, and engagement system
4. **Waiting List** — Queue management for fully-booked slots
5. **Recurring Appointments** — Weekly/monthly booking patterns
6. **Multi-Location** — Support multiple barbershop branches

## 📋 Requirements

| ID | Requirement | Status | Priority |
|----|-------------|--------|----------|
| REQ-FEAT-01 | Real OAuth providers | 🔮 Proposto | HIGH |
| REQ-FEAT-02 | Push notifications | 🔮 Proposto | MEDIUM |
| REQ-FEAT-03 | Loyalty program | 🔮 Proposto | MEDIUM |
| REQ-FEAT-04 | Waiting list | 🔮 Proposto | LOW |
| REQ-FEAT-05 | Recurring appointments | 🔮 Proposto | LOW |
| REQ-FEAT-06 | Multi-location | 🔮 Proposto | LOW |

## 🔗 Dependencies

- PHASE-09: Security Hardening II (must be complete)

## 📁 Structure

```
docs/development/PHASES/PHASE-10/
├── phase.md              # This file
├── phase-board.md        # Task board
├── SPECS/
│   └── SPEC-future-enhancements.md # Enhancement specs
└── plans/
    └── 10a-PLAN.md      # Main plan
```

## 🚀 Quick Links

- [ROADMAP.md](../../../ROADMAP.md)
- [PHASE-09 Board](../PHASE-09/phase-board.md)

## 📝 Notes

- Phase 10 represents post-launch enhancements
- All features are currently 🔮 PROPOSTO (proposed)
- OAuth encryption (REQ-HARD-05 from PHASE-09) will be resolved here
- GAP-002 (OAuth providers keys) will be fully resolved with Real OAuth
