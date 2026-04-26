# GAP-001: Basic CI/CD Pipeline Missing

**ID:** GAP-001
**Categoria:** DevOps
**Severidade:** 🟡 MAJOR
**Status:** ✅ RESOLVIDO
**Data Identificação:** 2026-04-24
**Data Resolução:** 2026-04-24

## 📋 Descrição
Pipeline de CI/CD básico não existia, comprometendo a qualidade do código e automação de deploys.

## 📉 Impacto
- ~~Código não passava por validações automáticas antes de merge~~
- ~~Deploys eram 100% manuais~~
- ~~Sem feedback rápido sobre status de build~~

## ✅ Solução Implementada

### GitHub Actions Workflow

**Arquivo:** `.github/workflows/deploy.yml`

**Funcionalidades:**
- Build para API e Web
- Lint e TypeScript check
- Test execution
- Deploy automático para produção

**Stack:**
- `oven-sh/setup-bun@v2` para Bun
- Jobs paralelos para validação
- Environment variables via GitHub Secrets

## 🔗 Referências
- [AGENTS.md](../../AGENTS.md) — Build commands
- [GitHub Actions](https://docs.github.com/pt/actions)
