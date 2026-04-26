---
phase: 6
title: "Launch Specification"
version: "1.0.0"
status: "ready"
created: "2026-04-26"
last_updated: "2026-04-26"
---

# SPEC: PHASE-06 — Launch

**Phase:** 06 — Launch
**Status:** ✅ Ready for Planning
**Goal:** Production deployment, monitoring setup, and documentation finalization

---

## 1. Overview

PHASE-06 is the final phase to make the Seven7Barber platform publicly accessible. It includes health check endpoints, monitoring/observability, SSL/TLS configuration, API documentation, README files, and deployment runbooks.

---

## 2. Context

### Previous Phases

- **PHASE-05 (Integrations & Polish):** Payment gateway, email notifications, SEO/accessibility, deploy configuration — all completed ✅
- All prior phases (01-05) are at 100% completion

### Current State

- Docker Compose production config exists
- Nginx config exists (port 80, no SSL yet)
- GitHub Actions CI/CD exists (test + build)
- API has no health check endpoints
- API has no OpenAPI/Swagger documentation
- No monitoring/logging infrastructure
- No deployment runbook or rollback documentation

---

## 3. Goals

1. **Health Check Endpoints** — Production-ready `/health` endpoints for API and Web
2. **Monitoring & Observability** — Structured logging (Pino), request logging middleware, metrics endpoint
3. **SSL/TLS Configuration** — HTTPS support with TLS 1.2/1.3, Let's Encrypt setup script
4. **API Documentation** — Swagger/OpenAPI at `/api/docs` with full endpoint documentation
5. **README & Getting Started** — Comprehensive documentation for API, Web, and root
6. **Deployment Runbook** — Complete DEPLOY.md with rollback procedures and operational scripts

---

## 4. Requirements

### REQ-LAUNCH-01: Production Health Check Endpoints

| Aspect | Detail |
|--------|--------|
| Endpoint | `GET /health` — returns `{status: "ok", timestamp, uptime}` |
| Liveness | `GET /health/live` — returns `{status: "alive"}` |
| Readiness | `GET /health/ready` — returns `{status: "ready"}` |
| Web Health | `GET /health` in Next.js route handler |
| Docker Health | Healthcheck configured in docker-compose.prod.yml |
| Non-blocking | Must not affect normal request flow |

### REQ-LAUNCH-02: Monitoring & Observability Setup

| Aspect | Detail |
|--------|--------|
| Logging | Pino-based structured logging |
| Log Levels | Configurable via LOG_LEVEL env var |
| Request Logging | Middleware capturing method, URL, status, duration, IP |
| Metrics Endpoint | `GET /metrics` — requests, uptime, memory, CPU |
| Production Format | JSON logs (pino transport) |
| Development Format | Pretty-printed logs (pino-pretty) |

### REQ-LAUNCH-03: SSL/TLS Configuration

| Aspect | Detail |
|--------|--------|
| Protocols | TLSv1.2 and TLSv1.3 only |
| Ciphers | HIGH strength, no aNULL, no MD5 |
| Certificate Path | `/etc/ssl/certs/` mounted from host |
| DH Parameters | Strong DH params for forward secrecy |
| Security Headers | X-Frame-Options, X-Content-Type-Options, X-XSS-Protection |
| Setup Script | `scripts/setup-ssl.sh` for Let's Encrypt |

### REQ-LAUNCH-04: API Documentation (OpenAPI/Swagger)

| Aspect | Detail |
|--------|--------|
| Swagger UI | Available at `/api/docs` |
| OpenAPI Spec | Available at `/api/docs.json` |
| Title | "Seven7Barber API" |
| Version | "1.0" |
| Tags | health, auth, appointments, services, barbers |
| Controller Decorators | All public endpoints have @ApiTags and @ApiOperation |

### REQ-LAUNCH-05: README and Getting Started Guide

| Document | Content |
|----------|---------|
| API README | Tech stack, installation, development, production, Docker, environment variables |
| Web README | Tech stack, installation, development, Docker, environment variables |
| Root README | Project overview, quick start, architecture, links to full docs |

### REQ-LAUNCH-06: Deployment Runbook and Rollback Procedures

| Aspect | Detail |
|--------|--------|
| DEPLOY.md | Complete production deployment guide |
| Rollback | Step-by-step rollback procedures (quick and full) |
| Health Checks | How to verify deployment health |
| SSL Renewal | Let's Encrypt renewal process |
| Troubleshooting | Common issues and solutions |
| Backup Script | `scripts/backup.sh` — database backup with retention |
| Health Check Script | `scripts/health-check.sh` — monitoring health checks |

---

## 5. File Structure

```
seven7barber-api/src/
├── health/
│   ├── health.controller.ts
│   └── health.module.ts
├── metrics/
│   ├── metrics.controller.ts
│   └── metrics.module.ts
└── common/
    ├── logger.service.ts
    └── request-logger.middleware.ts

nginx/
└── nginx.conf (update with SSL)

scripts/
├── setup-ssl.sh
├── backup.sh
└── health-check.sh

docs/development/
├── DEPLOY.md
└── PHASES/PHASE-06/
    ├── phase.md
    ├── phase-board.md
    └── plans/06a-PLAN.md

seven7barber-api/README.md (update)
seven7barber-web/README.md (update)
README.md (update/verify)
.env.example (update with SSL vars)
```

---

## 6. Dependencies

- PHASE-05 completion (TASK-024 deploy config) — ✅ COMPLETE
- Docker, Docker Compose — environment
- Bun, Node.js — development
- PostgreSQL — database

---

## 7. Non-Goals

- Actual production server setup (infrastructure managed externally)
- Real SSL certificates (script provided, certs managed externally)
- Database provisioning (Supabase provides this)
- CI/CD secrets configuration (GitHub Actions already set up)

---

## 8. Acceptance Criteria

1. `curl /health` returns JSON with status, timestamp, uptime
2. `curl /health/live` returns liveness probe response
3. `curl /health/ready` returns readiness probe response
4. `curl /api/docs` returns Swagger UI HTML
5. `curl /api/docs.json` returns valid OpenAPI spec
6. API logs in structured JSON format in production
7. Request logging captures all HTTP requests with timing
8. `/metrics` endpoint returns system metrics
9. nginx.conf has TLS 1.2/1.3 configured with strong ciphers
10. All README files have working code blocks
11. DEPLOY.md contains complete deployment and rollback procedures
12. All scripts (setup-ssl.sh, backup.sh, health-check.sh) are executable

---

## 9. Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Pino for logging | Fast, structured, NestJS-compatible |
| /api/docs for Swagger | Standard path, well-known by developers |
| Shell scripts for SSL/backup | Simple, portable, works in CI/CD |
| Health scripts executable | Can be called from monitoring/alerting |

---

## 10. References

- [NestJS Health Check](https://docs.nestjs.com/recipes/terminus)
- [Pino Logger](https://github.com/pinojs/pino)
- [Swagger/OpenAPI](https://docs.nestjs.com/openapi/introduction)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker Health Check](https://docs.docker.com/compose/compose-file/#healthcheck)

---

*Specification: PHASE-06 Launch*
*Created: 2026-04-26*
*Status: Ready for Execution*