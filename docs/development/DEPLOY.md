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