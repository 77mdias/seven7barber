# Tempest Seven7Barber - Product Roadmap

**Version:** 1.0
**Date:** 2026-04-24

---

## 1. Roadmap Overview

This roadmap outlines the development phases for Tempest Seven7Barber, a portfolio demonstration project. The goal is to deliver a complete, functional barbershop booking system showcasing full-stack capabilities.

---

## 2. Development Phases

### Phase 1: Foundation (Week 1-2)
**Goal:** Project scaffolding and core infrastructure

| Task | Deliverables | Status |
|------|--------------|--------|
| Monorepo setup | Web + API + shared structure | TODO |
| Design system | Razorcuts tokens in Tailwind | TODO |
| Database schema | Prisma models + migrations | TODO |
| Docker setup | Local dev environment | TODO |
| CI/CD pipeline | GitHub Actions | TODO |

**Milestone:** Complete project skeleton with running containers

---

### Phase 2: Authentication (Week 2-3)
**Goal:** User identity and access management

| Task | Deliverables | Status |
|------|--------------|--------|
| Registration | Email/password signup | TODO |
| Login | JWT-based authentication | TODO |
| Password reset | Forgot/reset flows | TODO |
| Email verification | Token-based verification | TODO |
| OAuth (optional) | GitHub/Google login | TODO |

**Milestone:** Users can register, login, and manage accounts

---

### Phase 3: Core Booking (Week 3-5)
**Goal:** Appointment scheduling system

| Task | Deliverables | Status |
|------|--------------|--------|
| Services catalog | Service listing page | TODO |
| Booking wizard | 3-step flow (service/barber/date) | TODO |
| Availability engine | Real-time slot calculation | TODO |
| Appointment API | CRUD + status transitions | TODO |
| User dashboard | Appointment history view | TODO |

**Milestone:** Full end-to-end booking experience works

---

### Phase 4: Reviews & Vouchers (Week 5-6)
**Goal:** Engagement features

| Task | Deliverables | Status |
|------|--------------|--------|
| Review system | Star rating + feedback | TODO |
| Voucher creation | Admin creates vouchers | TODO |
| Voucher redemption | Client applies codes | TODO |
| Promotions | Time-limited offers | TODO |

**Milestone:** Users can earn and redeem rewards

---

### Phase 5: Admin & Polish (Week 6-7)
**Goal:** Management capabilities and UI polish

| Task | Deliverables | Status |
|------|--------------|--------|
| Admin dashboard | Metrics display (mock) | TODO |
| Service management | CRUD for services | TODO |
| Promotion management | CRUD for promotions | TODO |
| Profile uploads | Cloudinary integration | TODO |
| Responsive design | Mobile optimization | TODO |

**Milestone:** Admin can manage the platform

---

### Phase 6: Integrations (Week 7-8)
**Goal:** External service connections

| Task | Deliverables | Status |
|------|--------------|--------|
| Payment mock | Abacate Pay sandbox | TODO |
| Email sending | SMTP transactional emails | TODO |
| Error handling | Global error boundaries | TODO |
| Loading states | Skeleton/spinners | TODO |
| SEO setup | Meta tags, sitemap | TODO |

**Milestone:** All external integrations functional

---

### Phase 7: Testing & Deploy (Week 8-9)
**Goal:** Quality assurance and production

| Task | Deliverables | Status |
|------|--------------|--------|
| Unit tests | Vitest for all services | TODO |
| Integration tests | API endpoint testing | TODO |
| Cloudflare deploy | Frontend live | TODO |
| Render deploy | Backend live | TODO |
| Documentation | README + inline docs | TODO |

**Milestone:** Project deployed and documented

---

## 3. Timeline Summary

```
Week 1-2:   Foundation ████████
Week 2-3:   Auth       ░░████████
Week 3-5:   Booking    ░░░░████████████
Week 5-6:   Reviews    ░░░░░░████████
Week 6-7:   Admin      ░░░░░░░░███████
Week 7-8:   Integrations ░░░░░░░░░██████
Week 8-9:   Testing   ░░░░░░░░░░░████████
```

---

## 4. Milestone Checklist

### M1: Foundation Complete
- [ ] Monorepo structure working
- [ ] Design tokens applied
- [ ] Database schema ready
- [ ] Docker Compose running
- [ ] CI pipeline passing

### M2: Auth Working
- [ ] Registration flow complete
- [ ] Login/logout functional
- [ ] JWT tokens working
- [ ] Password reset operational
- [ ] Email verification sent (mock)

### M3: Booking Live
- [ ] Services displayed
- [ ] Wizard completes full flow
- [ ] Appointment created in DB
- [ ] Confirmation shown
- [ ] Dashboard shows booking

### M4: Reviews & Rewards
- [ ] User can rate service
- [ ] Reviews display publicly
- [ ] Voucher codes validate
- [ ] Vouchers apply to booking
- [ ] Promotions visible

### M5: Admin Functional
- [ ] Dashboard shows metrics
- [ ] Services can be edited
- [ ] Promotions can be managed
- [ ] Photos upload to Cloudinary
- [ ] Mobile responsive

### M6: Integrations Complete
- [ ] Payment simulates (sandbox)
- [ ] Emails send (SMTP)
- [ ] Error messages user-friendly
- [ ] Loading states everywhere
- [ ] SEO tags in place

### M7: Production Ready
- [ ] All tests passing
- [ ] Cloudflare Pages deployed
- [ ] Render service running
- [ ] README complete
- [ ] Portfolio-ready state

---

## 5. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cloudflare Pages setup issues | Low | Medium | Use Vercel as fallback |
| Supabase rate limits (free tier) | Medium | Low | Mock data fallback |
| OAuth provider changes | Low | Low | Document API version used |
| Render cold starts | High | Low | Implement health checks |

---

## 6. Success Criteria

The project is complete when:

1. **Authentication:** Any user can register and login
2. **Booking:** Client completes booking in under 2 minutes
3. **Reviews:** Client leaves review after appointment
4. **Admin:** Dashboard displays mock metrics
5. **Deploy:** Frontend accessible at .cloudflarepages.com
6. **Tests:** Backend has >70% code coverage
7. **Docs:** README explains how to run locally