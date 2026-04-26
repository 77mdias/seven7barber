---
title: "TASK-024: Final Deploy Configuration"
type: "task"
status: "pending"
phase: "05"
priority: "🟡 MÉDIA"
created: "2026-04-26"
---

# TASK-024: Final Deploy Configuration

## 📋 Descrição
Configuração de production deployment com Docker, CI/CD pipeline e environment secrets.

## 🎯 Objetivos
- docker-compose.prod.yml
- GitHub Actions CI/CD
- Environment secrets configurados
- Health check endpoints

## 🔗 Dependências
- TASK-021 (Payment) ⏳ PHASE-05
- TASK-022 (Notifications) ⏳ PHASE-05
- TASK-023 (SEO/A11Y) ⏳ PHASE-05

## 📁 Estrutura

```
├── docker-compose.prod.yml   # NEW
├── docker-compose.yml        # UPDATE (dev)
├── nginx/
│   └── nginx.conf            # NEW
├── .github/
│   └── workflows/
│       ├── test.yml          # NEW
│       └── deploy.yml        # NEW
└── .env.production.example   # NEW
```

## 🐳 Docker Production

### docker-compose.prod.yml
```yaml
services:
  api:
    image: seven7barber-api:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s

  web:
    image: seven7barber-web:latest
    environment:
      NEXT_PUBLIC_API_URL: https://api.seven7barber.com
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web
      - api
```

## ⚙️ CI/CD Pipeline

### GitHub Actions Workflows

```yaml
# .github/workflows/test.yml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run type-check
      - run: bun test
      - run: bun run lint

# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Build and push images
        run: |
          docker build -t seven7barber-api:latest ./seven7barber-api
          docker build -t seven7barber-web:latest ./seven7barber-web
```

## 🔐 Environment Secrets

```bash
# .env.production.example
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_API_URL=https://api.seven7barber.com
```

## 📊 Criteria Checklist

- [ ] docker-compose.prod.yml
- [ ] Health check endpoints (API + Web)
- [ ] CI pipeline com test + build
- [ ] Environment secrets no GitHub Actions
- [ ] Deployment script/shell
- [ ] Rollback procedure documentado

## 🧪 Test Strategy

```typescript
describe('Deploy', () => {
  it('docker-compose.prod.yml is valid')
  it('health endpoint returns 200')
  it('CI pipeline triggers on push')
  it('secrets are not exposed in logs')
});
```

## 📝 Notas

- Não fazer deploy real sem autorização
- Health checks: `/health` endpoint
- Nginx como reverse proxy

---
*Status: ⏳ Pendente — Última task da fase*
