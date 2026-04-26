---
Project: Seven7Barber
HELL_Phase: Requisitos
Status: 🔥 ACTIVE
Patterns_Used: [Information_Expert, Creator, Protected_Variations, Controller]
---

# HELL Specification: Booking Wizard

## Requisitos Funcionais

### RF-01: Seleção de Serviço
- **Prioridade:** MUST
- Ator escolhe UM serviço por vez (single selection)
- Lista de serviços vem da API (Services Module)
- Serviço tem: id, nome, descrição, duração (min), preço

### RF-02: Seleção de Barbeiro
- **Prioridade:** SHOULD
- Ator escolhe de lista fixa de barbeiros disponíveis
- Opcional: pode pular e selecionar "qualquer disponível"
- Barbeiro tem: id, nome, foto, specialties

### RF-03: Seleção de Horário
- **Prioridade:** MUST
- Granularidade VARIÁVEL conforme serviço selecionado
- Janela de marcação: 1-30 dias avançados
- Horários indisponíveis são filtrados em tempo real
- Horário tem: data, hora, duração_ajustada

### RF-04: Confirmação e Resumo
- **Prioridade:** MUST
- Resumo: serviço, barbeiro, data/hora, preço total
- Confirmação cria Appointment via API
- Redirect para pagamento ABACATE PAY após confirmação

### RF-05: Rollback Suave
- **Prioridade:** MUST
- Em caso de erro na criação do appointment:
  - Reservar horário apenas após confirmação
  - Mostrar erro amigável com retry
  - Horário volta a ficar disponível

### RF-06: Progresso e Navegação
- **Prioridade:** SHOULD
- Indicador visual de progresso (stepper)
- Voltar para passo anterior sem perder dados
- Timeout de 10 min por passo (hold de horário)

## Requisitos Não-Funcionais

### RNF-01: Performance
- Tempo de resposta API < 200ms para listagens
- Slot disponível verificado em tempo real

### RNF-02: Mobile-First
- Layout responsivo: 320px → 1440px
- Touch-friendly: targets ≥ 44px

### RNF-03: Segurança
- Autenticação OAuth2 obrigatória
- CSRF protection em server actions
- Rate limiting: 10 requests/min por cliente

## Domain Model (GRASP)

### Entities

| Entity | Attributes | Responsibility |
|--------|------------|----------------|
| `Service` | id, name, description, duration, price | Information Expert: detém dados de serviço |
| `Barber` | id, name, photo, specialties[] | Information Expert: detém dados de barbeiro |
| `TimeSlot` | id, barberId, startTime, endTime, isBooked | Information Expert: detém disponibilidade |
| `Appointment` | id, serviceId, barberId, slotId, clientId, status, createdAt | Information Expert: detém dados de agendamento |

### Value Objects

| VO | Attributes | Purpose |
|----|------------|---------|
| `BookingRequest` | serviceId, barberId?, slotId, clientId |封装请求数据 |
| `BookingConfirmation` | appointmentId, summary, paymentUrl | 返回确认数据 |

### Aggregates

```
Booking (Aggregate Root: Appointment)
├── Service (Entity)
├── Barber (Entity)
└── TimeSlot (Entity)
```

### GRASP Analysis

| Pattern | Applied To | Justification |
|---------|------------|--------------|
| Information Expert | Service, Barber, TimeSlot | Cada entidade detém seus próprios dados e operações |
| Creator | API Controller (BookingController) | Controlador cria Appointment após validação |
| Protected Variations | ITimeSlotStrategy | Interface abstrata para estratégias de disponibilidade |
| Controller | BookingController | Orquestra use case completo do wizard |

## Variation Points

| Variation Point | Interface | Stable Implementation |
|-----------------|-----------|---------------------|
| Disponibilidade de horários | `ITimeSlotStrategy` | `DefaultTimeSlotStrategy` |
| Cálculo de preço | `IPricingStrategy` | `SimplePricingStrategy` |
| Seleção de barbeiro | `IBarberSelectionStrategy` | `FixedListBarberStrategy` |

## Ubiquitous Language

| Term | Definition |
|------|------------|
| Wizard | Fluxo multi-step de agendamento |
| Slot | Janela de tempo disponível para booking |
| Step | Etapa individual do wizard (serviço, barbeiro, horário, confirmação) |
| Hold | Reserva temporária de slot durante wizard |
| Booking | Agendamento confirmado |

## Gate Check

- [x] All requirements have priority (MUST/SHOULD/COULD)
- [x] Domain modeled with Entities, VOs, Aggregates
- [x] Variation points identified with interfaces
- [x] Glossary documented
