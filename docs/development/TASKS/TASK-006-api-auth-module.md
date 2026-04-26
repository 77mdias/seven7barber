# TASK-006: API Auth Module (JWT)

**ID:** TASK-006
**Phase:** PHASE-02
**Status:** ✅ Completa
**Prioridade:** 🔴 ALTA

## 📋 Descrição
Configurar a estratégia de autenticação utilizando JWT no NestJS e prover endpoints de `/auth/login` e `/auth/register`.

## ✅ Critérios de Aceite
- [x] Bibliotecas `@nestjs/jwt`, `passport-jwt` instaladas.
- [x] `JwtStrategy` configurada para verificar os headers HTTP Bearer.
- [x] Endpoints e DTOs implementados.
- [x] Senhas salvas com hash seguro (bcrypt).

## 🛠️ Detalhes de Implementação
- Implementado em `seven7barber-api/src/auth`.
- O payload do JWT inclui id (sub), email e role.

## 🧪 Estratégia de Teste
- [x] Envio de credenciais corretas retorna Token.
- [x] Acesso à rota protegida `/auth/me` usando o guard `JwtAuthGuard`.

## 🔗 Referências
- [PRD](../PHASES/PHASE-01/prd.md)
