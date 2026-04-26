# GAP-002: OAuth Providers Keys Missing

**ID:** GAP-002
**Categoria:** Authentication
**Severidade:** 🟡 MAJOR
**Status:** OPEN
**Data Identificação:** 2026-04-26

## 📋 Descrição
O PRD e a PHASE-02 mencionam a integração com provedores OAuth (GitHub, Google, Discord), porém as chaves de API e segredos ainda não foram providenciados pelo cliente/ambiente de produção.

## 📉 Impacto
- Usuários não podem realizar login via social providers.
- Testes de integração de OAuth estão bloqueados.

## 💡 Proposta de Solução
- [ ] Implementar mock de OAuth para desenvolvimento local.
- [ ] Criar documentação para o setup das variáveis de ambiente (`.env.example`).
- [ ] Aguardar credenciais reais para configuração do `NextAuth`.

## 🔗 Referências
- [PRD](../../prd/PRD.md)
- [TASK-008](../TASKS/TASK-008-web-auth-integration.md)
