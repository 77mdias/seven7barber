---
phase: 6
plan: "06a"
type: "execute"
wave: 1
depends_on: ""
autonomous: true
files_modified:
  - "seven7barber-api/src/main.ts"
  - "seven7barber-api/src/app.controller.ts"
  - "seven7barber-api/src/health/"
  - "docker-compose.prod.yml"
  - "nginx/nginx.conf"
  - ".github/workflows/deploy.yml"
  - "docs/development/PHASES/PHASE-06/"
  - "seven7barber-api/README.md"
  - "seven7barber-web/README.md"
requirements_addressed:
  - "REQ-LAUNCH-01"
  - "REQ-LAUNCH-02"
  - "REQ-LAUNCH-03"
  - "REQ-LAUNCH-04"
  - "REQ-LAUNCH-05"
  - "REQ-LAUNCH-06"
---

<objective>

## 🎯 PLANNING COMPLETE — PHASE-06: Launch

**6 requirements → 6 tasks in 1 wave**

| Plan | Wave | Requirements |
|------|------|--------------|
| 06a | 1 | REQ-LAUNCH-01 through REQ-LAUNCH-06 |

</objective>

## PHASE-06 LAUNCH: Production Deployment Plan

This plan covers all launch requirements for the Seven7Barber platform:

1. **Health Check Endpoints** — API `/health` and Web health status
2. **Monitoring & Observability** — Structured logging, request logging middleware, error tracking
3. **SSL/TLS Configuration** — HTTPS setup with nginx, security headers
4. **API Documentation** — OpenAPI/Swagger spec generation
5. **README & Getting Started** — Comprehensive project documentation
6. **Deployment Runbook** — Rollback procedures and operational guide

---

## 📋 PHASE-06: Launch — Requirements Coverage

| ID | Requirement | Plan | Task |
|----|-------------|------|------|
| REQ-LAUNCH-01 | Production health check endpoints | 06a | Task 1.1 |
| REQ-LAUNCH-02 | Monitoring and observability setup | 06a | Task 1.2 |
| REQ-LAUNCH-03 | SSL/TLS configuration for HTTPS | 06a | Task 1.3 |
| REQ-LAUNCH-04 | API documentation (OpenAPI/Swagger) | 06a | Task 1.4 |
| REQ-LAUNCH-05 | README and getting started guide | 06a | Task 1.5 |
| REQ-LAUNCH-06 | Deployment runbook and rollback procedures | 06a | Task 1.6 |

---

## 🚀 WAVE 1: Launch Infrastructure

### Task 1.1 — Health Check Endpoints

<read_first>
- seven7barber-api/src/main.ts
- seven7barber-api/src/app.module.ts
- seven7barber-api/src/app.controller.ts
- docker-compose.prod.yml
</read_first>

<action>

**Add health check endpoint to API:**

1. Create `seven7barber-api/src/health/health.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('live')
  liveness() {
    return { status: 'alive' };
  }

  @Get('ready')
  readiness() {
    // Could add DB connection check here
    return { status: 'ready' };
  }
}
```

2. Create `seven7barber-api/src/health/health.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
```

3. Update `seven7barber-api/src/app.module.ts` to import `HealthModule`

4. Update `docker-compose.prod.yml` to use correct healthcheck path:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
```

**Add health check to Web:**

5. Create or update `seven7barber-web/src/app/health/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}
```

</action>

<acceptance_criteria>

- [ ] `curl http://localhost:3000/health` returns `{"status":"ok",...}`
- [ ] `curl http://localhost:3000/health/live` returns `{"status":"alive"}`
- [ ] `curl http://localhost:3000/health/ready` returns `{"status":"ready"}`
- [ ] `docker-compose.prod.yml` has healthcheck for api service
- [ ] Web `/health` route returns JSON with status ok

</acceptance_criteria>

---

### Task 1.2 — Monitoring & Observability

