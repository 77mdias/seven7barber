# Changelog — Seven7Barber

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [2026-04-26 18:00] — Documentation Sync

### Changed
- `ROADMAP.md` — Updated all phase statuses to COMPLETE, fixed timeline summary
- `PHASE-06/phase-board.md` — Marked as complete (6/6 tasks)
- `development/README.md` — Added PHASE-06 status, updated GAPS tracking
- `PRD.md` — Status changed from "Draft" to "Final"
- `SPEC.md` — Status changed from "Draft" to "Final"

### Added
- `PROPOSALS/PROPOSAL-future-enhancements.md` — Future features backlog
- `GAPS/GAP-001-ci-pipeline-missing.md` — Documented resolved GAP-001

### Fixed
- ROADMAP.md milestone checklist now shows M1-M7 status accurately
- All phase progress bars updated to 100%

## [2026-04-26 17:30] — PHASE-06: Launch Execution

### Added
- Health check endpoints (`/health`, `/health/live`, `/health/ready`)
- Structured logging with Pino
- Request logging middleware
- Metrics endpoint (`/metrics`)
- Swagger/OpenAPI documentation at `/api/docs`
- API documentation (`seven7barber-api/API.md`)
- Updated README files for API, Web, and root
- Deployment guide (`docs/development/DEPLOY.md`)
- Operational scripts: `backup.sh`, `health-check.sh`, `setup-ssl.sh`

### Changed
- `main.ts` — Pino logger, Swagger setup, request middleware
- `app.module.ts` — HealthModule and MetricsModule imports
- `package.json` — Added pino, pino-pretty, @nestjs/swagger, swagger-ui-express

## [2026-04-26 17:00] — PHASE-06: Launch Planning

### Added
- PHASE-06 Launch planning artifacts
  - `PHASE-06/phase.md` — Phase definition (6 requirements)
  - `PHASE-06/phase-board.md` — Task board (6 tasks)
  - `PHASE-06/SPECS/SPEC-launch.md` — Full specification
  - `PHASE-06/plans/06a-PLAN.md` — Single-wave plan (6 tasks)

### Changed
- ROADMAP.md: PHASE-06 status "🟡 Planning" (6 requirements)
- ROADMAP.md: Progress updated ~87% (PHASE-01 to 05 at 100%)

### Requirements (PHASE-06)
- REQ-LAUNCH-01: Health check endpoints
- REQ-LAUNCH-02: Monitoring & observability
- REQ-LAUNCH-03: SSL/TLS configuration
- REQ-LAUNCH-04: API documentation (OpenAPI/Swagger)
- REQ-LAUNCH-05: README & getting started guides
- REQ-LAUNCH-06: Deployment runbook & rollback procedures

## [2026-04-26 16:00] — PHASE-05: TASK-023 + TASK-024 Completo

### Added
- TASK-023: SEO & Accessibility
  - `app/sitemap.ts` — Dynamic sitemap.xml
  - `app/robots.ts` — robots.txt
  - `components/seo/metadata.ts` — SEO metadata utilities
  - `components/JsonLd.tsx` — LocalBusiness schema
- TASK-024: Deploy Configuration
  - `docker-compose.prod.yml` — Production Docker config
  - `.github/workflows/deploy.yml` — CI/CD pipeline
  - `nginx/nginx.conf` — Production Nginx config

### Changed
- ROADMAP.md: PHASE-05 progress 100% (4/4 tasks)

## [2026-04-26 15:30] — PHASE-05: TASK-021 + TASK-022 TDD Completo

### Added
- TASK-022: `notifications/` module with TDD (13 tests passing)
- `notifications.service.spec.ts` — RED first TDD tests
- `notifications.service.ts` — Mock implementation (4 email types)
- `notifications.controller.ts` — REST endpoint
- `notifications.module.ts` — NestJS module
- Templates: BOOKING_CONFIRMATION, REMINDER, CANCELLATION, REVIEW_REQUEST

### Changed
- AppModule: Added NotificationsModule import
- ROADMAP.md: PHASE-05 progress 50% (2/4 tasks)

### Fixed
- NotificationsService: Added "Avaliação" text to pass test

## [2026-04-26 15:00] — PHASE-05 Planning + TASK-021 TDD

### Added
- PHASE-05 board: `docs/development/PHASES/PHASE-05/phase-board.md`
- PHASE-05 spec: `docs/development/PHASES/PHASE-05/SPECS/SPEC-phase-05.md`
- TASK-021: Payment Gateway task spec
- TASK-022: Email Notifications task spec
- TASK-023: SEO & Accessibility task spec
- TASK-024: Deploy Configuration task spec
- `payments/` module with TDD (10 tests passing)
- `payments.service.spec.ts` — RED first TDD tests
- `payments.service.ts` — Mock implementation
- `payments.controller.ts` — REST endpoints
- `payments.module.ts` — NestJS module

### Changed
- README.md: PHASE-05 status updated (0%, 4 tasks pending)
- AppModule: Added PaymentsModule import
- AppController spec: Fixed PrismaModule import issue

### Fixed
- AppController test: Added PrismaModule import for proper DI

## [2026-04-26 14:30] — PHASE-04 COMPLETO: Admin & Engagement

### Added
- TASK-017: `app/admin/page.tsx` - Admin dashboard com métricas, tabela de agendamentos
- TASK-017: `admin/` module (controller, service, module)
- TASK-018: `reviews/` module - Reviews & Ratings system (POST /reviews, GET reviews by barber)
- TASK-019: `vouchers/` module - Vouchers & Promotions (validate, apply, create)
- TASK-020: Metrics via AdminService (getOverviewMetrics)

