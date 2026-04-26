# GAP-002: OAuth Providers Keys Missing

**ID:** GAP-002
**Categoria:** Authentication
**Severidade:** 🟡 MAJOR
**Status:** ✅ RESOLVIDO
**Data Identificação:** 2026-04-26
**Data Resolução:** 2026-04-26

## 📋 Descrição
O PRD e a PHASE-02 mencionam a integração com provedores OAuth (GitHub, Google, Discord), porém as chaves de API e segredos ainda não foram providenciados pelo cliente/ambiente de produção.

## 📉 Impacto
- ~~Usuários não podem realizar login via social providers.~~
- ~~Testes de integração de OAuth estão bloqueados.~~

## ✅ Solução Implementada

### TASK-016 — Mock OAuth Setup

**Implementação:**
1. **Mock Credentials Provider** (`auth.ts`)
   - MOCK_USERS array com 3 perfis: CLIENT, BARBER, ADMIN
   - `USE_MOCK_AUTH=true` ativa mock mode
   - Senha padrão para dev: `devpassword123`

2. **Environment Variables** (`.env.example`)
   - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
   - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
   - DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
   - NEXTAUTH_SECRET, NEXTAUTH_URL
   - USE_MOCK_AUTH=true

3. **Documentação** (`OAUTH-SETUP.md`)
   - Guia de setup para cada provider (GitHub, Google, Discord)
   - Troubleshooting section
   - Environment variables reference

4. **Testes** (`auth.mock.spec.ts`)
   - 11 testes cobrindo: C1-C11
   - Autenticação válida/inválida
   - Lookup de usuários
   - JWT token claims

## 💡 Proposta de Solução (Status Final)

- [x] Implementar mock de OAuth para desenvolvimento local (**TASK-016** ✅)
- [x] Criar documentação para o setup das variáveis de ambiente (`.env.example` ✅)
- [ ] Aguardar credenciais reais para configuração do `NextAuth` (futuro, quando em produção)

## 🔗 Referências
- [PRD](../../prd/PRD.md)
- [TASK-008](../TASKS/TASK-008-web-auth-integration.md)
- [TASK-016](../TASKS/TASK-016-mock-oauth-setup.md)
- [OAUTH-SETUP.md](../OAUTH-SETUP.md)