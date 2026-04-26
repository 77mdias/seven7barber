# PROPOSAL: Future Enhancements

**Created:** 2026-04-26
**Status:** Draft
**Author:** HELL Bypass Review

---

## 1. Overview

This document proposes future enhancements for the Seven7Barber platform beyond the current Phase 01-06 scope. These features are categorized by priority and complexity.

---

## 2. High Priority

### 2.1 Real OAuth Providers

**Problem:** Currently using mock authentication; production requires real OAuth integration.

**Proposal:**
- Integrate GitHub OAuth (create app at github.com/settings/applications)
- Integrate Google OAuth (create at console.cloud.google.com)
- Integrate Discord OAuth (create at discord.com/developers)
- Store credentials in environment variables
- Maintain mock fallback for development

**Impact:** MEDIUM | **Effort:** MEDIUM

---

### 2.2 Push Notifications

**Problem:** Users only receive email notifications; SMS/WhatsApp would improve engagement.

**Proposal:**
- Twilio integration for SMS reminders
- Optional WhatsApp notifications via Twilio
- Notification preferences in user profile
- Templates: reminder (24h before), confirmation, cancellation

**Impact:** HIGH | **Effort:** HIGH

---

### 2.3 Waiting List / Queue

**Problem:** Fully-booked slots have no waitlist mechanism.

**Proposal:**
- `WaitingList` model in database
- When slot is full, offer to join waitlist
- Cron job checks for cancellations
- Auto-book when slot opens (first-come-first-served)
- Notification to user when slot becomes available

**Impact:** MEDIUM | **Effort:** MEDIUM

---

## 3. Medium Priority

### 3.1 Loyalty Program

**Problem:** No reward mechanism for repeat customers.

**Proposal:**
- `LoyaltyPoints` model per user
- Earn points per booking (e.g., 10 points per R$10 spent)
- Redeem points for discounts or free services
- Tier system: Bronze, Silver, Gold (based on points)
- Display points balance on dashboard

**Impact:** MEDIUM | **Effort:** MEDIUM

---

### 3.2 Barber Profile Management

**Problem:** Limited barber customization beyond basic profile.

**Proposal:**
- Portfolio/gallery upload for barbers
- Specialty tags (e.g., "fade specialist", "beard expert")
- Available days/hours configuration per barber
- Earnings dashboard (mock or real)
- Barbers can view their own appointments

**Impact:** MEDIUM | **Effort:** LOW

---

### 3.3 Recurring Appointments

**Problem:** Clients with regular appointments must book each time manually.

**Proposal:**
- "Book every X weeks" option
- `RecurringAppointment` model linking to parent appointment
- Auto-generate next appointment 1 week before
- Client receives notification to confirm/cancel
- Calendar view of recurring schedule

**Impact:** MEDIUM | **Effort:** HIGH

---

## 4. Low Priority (Nice to Have)

### 4.1 Multi-Location Support

**Problem:** Currently only single barbershop location.

**Proposal:**
- `Location` model with address, hours, contact
- Assign services and barbers to locations
- Location selector on booking wizard
- Location-specific pricing (optional)

**Impact:** LOW | **Effort:** HIGH

---

### 4.2 Gift Cards

**Problem:** No way to purchase appointments as gifts.

**Proposal:**
- `GiftCard` model with balance
- Purchase flow with mock payment
- Email gift card code to recipient
- Redeem at booking time

**Impact:** LOW | **Effort:** MEDIUM

---

### 4.3 Analytics Dashboard (Real Data)

**Problem:** Admin dashboard currently shows mock metrics.

**Proposal:**
- Real-time appointment counts
- Revenue calculations from completed appointments
- Popular services ranking
- Barber performance metrics
- Peak hours analysis

**Impact:** LOW | **Effort:** MEDIUM

---

## 5. Technical Debt

### 5.1 Test Coverage

**Current:** ~60% coverage

**Goal:** 80%+ coverage for production

**Action Items:**
- Add E2E tests with Playwright
- Increase integration test coverage
- Add mutation testing

---

### 5.2 API Rate Limiting

**Current:** Not implemented

**Proposal:**
- Add `@nestjs/throttler` for rate limiting
- Public endpoints: 100 req/min
- Auth endpoints: 10 req/min
- Return 429 Too Many Requests

---

### 5.3 Caching Strategy

**Proposal:**
- Redis cache for availability calculations
- Cache service catalog (5 min TTL)
- Cache admin metrics (1 min TTL)

---

## 6. Backlog Prioritization

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Real OAuth | HIGH | MEDIUM | P0 |
| Push Notifications | HIGH | HIGH | P1 |
| Waiting List | MEDIUM | MEDIUM | P1 |
| Loyalty Program | MEDIUM | MEDIUM | P2 |
| Test Coverage | HIGH | MEDIUM | P2 |
| Rate Limiting | MEDIUM | LOW | P2 |
| Barber Profiles | MEDIUM | LOW | P3 |
| Gift Cards | LOW | MEDIUM | P3 |
| Recurring Appts | MEDIUM | HIGH | P3 |
| Real Analytics | LOW | MEDIUM | P4 |
| Multi-Location | LOW | HIGH | P4 |

---

## 7. References

- [PRD](../prd/PRD.md)
- [ROADMAP](./ROADMAP.md)
- [SPEC-phase-03-booking-system.md](../SPECS/SPEC-phase-03-booking-system.md)
