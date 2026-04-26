# TASK-018: Reviews & Ratings System

**ID:** TASK-018
**Phase:** PHASE-04
**Status:** ✅ Concluído
**Prioridade:** 🔴 ALTA

## 📋 Descrição
Implementar sistema de avaliações e ratings com suporte a fotos e feedback textual.

## ✅ Critérios de Aceite
- [x] Endpoint POST /reviews para criar avaliação
- [x] Endpoint GET /reviews?barberId= para listar avaliações por barbeiro
- [x] Validação de rating 1-5
- [x] Suporte a fotos (urls array)
- [x] Cálculo de média de rating por barbeiro
- [x] Exibir avaliações na página do barbeiro

## 🛠️ Detalhes de Implementação
- Criar ReviewsModule no NestJS
- ReviewsController com POST e GET endpoints
- ReviewsService com lógica de CRUD e cálculo de média
- ServiceHistory model (já existe no schema) para link com appointment

## 🧪 Estratégia de Teste
- [ ] Teste: criar review com rating válido
- [ ] Teste: validation error para rating fora do range
- [ ] Teste: listar reviews por barber_id
- [ ] Teste: cálculo de média correto

## 🔗 Referências
- [PHASE-04](./PHASES/PHASE-04/phase-board.md)
- [Schema: ServiceHistory](../seven7barber-api/prisma/schema.prisma)