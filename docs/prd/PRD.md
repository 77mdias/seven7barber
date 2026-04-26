# Tempest Seven7Barber - Product Requirements Document (PRD)

**Version:** 1.0
**Date:** 2026-04-24
**Status:** ✅ Final (Phases 01-06 Complete)
**Type:** Portfolio Demo Project

---

## 1. Overview

### Project Name
**Tempest Seven7Barber**

### Project Type
Full-stack barbershop appointment booking system for portfolio demonstration.

### Core Functionality
A complete barbershop management platform enabling clients to book appointments with barbers, manage services, redeem vouchers/promotions, and leave reviews. Includes admin dashboard for business management.

### Target Users
- **Clients:** End users who book appointments and manage their profiles
- **Barbers:** Service providers who manage their schedules and appointments
- **Admins:** Business owners who manage services, promotions, barbers, and view analytics

### Target Audience for Portfolio
Recruiters, hiring managers, and technical reviewers evaluating full-stack development capabilities.

---

## 2. Architecture

### System Structure
```
seven7barber-web/     → Vinext (Next.js 15) - Frontend
seven7barber-api/     → NestJS - Backend REST API
```

### Tech Stack

| Layer | Technology | Deployment |
|-------|------------|------------|
| Frontend | Vinext (Next.js 15, App Router, React 19, TypeScript) | Cloudflare Pages |
| Backend | NestJS (TypeScript) | Render (free tier) |
| Database | PostgreSQL (Supabase) | Supabase Cloud |
| Package Manager | Bun | - |
| Testing | Vitest + Supertest | CI/CD |
| File Storage | Cloudinary | Cloud |
| Payment Gateway | Abacate Pay | Mock/Sandbox |
| Email | SMTP (custom domain) | - |
| Docker | Docker Compose | Local only |

### Design System
Reference: Razorcuts Design System (HTML)
- **Primary Colors:** #732F3B (wine/rose), #401021 (dark variant)
- **Neutral Colors:** #111111 (black), #272727 (dark gray), #bababa (muted), #ffffff (white)
- **Typography:** Oswald (headings H1-H2), Poppins (body text)
- **Components:** Buttons, Cards, Counters, Image Boxes, Forms

---

## 3. Functionality Specification

### 3.1 Authentication System

**Features:**
- Email/password registration and login
- OAuth integration (GitHub, Google, Discord)
- Email verification tokens
- Forgot password / reset password flows
- JWT-based sessions
- Role-based access: CLIENT, BARBER, ADMIN

**Implementation:**
- NextAuth.js v4 on frontend
- JWT strategy with access/refresh tokens
- Prisma adapter for database integration

### 3.2 Appointment Booking System

**Features:**
- Wizard-based booking flow (3 steps):
  1. Service selection
  2. Barber selection
  3. Date/time slot selection
- Real-time availability checking
- Appointment status tracking:
  - SCHEDULED → CONFIRMED → COMPLETED
  - SCHEDULED → CANCELLED
  - SCHEDULED → NO_SHOW
- Appointment history for clients
- Barber schedule management

**Implementation:**
- Server Actions for mutations
- Service layer pattern with transactions
- Real-time slot generation algorithm

### 3.3 Services Management

**Features:**
- Service catalog with name, description, duration (minutes), price
- Service categories
- Services assigned to barbers
- Admin CRUD operations

### 3.4 Voucher & Promotion System

**Features:**
- Voucher types:
  - FREE_SERVICE
  - DISCOUNT_PERCENTAGE
  - DISCOUNT_FIXED
  - CASHBACK
- Code-based redemption
- Minimum services requirements
- Expiration dates
- Global and user-specific promotions

### 3.5 Reviews & Ratings

**Features:**
- Post-appointment review creation
- 1-5 star rating system
- Text feedback with optional images
- Service history logging
- Review moderation (admin)

### 3.6 Admin Dashboard

**Features:**
- Metrics display (mock data for demo):
  - Total appointments
  - Revenue (mock)
  - Active barbers
  - Pending reviews
- Service management
- Promotion management
- Barber management
- Analytics overview