<read_first>
- seven7barber-api/src/main.ts
- seven7barber-api/src/app.module.ts
- seven7barber-api/package.json
</read_first>

<action>

**Add structured logging and request logging:**

1. Install logging package:
```bash
cd seven7barber-api && bun add pino pino-pretty
```

2. Create `seven7barber-api/src/common/logger.service.ts`:
```typescript
import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class LoggerServiceImpl implements LoggerService {
  private logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV !== 'production' 
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  });

  log(message: string, context?: string) {
    this.logger.info({ context }, message);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message);
  }

  warn(message: string, context?: string) {
    this.logger.warn({ context }, message);
  }

  debug(message: string, context?: string) {
    this.logger.debug({ context }, message);
  }
}
```

3. Create request logging middleware `seven7barber-api/src/common/request-logger.middleware.ts`:
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerServiceImpl } from './logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new LoggerServiceImpl();

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`,
        'RequestLogger'
      );
    });

    next();
  }
}
```

4. Update `seven7barber-api/src/main.ts` to use custom logger:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerServiceImpl } from './common/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerServiceImpl(),
  });

  // Request logging in production
  if (process.env.NODE_ENV === 'production') {
    const requestLogger = await import('./common/request-logger.middleware');
    app.use(requestLogger.RequestLoggerMiddleware);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

5. Add LOG_LEVEL to `docker-compose.prod.yml` environment section

**Add basic metrics endpoint:**

6. Create `seven7barber-api/src/metrics/metrics.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('metrics')
export class MetricsController {
  private requestCount = 0;
  private startTime = Date.now();

  @Get()
  getMetrics() {
    return {
      requests: this.requestCount,
      uptime_seconds: Math.floor((Date.now() - this.startTime) / 1000),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    };
  }
}
```

7. Create `seven7barber-api/src/metrics/metrics.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';

@Module({
  controllers: [MetricsController],
})
export class MetricsModule {}
```

8. Import `MetricsModule` in `AppModule`

</action>

<acceptance_criteria>

- [ ] `bun add pino pino-pretty` succeeds in seven7barber-api
- [ ] `src/common/logger.service.ts` exists with Pino-based implementation
- [ ] `src/common/request-logger.middleware.ts` logs all HTTP requests
- [ ] `src/metrics/metrics.controller.ts` exists with `/metrics` endpoint
- [ ] API logs structured JSON in production (pino transport)
- [ ] API logs HTTP requests with method, URL, status, duration in development

</acceptance_criteria>

---

### Task 1.3 — SSL/TLS Configuration

<read_first>
- nginx/nginx.conf
- docker-compose.prod.yml
- .env.example
</read_first>

<action>

**Update nginx config for SSL termination:**

1. Update `nginx/nginx.conf`:
```nginx
# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# SSL Certificate paths (mounted from docker-compose)
ssl_certificate /etc/ssl/certs/fullchain.pem;
ssl_certificate_key /etc/ssl/certs/privkey.pem;

# HSTS Header (optional, uncomment for strict HTTPS)
# add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# OCSP Stapling (if using Let's Encrypt)
# ssl_stapling on;
# ssl_stapling_verify on;
# resolver 8.8.8.8 8.8.4.4 valid=300s;
# resolver_timeout 5s;
```

2. Create SSL certificate location documentation in `.env.example`:
```
# SSL Certificates (mounted to nginx container)
# Path: ./nginx/ssl/fullchain.pem
# Path: ./nginx/ssl/privkey.pem
# Generate with: certbot --nginx -d seven7barber.com -d www.seven7barber.com
```

3. Create `scripts/setup-ssl.sh` for Let's Encrypt setup:
```bash
#!/bin/bash
# Let's Encrypt SSL Setup Script
set -e

DOMAIN=${DOMAIN:-seven7barber.com}
EMAIL=${EMAIL:-admin@seven7barber.com}

echo "Setting up SSL for $DOMAIN..."

# Stop nginx temporarily for certbot
docker compose -f docker-compose.prod.yml down nginx

# Get certificate
certbot certonly --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email --keep-until-expiring

# Create ssl directory
mkdir -p nginx/ssl

# Copy certificates
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/

# Restart services
docker compose -f docker-compose.prod.yml up -d

echo "SSL setup complete!"
```

4. Make script executable:
```bash
chmod +x scripts/setup-ssl.sh
```

5. Add certificate renewal cron entry to documentation

</action>

<acceptance_criteria>

- [ ] `nginx/nginx.conf` has ssl_protocols TLSv1.2 TLSv1.3 configured
- [ ] `nginx/nginx.conf` has ssl_certificate and ssl_certificate_key directives pointing to mounted paths
- [ ] `scripts/setup-ssl.sh` exists and is executable
- [ ] `.env.example` documents SSL certificate paths
- [ ] nginx config uses port 443 with ssl http2

</acceptance_criteria>

---

### Task 1.4 — API Documentation (OpenAPI/Swagger)

<read_first>
- seven7barber-api/src/app.module.ts
- seven7barber-api/package.json
</read_first>

<action>

**Add Swagger/OpenAPI documentation:**

1. Install Swagger packages:
```bash
cd seven7barber-api && bun add @nestjs/swagger swagger-ui-express
```

2. Update `seven7barber-api/src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerServiceImpl } from './common/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerServiceImpl(),
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Seven7Barber API')
    .setDescription('Barbershop appointment booking platform API')
    .setVersion('1.0')
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Authentication endpoints')
    .addTag('appointments', 'Booking management')
    .addTag('services', 'Barbershop services')
    .addTag('barbers', 'Barber management')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  if (process.env.NODE_ENV === 'production') {
    const requestLogger = await import('./common/request-logger.middleware');
    app.use(requestLogger.RequestLoggerMiddleware);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

3. Add API documentation decorator to controllers:

4. Update `seven7barber-api/src/app.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHello(): string {
    return this.appService.getHello();
  }
}
```

5. Create `seven7barber-api/API.md` for external documentation:
```markdown
# Seven7Barber API Documentation

