---
phase: 9
name: "Future Enhancements"
slug: "future-enhancements"
status: "planning"
goal: "Implement requested features beyond the core booking system."
description: "Implement proposed enhancements from PROPOSAL-future-enhancements.md including OAuth providers, push notifications, waiting list, and loyalty program."
depends_on: "08"
requirements:
  - "REQ-FUTURE-01: Real OAuth providers (GitHub, Google, Discord)"
  - "REQ-FUTURE-02: Push notifications (Twilio SMS/WhatsApp)"
  - "REQ-FUTURE-03: Waiting list / queue system"
  - "REQ-FUTURE-04: Loyalty program with points"
  - "REQ-FUTURE-05: Enhanced barber profiles with portfolios"
  - "REQ-FUTURE-06: Multiple service booking (bundles)"
created: "2026-04-26"
last_updated: "2026-04-26"
---

# PHASE-09: Future Enhancements

**Status:** 🟡 PLANNING
**Goal:** Implement requested features beyond core booking system

## 🎯 Objectives

1. **Real OAuth** — Replace mock auth with real GitHub, Google, Discord
2. **Push Notifications** — Twilio SMS/WhatsApp reminders
3. **Waiting List** — Queue system for full slots
4. **Loyalty Program** — Points, tiers, rewards

## 📋 Requirements

| ID | Requirement | Status | Priority |
|----|-------------|--------|----------|
| REQ-FUTURE-01 | Real OAuth providers | ⏳ Pending | HIGH |
| REQ-FUTURE-02 | Push notifications | ⏳ Pending | HIGH |
| REQ-FUTURE-03 | Waiting list / queue | ⏳ Pending | MEDIUM |
| REQ-FUTURE-04 | Loyalty program | ⏳ Pending | MEDIUM |
| REQ-FUTURE-05 | Barber profiles | ⏳ Pending | LOW |
| REQ-FUTURE-06 | Bundle bookings | ⏳ Pending | LOW |

## 🔗 Dependencies

- PHASE-08: Code Quality & Polish (must be complete)

## 📁 Structure

```
docs/development/PHASES/PHASE-09/
├── phase.md              # This file
├── phase-board.md        # Task board
├── SPECS/
│   └── SPEC-future.md    # Future enhancements spec
└── plans/
    └── 09a-PLAN.md       # Main future plan
```

## 🚀 Quick Links

- [PROPOSAL-future-enhancements.md](../../PROPOSALS/PROPOSAL-future-enhancements.md)
- [ROADMAP.md](../../../../ROADMAP.md)
- [PHASE-08 Board](../PHASE-08/phase-board.md)

## 💡 Feature Description

### Real OAuth
Replace mock authentication with real OAuth flows for GitHub, Google, and Discord. Store credentials in environment variables.

### Push Notifications
Integrate Twilio for SMS and WhatsApp notifications. Templates: reminder (24h before), confirmation, cancellation.

### Waiting List
When slot is full, offer to join waitlist. Cron job checks for cancellations and auto-books first in queue.

### Loyalty Program
`LoyaltyPoints` model per user. Earn 10 points per R$10 spent. Redeem for discounts or free services. Bronze/Silver/Gold tiers.