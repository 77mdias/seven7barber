---
title: "TASK-021: Mock Payment Gateway"
type: "task"
status: "pending"
phase: "05"
priority: "🔴 ALTA"
created: "2026-04-26"
---

# TASK-021: Mock Payment Gateway

## 📋 Descrição
Sistema de pagamento mock para permitir testes E2E completos sem credenciais reais de gateway.

## 🎯 Objetivos
- Criar módulo `payments/` no NestJS
- Implementar fluxo: PENDING → APPROVED/FAILED
- Suportar 3 métodos: CREDIT_CARD, PIX, BOLETO
- Integrar com appointment booking

## 🔗 Dependências
- TASK-015 (Appointment booking) ✅ PHASE-03
- TASK-019 (Vouchers) ✅ PHASE-04
- Payment model no schema Prisma

## 📁 Estrutura

```
seven7barber-api/src/payments/
├── payments.module.ts
├── payments.controller.ts
├── payments.service.ts
├── payments.service.spec.ts    // TDD - RED FIRST
└── dto/
    ├── create-payment.dto.ts
    └── payment-callback.dto.ts
```

## 🔌 API Endpoints

### POST /payments/create-session
```typescript
// Request
{
  appointmentId: string;
  amount: number;
  method: 'CREDIT_CARD' | 'PIX' | 'BOLETO';
}

// Response
{
  sessionId: string;
  status: 'PENDING';
  amount: number;
  method: string;
  qrCode?: string;        // PIX only
  receiptUrl?: string;   // BOLETO only
  createdAt: Date;
}
```

### GET /payments/:sessionId
```typescript
// Response
{
  sessionId: string;
  status: 'PENDING' | 'APPROVED' | 'FAILED' | 'REFUNDED';
  amount: number;
  method: string;
  updatedAt: Date;
}
```

### POST /payments/callback (Mock Webhook)
```typescript
// Request
{
  sessionId: string;
  status: 'APPROVED' | 'FAILED';
  signature: string;  // Mock validation
}
```

## 📊 Criteria Checklist

- [ ] Module `payments/` criado
- [ ] POST /payments/create-session endpoint
- [ ] GET /payments/:sessionId status check
- [ ] POST /payments/callback (mock webhook)
- [ ] Payment methods: CREDIT_CARD, PIX, BOLETO
- [ ] Status flow: PENDING → APPROVED/FAILED
- [ ] Integration com appointment booking
- [ ] Unit tests (TDD - RED FIRST)

## 🧪 Test Strategy (TDD)

```typescript
describe('PaymentsService', () => {
  // RED: Write tests first
  describe('createPaymentSession', () => {
    it('creates session with PENDING status')
    it('rejects invalid appointmentId')
    it('calculates correct amount from services')
    it('generates qrCode for PIX method')
    it('generates receiptUrl for BOLETO method')
  });

  describe('processPaymentCallback', () => {
    it('updates session to APPROVED')
    it('updates session to FAILED')
    it('triggers appointment paymentStatus update on APPROVED')
    it('validates mock signature')
  });

  describe('getPaymentSession', () => {
    it('returns session by id')
    it('throws for non-existent session')
  });
});
```

## 🚦 Implementação TDD

1. **RED**: Escrever testes em `payments.service.spec.ts`
2. **GREEN**: Implementar código mínimo para passar
3. **REFACTOR**: Limpar se necessário

## 📝 Notas

- Mock processor simula processamento assíncrono (setTimeout 2s)
- Callback pode ser chamado manualmente para testar
- Não requer credenciais reais de gateway

---
*Status: ⏳ Pendente — Aguardando PHASE-04 completion*