## Base URL
- Production: `https://api.seven7barber.com`
- Development: `http://localhost:3000`

## Authentication
JWT Bearer token authentication.

## Endpoints

### Health
- `GET /health` - Service health check
- `GET /health/live` - Liveness probe
- `GET /health/ready` - Readiness probe

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh token

### Appointments
- `GET /appointments` - List user appointments
- `POST /appointments` - Create appointment
- `GET /appointments/:id` - Get appointment details
- `PATCH /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

### Services
- `GET /services` - List all services
- `GET /services/:id` - Get service details

### Barbers
- `GET /barbers` - List all barbers
- `GET /barbers/:id` - Get barber details

## Interactive Docs
Visit `/api/docs` for Swagger UI with interactive documentation.
```

</action>

<acceptance_criteria>

- [ ] `bun add @nestjs/swagger swagger-ui-express` succeeds
- [ ] `GET /api/docs` returns Swagger UI
- [ ] `GET /api/docs.json` returns OpenAPI spec
- [ ] API.md exists with endpoint documentation
- [ ] Health controller has `@ApiTags('health')` decorator

</acceptance_criteria>

---

### Task 1.5 — README and Getting Started Guide

<read_first>
- seven7barber-api/README.md
- seven7barber-web/README.md
- .env.example
</read_first>

<action>

**Create comprehensive README files:**

1. Update `seven7barber-api/README.md`:
```markdown
# Seven7Barber API

Barbershop appointment booking platform backend.

## Tech Stack

- **Runtime:** Bun
- **Framework:** NestJS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Bun 1.x
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
bun install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Copy environment file
cp .env.example .env
# Edit .env with your values
```

### Development

```bash
# Start in watch mode
bun run start:dev

# Run tests
bun test

# Run tests in watch mode
bun run test:watch

# Type check
bun run type-check

# Lint
bun run lint
```

### Production

