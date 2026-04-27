# PHASE-10: Future Enhancements — Task Board

**Phase:** 10
**Status:** 🔮 PROPOSTO
**Total Tasks:** 12 (2 per feature)
**Completed:** 0

---

## 📋 Tasks

### 🔐 Real OAuth (GitHub, Google, Discord)

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-01 | Configure real OAuth providers | HIGH | 🔮 Proposto | GitHub, Google, Discord apps |
| T-02 | Implement OAuth callback handlers | HIGH | 🔮 Proposto | Token exchange, user creation |

### 📱 Push Notifications (Twilio SMS/WhatsApp)

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-03 | Configure Twilio account + webhooks | MEDIUM | 🔮 Proposto | SMS + WhatsApp Business |
| T-04 | Implement notification service | MEDIUM | 🔮 Proposto | Template-based notifications |

### 🏆 Loyalty Program

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-05 | Design loyalty points system | MEDIUM | 🔮 Proposto | Points per booking, tiers |
| T-06 | Implement rewards redemption | MEDIUM | 🔮 Proposto | API + UI for rewards |

### ⏳ Waiting List

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-07 | Design queue logic | LOW | 🔮 Proposto | FIFO with notifications |
| T-08 | Implement waitlist API | LOW | 🔮 Proposto | Join/leave/cancel queue |

### 🔄 Recurring Appointments

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-09 | Design recurrence patterns | LOW | 🔮 Proposto | Weekly, bi-weekly, monthly |
| T-10 | Implement recurrence engine | LOW | 🔮 Proposto | Cron-based generation |

### 📍 Multi-Location

| # | Task | Priority | Status | Notes |
|---|------|----------|--------|-------|
| T-11 | Add location to schema | LOW | 🔮 Proposto | Branch model + relationships |
| T-12 | Implement location selector | LOW | 🔮 Proposto | UI + filtering by location |

---

## 🔗 Dependencies

- Depends on: PHASE-09 (Security Hardening II)

## 📁 Files to Modify

- `seven7barber-api/src/auth/` — OAuth providers
- `seven7barber-api/src/notifications/` — Twilio integration
- `seven7barber-api/src/loyalty/` — New module
- `seven7barber-api/src/waitlist/` — New module
- `seven7barber-api/src/appointments/` — Recurring logic
- `seven7barber-api/prisma/schema.prisma` — New models
- `seven7barber-web/src/` — UI updates per feature

## 🧪 Test Scenarios

1. OAuth login with GitHub → Creates/links user account
2. SMS notification sent → Delivered via Twilio
3. Loyalty points earned → Points added after appointment
4. Join waitlist → Added to queue, notified when slot opens
5. Create recurring appointment → Generates future bookings
6. Select location → Filters barbers/services by branch

---

## ✅ Completion Criteria

- [ ] Real OAuth operational (GitHub, Google, Discord)
- [ ] Push notifications via Twilio (SMS + WhatsApp)
- [ ] Loyalty points system with tier rewards
- [ ] Waiting list with queue notifications
- [ ] Recurring appointments (weekly/monthly)
- [ ] Multi-location support (branches)

---

## 📊 Progress

```
[░░░░░░░░░░░░░░░░░░░░] 0/12 tasks (0%)
```

---

*Last updated: 2026-04-27*
