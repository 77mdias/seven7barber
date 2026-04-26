# Tempest Seven7Barber - Product Backlog

**Version:** 1.0
**Date:** 2026-04-24

---

## 1. Backlog Overview

This document contains all prioritized features, enhancements, and technical tasks for the Tempest Seven7Barber project.

---

## 2. Backlog Items by Priority

### Priority Scale
- **P0 (Critical):** Must have for MVP
- **P1 (High):** Important for demo
- **P2 (Medium):** Nice to have
- **P3 (Low):** Future consideration

---

## 3. MVP Features (P0)

| ID | Title | Description | Est. Size |
|----|-------|-------------|-----------|
| MVP-01 | Project Setup | Initialize monorepo with web + api + shared | 4h |
| MVP-02 | Design System | Integrate Razorcuts design tokens | 4h |
| MVP-03 | Database Schema | Prisma schema with all models | 4h |
| MVP-04 | Auth - Registration | User registration with email/password | 8h |
| MVP-05 | Auth - Login | User login with JWT tokens | 6h |
| MVP-06 | Auth - Password Reset | Forgot/reset password flows | 6h |
| MVP-07 | Services Catalog | List and display services | 4h |
| MVP-08 | Appointment Wizard | 3-step booking flow | 12h |
| MVP-09 | Appointment API | CRUD operations with availability | 8h |
| MVP-10 | User Dashboard | View appointments, history | 6h |
| MVP-11 | Review System | Create and display reviews | 6h |
| MVP-12 | Docker Setup | Docker Compose for local dev | 4h |

---

## 4. High Priority Features (P1)

| ID | Title | Description | Est. Size |
|----|-------|-------------|-----------|
| P1-01 | OAuth Login | GitHub, Google, Discord OAuth | 8h |
| P1-02 | Email Verification | Verify email on signup | 4h |
| P1-03 | Voucher System | Create, validate, redeem vouchers | 8h |
| P1-04 | Promotion System | Promotions with validity dates | 6h |
| P1-05 | Admin Dashboard | Metrics display (mock data) | 6h |
| P1-06 | Admin - Services | CRUD for services management | 4h |
| P1-07 | Admin - Promotions | CRUD for promotions management | 4h |
| P1-08 | Profile Management | Edit profile, upload photo | 6h |
| P1-09 | Payment Integration | Abacate Pay mock integration | 8h |
| P1-10 | Cloudinary Upload | Profile/review image upload | 6h |

---

## 5. Medium Priority (P2)

| ID | Title | Description | Est. Size |
|----|-------|-------------|-----------|
| P2-01 | Email Templates | Transactional email HTML templates | 4h |
| P2-02 | Email Sending | SMTP integration for emails | 4h |
| P2-03 | Barber Profiles | Extended barber info, rating | 6h |
| P2-04 | Availability Management | Barber schedule management | 8h |
| P2-05 | Appointment Reminders | Email reminders for appointments | 4h |
| P2-06 | Admin - Barbers | Manage barber accounts | 4h |
| P2-07 | Search & Filter | Search services, barbers | 4h |
| P2-08 | Responsive Design | Mobile-first responsive UI | 8h |
| P2-09 | Error Handling | Global error boundaries, toasts | 4h |
| P2-10 | Loading States | Skeleton loaders, spinners | 4h |

---

## 6. Low Priority / Future (P3)

| ID | Title | Description | Est. Size |
|----|-------|-------------|-----------|
| P3-01 | Analytics Dashboard | Real analytics charts | 8h |
| P3-02 | SMS Notifications | Twilio SMS integration | 6h |
| P3-03 | PWA Support | Progressive web app features | 12h |
| P3-04 | Multi-language | i18n support (PT/EN) | 16h |
| P3-05 | Dark Mode | Theme toggle | 4h |
| P3-06 | Export Data | CSV/PDF export for admin | 6h |
| P3-07 | Waitlist | Appointment waitlist feature | 8h |
| P3-08 | Recurring Appointments | Repeat booking feature | 8h |

---

## 7. Technical Tasks

| ID | Title | Description | Est. Size |
|----|-------|-------------|-----------|
| TECH-01 | CI/CD Setup | GitHub Actions for testing/deploy | 4h |
| TECH-02 | Test Suite | Unit + integration tests (Vitest) | 16h |
| TECH-03 | Documentation | README, API docs, inline comments | 8h |
| TECH-04 | Environment Config | Development/staging/prod configs | 4h |
| TECH-05 | Error Monitoring | Sentry or similar integration | 4h |
| TECH-06 | Performance | Lighthouse optimization | 8h |
| TECH-07 | Security Audit | Review auth, input validation | 4h |
| TECH-08 | SEO Setup | Meta tags, sitemap, robots.txt | 4h |

---

## 8. Backlog Summary

| Priority | Count | Estimated Hours |
|----------|-------|-----------------|
| MVP (P0) | 12 items | ~80h |
| High (P1) | 10 items | ~70h |
| Medium (P2) | 10 items | ~60h |
| Low (P3) | 8 items | ~64h |
| Technical | 8 items | ~48h |
| **Total** | **48 items** | **~322h** |

---

## 9. Sprint Planning Template

When starting development, break down into 2-week sprints:

**Sprint 1:** MVP core setup + auth
**Sprint 2:** Services + booking flow
**Sprint 3:** Reviews + profile
**Sprint 4:** Admin + payments
**Sprint 5:** Polish + testing
**Sprint 6:** Deploy + documentation

---

## 10. Dependencies

- MVP-01 (Project Setup) must complete before all others
- MVP-04 (Registration) requires MVP-01
- MVP-08 (Wizard) requires MVP-07 (Services)
- P1-01 (OAuth) requires MVP-05 (Login)
- TECH-02 (Tests) requires MVP completion