```bash
# Build
bun run build

# Run
bun run start:prod
```

### Docker

```bash
# Build image
docker build -t seven7barber-api:latest .

# Run container
docker run -p 3000:3000 --env-file .env seven7barber-api:latest
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /health/live | Liveness probe |
| GET | /health/ready | Readiness probe |
| GET | /api/docs | Swagger documentation |

Full documentation at `/api/docs`.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| JWT_SECRET | Secret for JWT signing | Yes |
| PORT | Server port (default: 3000) | No |

## Project Structure

```
src/
├── main.ts           # Application entry
├── app.module.ts     # Root module
├── app.controller.ts # Root controller
├── auth/             # Authentication module
├── users/             # User management
├── appointments/     # Booking system
├── services/         # Barber services
├── health/           # Health check endpoints
└── common/           # Shared utilities
```

## License

MIT
```

2. Create/update `seven7barber-web/README.md`:
```markdown
# Seven7Barber Web

Barbershop appointment booking platform frontend.

## Tech Stack

- **Framework:** Next.js 16 (Vinext)
- **UI:** React 19 + shadcn/ui
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js

## Getting Started

### Prerequisites

- Bun 1.x
- Node.js 20+

### Installation

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your values
```

### Development

```bash
# Start dev server
bun run dev

# Build
bun run build

# Start production
bun run start
```

### Docker

```bash
# Build image
docker build -t seven7barber-web:latest .

# Run container
docker run -p 3000:3000 seven7barber-web:latest
```

## Features

- User registration and login
- Service browsing
- Barber selection
- Appointment booking wizard
- User dashboard

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/              # Utilities and config
└── server/           # Server actions
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_API_URL | Backend API URL | Yes |
| NEXTAUTH_SECRET | NextAuth session secret | Yes |

## License

MIT
```

3. Create root `README.md`:
```markdown
# Seven7Barber

Barbershop appointment booking platform.

## Tech Stack

- **Frontend:** Next.js 16 (Vinext), React 19, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, Bun runtime, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Infrastructure:** Docker, Nginx, GitHub Actions

## Quick Start

### Prerequisites

- Bun 1.x
- Docker (for containerized development)
- PostgreSQL 14+ (or use Supabase)

### Local Development

```bash
# Clone and install
git clone <repository>
cd seven7barber
bun install

# Setup environment
cp .env.example .env
# Edit .env with your database URL and secrets

# Start infrastructure
docker compose up -d

# Run migrations
cd seven7barber-api && npx prisma migrate dev

# Start development servers
bun run dev
```

### Production Deployment

See [DEPLOY.md](docs/development/DEPLOY.md) for detailed deployment instructions.

## Project Structure

```
seven7barber-api/    # NestJS backend
seven7barber-web/    # Next.js frontend
docker-compose.prod.yml  # Production Docker config
nginx/               # Nginx configuration
docs/                # Development documentation
```

## Documentation

