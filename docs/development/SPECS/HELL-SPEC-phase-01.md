# HELL Specification — PHASE-01: Foundation & Backend Core

**ID:** HELL-SPEC-01
**Phase:** PHASE-01
**Status:** ✅ Aprovada
**Data:** 2026-04-26

## 🎯 Requisitos Técnicos
- **Frontend:** Next.js 15 (Vinext), Tailwind CSS, Lucide Icons, Shadcn UI.
- **Backend:** NestJS, TypeScript, Bun Runtime.
- **Database:** PostgreSQL via Prisma ORM.
- **Orchestration:** Docker Compose (Services: web, api, db).
- **Communication:** Monorepo with Bun Workspaces & shared package for DTOs/Enums.

## 🏛️ Domain Model (Core Entities)
1. **User:** Entity representing identity (Admin, Barber, Client).
2. **Service:** Barbershop offerings (price, duration).
3. **Appointment:** Booking record connecting User, Barber, and Service.

## 🛠️ GRASP Assignment Map
- **Information Expert:** `PrismaService` handles data access. `AuthService` handles identity logic.
- **Creator:** `UserService` responsible for instantiating new User entities via Prisma.
- **Controller:** `AuthController` and `UserController` delegate requests to corresponding services.

## ✅ Gate Checklist
- [x] Monorepo structure working (Web + API + Shared).
- [x] Docker environment starts all 3 containers.
- [x] Database schema applied and consistent with PRD.
- [x] Shared package exported and imported by both stacks.
- [x] CI/CD pipeline (GitHub Actions) configured for lint/test.
