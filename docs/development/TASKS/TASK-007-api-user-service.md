# TASK-007: API User Service & Controller

**ID:** TASK-007
**Phase:** PHASE-02
**Status:** ✅ Completa
**Prioridade:** 🔴 ALTA

## 📋 Descrição
Serviço do NestJS que gerencia usuários e atua como ponte segura com o ORM Prisma.

## ✅ Critérios de Aceite
- [x] `UserService` criado e exportado.
- [x] Funções de buscar por email e criação de usuário implementadas.
- [x] PrismaService integrado corretamente.

## 🛠️ Detalhes de Implementação
- Criado em `seven7barber-api/src/user`.
- O AuthService o consome via injeção de dependência do módulo UserModule.

## 🧪 Estratégia de Teste
- [x] Acesso ao db simulado corretamente e integrado na rota `/auth/register`.

## 🔗 Referências
- [PRD](../PHASES/PHASE-01/prd.md)