- [ROADMAP.md](docs/development/ROADMAP.md) - Project roadmap
- [ARCHITECTURE.md](.planning/codebase/ARCHITECTURE.md) - System architecture
- [API Docs](http://localhost:3000/api/docs) - Swagger documentation

## License

MIT
```

</action>

<acceptance_criteria>

- [ ] `seven7barber-api/README.md` has installation, development, and production sections
- [ ] `seven7barber-web/README.md` has installation and development sections
- [ ] Root `README.md` has project overview and quick start
- [ ] All README files have working code blocks with correct commands
- [ ] `.env.example` exists and documents all required variables

</acceptance_criteria>

---

### Task 1.6 — Deployment Runbook and Rollback Procedures

<read_first>
- docker-compose.prod.yml
- .github/workflows/deploy.yml
- nginx/nginx.conf
</read_first>

<action>

**Create comprehensive deployment documentation:**

1. Create `docs/development/DEPLOY.md`:
```markdown
# Seven7Barber Deployment Guide

## Overview

This guide covers production deployment of the Seven7Barber platform using Docker Compose with Nginx as a reverse proxy.

## Architecture

```
                    ┌─────────────┐
User ─── HTTPS ────►│   Nginx     │──── port 443
                    │  (SSL offload) │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         ┌────────┐   ┌────────┐   ┌─────────┐
         │  Web   │   │   API  │   │  Nginx  │
         │ :3000  │   │ :3000  │   │  :80    │
         └────────┘   └────────┘   └─────────┘
```

## Prerequisites

- Docker 24+
- Docker Compose 2.20+
- Domain configured with DNS A records
- SSL certificates (or use Let's Encrypt)

## Environment Setup

### 1. Create environment file

```bash
# On production server
cp .env.example .env
```

Required variables:
```bash
DATABASE_URL=postgresql://user:password@host:5432/seven7barber
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NEXTAUTH_SECRET=your-nextauth-secret
FRONTEND_URL=https://seven7barber.com
NEXT_PUBLIC_API_URL=https://api.seven7barber.com
NEXT_PUBLIC_CLOUDINARY_CLOUD=your-cloudinary-cloud-name
```

### 2. SSL Certificates

**Option A: Let's Encrypt (Recommended)**

```bash
# Run setup script
chmod +x scripts/setup-ssl.sh
sudo ./scripts/setup-ssl.sh
```

**Option B: Manual**

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy certificates
cp /path/to/fullchain.pem nginx/ssl/
cp /path/to/privkey.pem nginx/ssl/

# Ensure proper permissions
chmod 600 nginx/ssl/privkey.pem
```

## Deployment Steps

### 1. Pull latest changes

```bash
git pull origin main
```

### 2. Build images

```bash
docker compose -f docker-compose.prod.yml build
```

### 3. Run migrations

```bash
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

### 4. Start services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 5. Verify deployment

```bash
# Check service health
curl https://api.seven7barber.com/health
curl https://seven7barber.com/health

# Check nginx logs
docker compose -f docker-compose.prod.yml logs nginx
```

## Rollback Procedures

### Quick Rollback (Same version)

If deployment has issues:

```bash
# Stop current containers
docker compose -f docker-compose.prod.yml down

# Start previous version (if using image tags)
docker compose -f docker-compose.prod.yml up -d
```

### Full Rollback to Previous Commit

```bash
# 1. Revert code
git revert HEAD
git push origin main

# 2. Wait for CI/CD to deploy, OR manually:
git checkout <previous-commit-hash>
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Database Rollback

```bash
# Rollback last migration
docker compose -f docker-compose.prod.yml exec api npx prisma migrate revert

# Restore from backup (if needed)
pg_restore -h dbhost -U user -d seven7barber backup.sql
```

## Monitoring

### Check Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f web
```

### Health Checks

```bash
# API health
curl https://api.seven7barber.com/health

# Web health
curl https://seven7barber.com/health

# Nginx status
docker exec seven7barber-nginx nginx -t
```

### Metrics

```bash
# API metrics
curl https://api.seven7barber.com/metrics
```

## SSL Certificate Renewal

Let's Encrypt certificates expire after 90 days. Auto-renewal is configured, but manual renewal:

```bash
# Renew certificates
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/seven7barber.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/seven7barber.com/privkey.pem nginx/ssl/

# Reload nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs

# Check config validity
docker compose -f docker-compose.prod.yml config
```

### Database connection failed

```bash
# Test connection
docker compose -f docker-compose.prod.yml exec api sh -c "nc -zv db 5432"

# Check DATABASE_URL
docker compose -f docker-compose.prod.yml exec api env | grep DATABASE
```

### Nginx 502 Bad Gateway

```bash
# Check upstream services
curl http://localhost:3000/health

# Check nginx logs
docker compose -f docker-compose.prod.yml logs nginx
```

## Emergency Contacts

- **API Issues:** Check `/api/docs` for Swagger documentation
- **Database Issues:** Use `docker compose exec api npx prisma studio`
- **SSL Issues:** Check `/nginx/ssl/` directory exists with valid certs

## Maintenance Windows

Schedule maintenance windows for:
- Database migrations (avoid during peak hours)
- Major version upgrades
- SSL certificate renewals

Recommended maintenance window: Tuesday 2AM-4AM UTC
```

2. Create `scripts/backup.sh`:
```bash
#!/bin/bash
# Database backup script
set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

mkdir -p $BACKUP_DIR

echo "Starting database backup..."

# Get DATABASE_URL from environment
source .env

# Run backup
pg_dump "$DATABASE_URL" > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

echo "Backup complete: ${BACKUP_FILE}.gz"

# Keep only last 7 backups
ls -t $BACKUP_DIR/*.gz | tail -n +8 | xargs -r rm

echo "Old backups cleaned up. Latest backups:"
ls -lh $BACKUP_DIR/*.gz | tail -3
```

3. Create `scripts/health-check.sh`:
```bash
#!/bin/bash
# Health check script for monitoring

API_URL=${API_URL:-http://localhost:3000}
WEB_URL=${WEB_URL:-http://localhost:3001}
FAILED=0

echo "Checking API health..."
if curl -sf "$API_URL/health" > /dev/null; then
  echo "✓ API: OK"
else
  echo "✗ API: FAILED"
  FAILED=1
fi

echo "Checking Web health..."
if curl -sf "$WEB_URL/health" > /dev/null; then
  echo "✓ Web: OK"
else
  echo "✗ Web: FAILED"
  FAILED=1
fi

if [ $FAILED -eq 1 ]; then
  echo "Health check failed!"
  exit 1
fi

echo "All services healthy"
exit 0
```

4. Make scripts executable:
```bash
chmod +x scripts/backup.sh scripts/health-check.sh scripts/setup-ssl.sh
```

</action>

<acceptance_criteria>

- [ ] `docs/development/DEPLOY.md` exists with complete deployment instructions
- [ ] `docs/development/DEPLOY.md` has rollback procedures section
- [ ] `scripts/backup.sh` exists and is executable
- [ ] `scripts/health-check.sh` exists and is executable
- [ ] `scripts/setup-ssl.sh` exists and is executable
- [ ] DEPLOY.md documents health check endpoints
- [ ] DEPLOY.md documents SSL certificate renewal process

</acceptance_criteria>

---

## ✅ WAVE 1 COMPLETE

All 6 launch tasks are ready for execution. Tasks are independent and can be executed in parallel.

---

<verification>

## Verification Steps

After execution, verify:

1. **Health Endpoints:**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/health/live
   curl http://localhost:3000/health/ready
   ```

2. **Swagger Documentation:**
   ```bash
   curl http://localhost:3000/api/docs.json | jq '.info.title'
   ```

3. **Monitoring:**
   ```bash
   curl http://localhost:3000/metrics
   ```

4. **Documentation:**
   ```bash
   cat seven7barber-api/README.md | head -20
   cat docs/development/DEPLOY.md | head -20
   ```

5. **Scripts:**
   ```bash
   ls -la scripts/*.sh
   ./scripts/health-check.sh
   ```

</verification>

<success_criteria>

## Must-Haves (Verification)

1. ✅ Health check endpoints return proper JSON responses
2. ✅ Swagger UI accessible at `/api/docs`
3. ✅ OpenAPI spec accessible at `/api/docs.json`
4. ✅ Pino logging configured for production
5. ✅ Request logging middleware captures all HTTP requests
6. ✅ Metrics endpoint returns system information
7. ✅ SSL/TLS configured in nginx with TLS 1.2/1.3
8. ✅ README files exist for API, Web, and root
9. ✅ DEPLOY.md contains complete deployment and rollback procedures
10. ✅ Backup and health-check scripts are executable

</success_criteria>

---

*Plan: 06a | Phase: 06 | Wave: 1 | Requirements: REQ-LAUNCH-01 through REQ-LAUNCH-06*