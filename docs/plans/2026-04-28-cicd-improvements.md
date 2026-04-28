# Seven7Barber CI/CD & Infrastructure Improvement Plan

> **Data:** 2026-04-28
> **Autor:** Hermes Agent
> **Status:** Implementado

---

## Resumo Executivo

Este plano aborda 3 problemas criticos identificados na pipeline CI/CD e propoe melhorias abrangentes para robustez, seguranca e confiabilidade da aplicacao.

---

## Problemas Identificados

### Problema 1: Test Runner Inconsistente (CRITICO)

**Causa Raiz:** O workflow `deploy.yml` usa `bun test` (Bun native test runner) enquanto `ci.yml` usa `bun run test` (Jest).

**Impacto:**
- 88 testes no deploy vs 97 testes no CI
- Erro: `Cannot find module '.prisma/client/default'`
- 1 teste falha no deploy mas passa no CI

**Solucao:** Padronizar para `bun run test` (Jest) em ambos os workflows.

### Problema 2: Prisma Client Nao Gerado (CRITICO)

**Causa Raiz:** O deploy.yml nao executa `bunx prisma generate` antes dos testes.

**Impacto:**
- O mock do Prisma configurado no `jest.config.ts` nao funciona no Bun native test runner
- Tests que dependem de Prisma falham

**Solucao:** Adicionar step `bunx prisma generate` antes dos testes.

### Problema 3: Senhas Hardcoded (SEGURANCA)

**Causa Raiz:** `docker-compose.yml` tem senhas em texto plano:
- `POSTGRES_PASSWORD: password123`
- `JWT_SECRET` ausente

**Impacto:**
- Risco de seguranca se exposto
- Nao segue boas praticas de 12-factor app

**Solucao:** Usar variaveis de ambiente com `${VAR:?erro}` para obrigatoriedade.

---

## Melhorias Implementadas

### 1. Workflows CI/CD

#### ci.yml (MELHORADO)
- ✅ Cache de dependencias com `actions/cache@v4`
- ✅ `bun install --frozen-lockfile` para builds reproduziveis
- ✅ `bunx prisma generate` antes dos testes
- ✅ Lint e Type-check separados (paralelos)
- ✅ Concurrency group para cancelar runs anteriores
- ✅ `--forceExit --detectOpenHandles` para Jest

#### deploy.yml (REESCRITO)
- ✅ Job "Quality Gates" unificado (lint + type-check + test + build)
- ✅ Cache de dependencias compartilhado
- ✅ Prisma generate antes dos testes
- ✅ Docker Buildx com cache GHA
- ✅ Deploy condicional: apenas `push` no `main`
- ✅ Retencao de artifacts: 1 dia

#### security.yml (NOVO)
- ✅ Dependency audit com `bun audit`
- ✅ Docker image scan com Trivy
- ✅ Secret detection com Gitleaks
- ✅ CodeQL analysis para TypeScript
- ✅ Schedule: diario as 3h da manha

### 2. Docker

#### API Dockerfile (MELHORADO)
- ✅ Multi-stage build (deps → build → production)
- ✅ Non-root user (`nestjs:1001`)
- ✅ Healthcheck integrado
- ✅ `--frozen-lockfile` para builds reproduziveis
- ✅ Prisma generate no build stage

#### Web Dockerfile (MELHORADO)
- ✅ Multi-stage build (deps → build → production)
- ✅ Non-root user (`nextjs:1001`)
- ✅ Healthcheck integrado
- ✅ Build args para variaveis publicas
- ✅ `--frozen-lockfile` para builds reproduziveis

### 3. Docker Compose

#### docker-compose.yml (CORRIGIDO)
- ✅ Senhas via variaveis de ambiente (`${VAR:?erro}`)
- ✅ Healthcheck no PostgreSQL
- ✅ Healthcheck na API
- ✅ `depends_on` com `condition: service_healthy`
- ✅ Portas configuraveis via variaveis

#### docker-compose.prod.yml (MELHORADO)
- ✅ Resource limits (memory e CPU)
- ✅ Healthchecks em todos os servicos
- ✅ Build target `production` nos Dockerfiles
- ✅ Variaveis de ambiente obrigatorias com `:?`

---

## Arquivos Alterados

| Arquivo | Mudanca |
|---------|---------|
| `.github/workflows/ci.yml` | Reescrito com cache, prisma generate, lint/type-check |
| `.github/workflows/deploy.yml` | Reescrito com Quality Gates, Docker Buildx, deploy condicional |
| `.github/workflows/security.yml` | **NOVO** - Audit, Trivy, Gitleaks, CodeQL |
| `seven7barber-api/Dockerfile` | Multi-stage, non-root, healthcheck |
| `seven7barber-web/Dockerfile` | Multi-stage, non-root, healthcheck, build args |
| `docker-compose.yml` | Senhas via env, healthchecks, depends_on condicional |
| `docker-compose.prod.yml` | Resource limits, healthchecks, build targets |

---

## Proximos Passos Recomendados

### Curto Prazo (1-2 semanas)
1. Configurar GitHub Secrets para producao:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXTAUTH_SECRET`
   - `FRONTEND_URL`
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD`

2. Criar arquivo `.env.example` atualizado com todas as variaveis

3. Adicionar testes E2E no CI (usando banco de teste)

### Medio Prazo (1-2 meses)
1. Implementar staging environment
2. Adicionar testes de carga com k6 ou Artillery
3. Implementar rollback automatico
4. Adicionar metricas com Prometheus/Grafana

### Longo Prazo (3+ meses)
1. Migrar para Kubernetes para melhor escalabilidade
2. Implementar GitOps com ArgoCD ou Flux
3. Adicionar A/B testing
4. Implementar feature flags

---

## Verificacao

Para verificar se as correcoes funcionam:

```bash
# 1. Clonar o repositorio
git clone https://github.com/77mdias/seven7barber.git
cd seven7barber

# 2. Criar .env para docker-compose
cp .env.example .env
# Editar .env com valores reais

# 3. Testar localmente
bun install
cd seven7barber-api
bunx prisma generate
bun run test

# 4. Testar Docker
docker compose up -d
curl http://localhost:3000/health
```

---

## Conclusao

As correcoes implementadas resolvem os 3 problemas criticos e adicionam:
- **Consistencia:** Ambos os workflows usam Jest via `bun run test`
- **Seguranca:** Senhas via variaveis de ambiente, scan de vulnerabilidades
- **Robustez:** Healthchecks, cache, multi-stage builds, resource limits
- **Confiabilidade:** Quality Gates antes do deploy, deploy condicional
