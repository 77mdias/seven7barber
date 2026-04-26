# TASK-013: API Availability Engine

**ID:** TASK-013
**Phase:** PHASE-03
**Status:** ✅ Concluído
**Prioridade:** 🔴 ALTA

## 📋 Descrição
Implementar motor de cálculo de horários disponíveis considerando barbaqueiros, serviços e horarios de funcionamento.

## ✅ Critérios de Aceite
- [ ] Endpoint GET /availability?date=YYYY-MM-DD&serviceIds=1,2,3
- [ ] Retornar slots disponíveis por barbeiro
- [ ] Considerar horário de funcionamento da barbearia
- [ ] Bloquear horários já agendados
- [ ] Considerar duração dos serviços solicitados
- [ ] Considerar tempo de buffer entre agendamentos (15 min)

## 🛠️ Detalhes de Implementação
- Criar AvailabilityModule no NestJS
- AvailabilityService com lógica de cálculo
- Levar em conta: workingHours, existingAppointments, serviceDuration
- Cache de resultados (5 min) para performance

## 🧪 Estratégia de Teste
- [x] Teste: data sem agendamentos retorna todos os slots
- [x] Teste: após agendamento, slots correspondentes removidos
- [x] Teste: múltiplos serviços somam duração corretamente

## 🔗 Referências
- [PRD](./PHASES/PHASE-01/prd.md)
- [TASK-011](./TASKS/TASK-011-api-services-catalog.md)