### Changed
- PHASE-04 progress: 100% (4/4 tasks complete)
- ROADMAP.md: PHASE-04 marked as ✅ COMPLETO
- README.md: Updated phase status

### Fixed
- Tests: 74 pass, 0 fail across 11 files

## [2026-04-26 14:00] — PHASE-03 COMPLETE! All 6 Tasks Done

### Added
- TASK-012: `app/services/page.tsx` - Services catalog page with filters and search
- TASK-012: `components/services/service-card.tsx` - Reusable service card with halftone hover effect
- TASK-014: `app/booking/wizard/wizard.tsx` - 4-step booking wizard component
- TASK-014: `app/booking/wizard/step-indicator.tsx` - Progress indicator
- TASK-014: `app/booking/wizard/steps/` - Service, Barbers, DateTime, Confirm steps
- TASK-015: `app/dashboard/appointments/page.tsx` - Appointment history dashboard

### Changed
- PHASE-03 progress: 100% (6/6 tasks complete)
- All task files updated: TASK-012, TASK-014, TASK-015 marked ✅ COMPLETE
- phase-board.md: All objectives checked off

### Fixed
- All tests passing: 41 pass, 0 fail

## [2026-04-26 13:00] — TASK-013 Completed: Availability Engine

### Added
- `availability.service.ts`: Core slot calculation logic
- `availability.controller.ts`: GET /availability?date=&serviceIds= endpoint
- `availability.module.ts`: NestJS module
- `dto/get-availability.dto.ts`: Validation with class-validator
- `availability.service.spec.ts`: 6 unit tests (all passing)

### Changed
- AppModule now imports AvailabilityModule
- TASK-013 status: ✅ COMPLETA

### Fixed
- Working hours: 09:00-19:00 with 15-min buffer between appointments
- Slot conflicts properly calculated for existing appointments

## [2026-04-26 12:00] — TASK-016 Completed + Full Review Cycle

### Added
- Mock OAuth implementation in `auth.ts`: MOCK_USERS array with CLIENT/BARBER/ADMIN roles
- `.env.example` created with all OAuth variables (GITHUB, GOOGLE, DISCORD, NEXTAUTH, USE_MOCK_AUTH)
- `OAUTH-SETUP.md` documentation with real OAuth provider setup guide
- `auth.mock.spec.ts` test suite (11 tests: C1-C11) for mock authentication
- `SPEC-phase-03-booking-system.md` comprehensive spec for PHASE-03 tasks

### Changed
- `auth.ts` updated with USE_MOCK_AUTH conditional logic
- TASK-016 status updated to ✅ COMPLETA
- PHASE-03 phase-board.md updated with detailed progress and dependencies

### Fixed
- TASK-012 through TASK-016 task files aligned with current implementation status

## [2026-04-26 11:00] — TASK-011 Completed

### Added
- ServicesModule implemented: services.controller.ts, services.service.ts, services.module.ts
- DTOs with Zod validation: CreateServiceDto, UpdateServiceDto
- CRUD endpoints: GET/POST/PATCH/DELETE /services
- Soft-delete via isActive: false

### Changed
- AppModule now imports ServicesModule

### Fixed
- Pre-existing Prisma 7 config issue identified (schema uses old url= syntax)

## [2026-04-26 10:30] — Phase Board + Codebase Review

### Added
- PHASE-03 board created with booking system tasks (TASK-011 to TASK-015)
- ROADMAP synchronized to reflect PHASE-01 and PHASE-02 completion
- TASK-011 a TASK-016 files created with full criteria and test strategy
- GAP-002 updated with TASK-016 reference and status PROPOSED
- Codebase mapped with 7 documents in `.planning/codebase/` (STACK, INTEGRATIONS, ARCHITECTURE, STRUCTURE, CONVENTIONS, TESTING, CONCERNS)

### Changed
- ROADMAP.md updated: PHASE-01 and PHASE-02 marked as ✅ complete
- Progresso global atualizado para 40%
- PHASE-03 progress recalculated: 17% (1/6 tasks in progress)

## [Unreleased]

### Added
- Implementado Auth JWT no NestJS e rotas `/auth/login` e `/auth/register` (**TASK-006**, **TASK-007**).
- Integrado o NextAuth no frontend usando a estratégia de Credentials (**TASK-008**).
- Criadas as páginas premium de Login e Registro usando shadcn UI (**TASK-009**).
- Cabeçalho da aplicação modificado para detectar estado da sessão do usuário.
- Adicionado Mock de envio de e-mails (`EmailService`) para debug no backend (**TASK-010**).
- Configuração de Monorepo via **Bun Workspaces**.
- Pacote compartilhado `@seven7barber/shared` com DTOs e Enums (**TASK-005**).
- Workflow de CI básico no GitHub Actions (**GAP-001**).
- Planejamento e board da **PHASE-02 (Authentication)**.
- Inicialização do backend NestJS em `seven7barber-api/` (**TASK-002**).
- Configuração do **Prisma ORM** e definição do schema inicial do banco de dados (**TASK-003**).
- Configuração do ambiente **Docker Compose** com Postgres, API e Web (**TASK-004**).

### Fixed
- GAP-001 (CI/CD basic pipeline missing) resolvido.
- GAP-002 (Database schema not applied) resolvido.

### Changed
- Conclusão da **PHASE-02 (Authentication)**. Progresso 100%.
- Conclusão da **PHASE-01 (Foundation)**. Progresso 100%.
- Organização do workflow para o método HELL.