---
title: "TASK-022: Email Notifications"
type: "task"
status: "pending"
phase: "05"
priority: "🔴 ALTA"
created: "2026-04-26"
---

# TASK-022: Email Notifications

## 📋 Descrição
Sistema de envio de notifications por email usando template Handlebars e mock logger para desenvolvimento.

## 🎯 Objetivos
- Criar módulo `notifications/` no NestJS
- Implementar 4 templates de email
- Integrar com lifecycle de appointments
- Queue system para emails

## 🔗 Dependências
- TASK-010 (EmailService mock) ✅ PHASE-02
- TASK-015 (Appointment lifecycle) ✅ PHASE-03

## 📁 Estrutura

```
seven7barber-api/src/notifications/
├── notifications.module.ts
├── notifications.service.ts
├── notifications.service.spec.ts  // TDD
├── templates/
│   ├── booking-confirmation.hbs
│   ├── reminder.hbs
│   ├── cancellation.hbs
│   └── review-request.hbs
└── dto/
    └── send-notification.dto.ts
```

## 🔌 API / Hooks

### Email Types

```typescript
type EmailType = 'BOOKING_CONFIRMATION' | 'REMINDER' | 'CANCELLATION' | 'REVIEW_REQUEST';

interface EmailData {
  appointmentId: string;
  clientName: string;
  clientEmail: string;
  barberName: string;
  serviceName: string;
  dateTime: Date;
  totalPrice: number;
}
```

### Service Methods

```typescript
async function sendEmail(template: EmailType, data: EmailData): Promise<void>
async function queueEmail(template: EmailType, data: EmailData, delay?: number): Promise<void>
```

## 📧 Template Hooks

| Event | Template | Timing |
|-------|----------|--------|
| Booking created | BOOKING_CONFIRMATION | Immediate |
| 24h before | REMINDER | Scheduled |
| Appointment cancelled | CANCELLATION | Immediate |
| Appointment completed | REVIEW_REQUEST | Immediate |

## 📊 Criteria Checklist

- [ ] Module `notifications/` criado
- [ ] EmailService com mock transport
- [ ] Templates Handlebars para 4 tipos
- [ ] Queue system (in-memory for dev)
- [ ] Integration hooks em appointment lifecycle
- [ ] Unit tests (TDD)

## 🧪 Test Strategy (TDD)

```typescript
describe('NotificationsService', () => {
  describe('sendBookingConfirmation', () => {
    it('sends email with correct template data')
    it('logs email content in dev mode')
    it('handles missing client email gracefully')
  });

  describe('sendReminder', () => {
    it('schedules reminder for 24h before appointment')
    it('does not send if appointment cancelled')
    it('calculates correct delay time')
  });

  describe('sendCancellation', () => {
    it('sends cancellation email to client')
    it('includes refund information if applicable')
  });

  describe('sendReviewRequest', () => {
    it('sends review request after completion')
    it('includes direct link to review form')
  });

  describe('queueEmail', () => {
    it('adds email to queue with delay')
    it('processes queued emails after delay')
    it('persists queue in memory')
  });
});
```

## 🚦 Implementação TDD

1. **RED**: Escrever testes primeiro
2. **GREEN**: Implementar código mínimo
3. **REFACTOR**: Limpar se necessário

## 📝 Notas

- Mock logger: `console.log` em dev mode
- Queue in-memory simples (não requer Redis)
- Templates com Handlebars simples

---
*Status: ⏳ Pendente — Aguardando PHASE-04 completion*
