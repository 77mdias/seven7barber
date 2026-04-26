# TASK-014: Booking Wizard (Frontend)

**ID:** TASK-014
**Phase:** PHASE-03
**Status:** ✅ Concluído
**Prioridade:** 🔴 ALTA

## 📋 Descrição
Implementar fluxo de reserva em 3 passos (Serviço → Barbeiro → Horário) com wizard component.

## ✅ Critérios de Aceite
- [x] Passo 1: Seleção de serviços (cards interativos)
- [x] Passo 2: Seleção de barbeiro (cards com nome e especialidades)
- [x] Passo 3: Seleção de horário (slots visuais por data)
- [x] Resumo final antes de confirmar
- [x] Validação de cada passo antes de avançar
- [x] Estado persistido entre passos (React state)
- [x] Confirmação cria Appointment via handler (mock)

## 🛠️ Detalhes de Implementação
- Criar BookingWizard component com Steps UI
- Server Actions: getBarbers(), getAvailableSlots()
- Multi-step form com react-hook-form
- Design premium com transitions entre passos

## 🧪 Estratégia de Teste
- [ ] Teste de fluxo completo: selecionar serviço → barbeiro → horário → confirmar
- [ ] Verificar validação de cada passo
- [ ] Verificar mensagem de sucesso após agendamento

## 🔗 Referências
- [TASK-012](./TASKS/TASK-012-web-service-catalog.md)
- [TASK-013](./TASKS/TASK-013-api-availability-engine.md)
