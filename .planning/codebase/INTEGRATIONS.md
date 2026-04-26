# External Integrations

**Analysis Date:** 2026-04-26

## APIs & External Services

**Database:**
- PostgreSQL 15 (Alpine)
  - Provider: Self-hosted via Docker OR Supabase
  - Connection: `DATABASE_URL` environment variable
  - Client: Prisma 7.8.0 (`@prisma/client`)
  - Docker container: `seven7barber-db`

**File Storage:**
- Cloudinary
  - Environment variables: `CLOUDINARY_*` (cloud name, API key, etc.)
  - Used for: Image uploads, assets

**Email:**
- SMTP
  - Environment variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
  - Used for: Transactional emails (verification, notifications)

**Payments:**
- Abacate Pay
  - Environment variables: `ABACATE_PAY_*`
  - Used for: Payment processing

## Data Storage

**Databases:**
- PostgreSQL
  - Connection: `postgresql://seven7barber:password123@db:5432/seven7barber`
  - ORM: Prisma
  - Docker volume: `postgres_data`

**File Storage:**
- Cloudinary (configured via env vars)
  - Cloud name: `CLOUDINARY_CLOUD_NAME`
  - API key: `CLOUDINARY_API_KEY`
  - API secret: `CLOUDINARY_API_SECRET`

**Caching:**
- None detected

## Authentication & Identity

**Backend Auth:**
- Passport.js with JWT strategy
  - `@nestjs/passport` 11.0.5
  - `passport-jwt` 4.0.1
  - Environment: `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN`

**Frontend Auth:**
- NextAuth.js 4.24.14
  - Provider: Credentials-based (email/password)
  - Session strategy: JWT (implied)

## Monitoring & Observability

**Error Tracking:**
- None detected in dependencies

**Logs:**
- Console logging (standard NestJS Winston or built-in logger)
- No external logging service configured

## CI/CD & Deployment

**Hosting:**
- Docker containers (via docker-compose)
- Services: API on port 3000, Web on port 3001

**CI Pipeline:**
- GitHub Actions (`.github/` directory present)
- No external CI service configured

## Environment Configuration

**Required env vars (Backend - `seven7barber-api/.env`):**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration
- `CLOUDINARY_*` - Cloudinary credentials
- `ABACATE_PAY_*` - Payment provider credentials
- `SMTP_*` - Email credentials
- `FRONTEND_URL` - CORS origin for API

**Required env vars (Frontend - `seven7barber-web`):**
- `NEXT_PUBLIC_API_URL` - Backend API URL (set in docker-compose)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD` - Cloudinary cloud name

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Payment provider callbacks (Abacate Pay)
- Email webhooks (if using SMTP service)

---

*Integration audit: 2026-04-26*