### 3.7 User Profile Management

**Features:**
- Profile editing (name, email, phone)
- Profile photo upload (Cloudinary)
- Password change
- Notification preferences

### 3.8 Payment Integration (Mock)

**Features:**
- Abacate Pay integration in sandbox mode
- Payment simulation for testing
- Transaction history (mock)
- No real money processing

### 3.9 Email System

**Features:**
- Transactional emails:
  - Booking confirmation
  - Appointment reminder
  - Password reset
  - Email verification
- SMTP configuration via custom domain

---

## 4. Database Schema Overview

### Core Models
- **User** - id, email, name, role, image, password, verified, createdAt
- **Appointment** - id, clientId, barberId, serviceId, dateTime, status, notes
- **Service** - id, name, description, duration, price, isActive
- **ServiceHistory** - id, appointmentId, userId, rating, feedback, images
- **Voucher** - id, code, type, value, minServices, expiresAt, isActive
- **Promotion** - id, title, description, type, value, startDate, endDate, isActive
- **UserPromotion** - id, userId, promotionId, usedAt

### Models Excluded (from original project)
- Conversation / Message (chat)
- Friendship / FriendRequest (social)

---

## 5. API Endpoints Overview

### Auth Routes
- POST /auth/register
- POST /auth/login
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/verify-email
- GET /auth/me

### Appointment Routes
- GET /appointments (list, filter by user/date)
- POST /appointments (create)
- GET /appointments/:id
- PATCH /appointments/:id (update status)
- DELETE /appointments/:id
- GET /appointments/availability (available slots)

### Service Routes
- GET /services (public list)
- POST /services (admin)
- PATCH /services/:id (admin)
- DELETE /services/:id (admin)

### Review Routes
- GET /reviews (public)
- POST /reviews (client)
- PATCH /reviews/:id
- DELETE /reviews/:id

### Voucher Routes
- POST /vouchers/validate
- POST /vouchers/redeem
- GET /vouchers (admin)

### Admin Routes
- GET /admin/metrics
- GET /admin/barbers
- GET /admin/users

---

## 6. User Flows

### Client Booking Flow
1. User visits landing page
2. Clicks "Book Now" or navigates to /scheduling
3. Step 1: Selects service from catalog
4. Step 2: Selects preferred barber (or "any available")
5. Step 3: Selects date from calendar, then available time slot
6. Confirms booking details
7. (Optional) Applies voucher code
8. (Optional) Proceeds to payment simulation
9. Receives confirmation email
10. Redirected to dashboard with booking details

### Admin Management Flow
1. Admin logs in
2. Views dashboard with metrics
3. Can manage services, promotions, barbers
4. Can view and moderate reviews

---

## 7. Out of Scope (Mocked/Simulated)

- Real payment processing (Abacate Pay in sandbox/demo mode)
- Production email delivery (SMTP in demo mode)
- Actual Cloudinary uploads (mock URLs in demo mode)
- Live Supabase database (demo dataset)
- Social features (chat, friendships)

---

## 8. Acceptance Criteria

1. **Authentication:** Users can register, login, logout, reset passwords
2. **Booking Flow:** Client can complete full appointment booking wizard
3. **Services:** Services are displayed and selectable
4. **Reviews:** Client can leave reviews for completed appointments
5. **Vouchers:** Client can apply and redeem voucher codes
6. **Admin:** Dashboard displays metrics and allows service/promotion management
7. **UI/UX:** Design follows Razorcuts design system tokens
8. **Tests:** Backend has unit and integration tests with Vitest
9. **Docker:** Project runs locally via Docker Compose
10. **Deploy:** Frontend deploys to Cloudflare Pages, backend to Render

---

## 9. Project Structure

```
STARTUP-SEVEN7BARBER/
├── docs/
│   ├── prd/           # This document
│   ├── specs/         # Technical specifications
│   ├── wireframes/    # UI mockups
│   ├── product/       # Product backlog, roadmap
│   ├── user-stories/  # User stories
│   └── roadmap/       # Project roadmap
├── README.md          # Project overview
└── DESIGN.md          # Design system reference
```