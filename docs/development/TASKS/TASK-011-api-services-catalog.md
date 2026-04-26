# TASK-011: API Services & Catalog

**ID:** TASK-011
**Phase:** PHASE-03
**Status:** ✅ Completa
**Prioridade:** 🔴 ALTA

## 📋 Descrição
Criar API REST para gerenciar catálogo de serviços da barbearia, incluindo CRUD completo de serviços.

## ✅ Critérios de Aceite
- [ ] Endpoint GET /services retornando lista de serviços ativos
- [ ] Endpoint GET /services/:id retornando detalhes de um serviço
- [ ] Endpoint POST /services para criar novo serviço (admin)
- [ ] Endpoint PATCH /services/:id para atualizar serviço (admin)
- [ ] Endpoint DELETE /services/:id para remover serviço (admin)
- [ ] Schemas Zod para validação de entrada
- [ ] Servicio: name, description, price, duration, category, isActive

## 🛠️ Detalhes de Implementação
- Criar ServicesModule no NestJS
- Criar ServiceController e ServiceService
- Implementar Prisma Service para acesso ao banco
- DTOs com class-validator e Zod

## 🧪 Estratégia de Teste
- [ ] Teste de integração: CRUD services via /services endpoints
- [ ] Verificar que DELETE soft-deletes (isActive: false)

## 🔗 Referências
- [PRD](./PHASES/PHASE-01/prd.md)
- [HELL-SPEC](./SPECS/HELL-SPEC-phase-01.md)
