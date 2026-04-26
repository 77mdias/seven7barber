---
title: "SPEC: PHASE-05 Integrations & Polish"
type: "spec"
status: "draft"
phase: "05"
created: "2026-04-26"
---

# SPEC: PHASE-05 — Integrations & Polish

## Overview

PHASE-05 é a fase final do projeto, focando em integrações (pagamento mock, email), SEO/accessibility, e deployment.

## 🎯 Objetivos

- [ ] Mock Payment Gateway — Simulação de pagamento para testes E2E
- [ ] Email Notifications — Sistema de envio de confirmações (mock)
- [ ] SEO & Accessibility — Meta tags, sitemap, auditoria A11Y
- [ ] Final Deploy — Configuração de produção e CI/CD

---

## TASK-021: Mock Payment Gateway

### Descrição
Sistema de pagamento mock para permitir testes E2E completos sem credenciais reais.

### API Endpoints

```typescript
// POST /payments/create-session
interface CreatePaymentSession {
  appointmentId: string;
  amount: number;
  method: 'CREDIT_CARD' | 'PIX' | 'BOLETO';
}

interface PaymentSession {
  sessionId: string;
  status: 'PENDING' | 'APPROVED' | 'FAILED' | 'REFUNDED';
  amount: number;
  method: string;
  qrCode?: string;        // For PIX
  receiptUrl?: string;   // For BOLETO
  createdAt: Date;
}
```

### Fluxo
1. Client seleciona método de pagamento
2. Backend cria sessão de pagamento (status: PENDING)
3. Mock processor simula processamento assíncrono
4. Webhook callback atualiza status (APPROVED/FAILED)
5. Appointment atualizada com payment status

### Módulos a Criar

```
seven7barber-api/src/payments/
├── payments.module.ts
├── payments.controller.ts
├── payments.service.ts
├── payments.service.spec.ts    // TDD
└── dto/
    ├── create-payment.dto.ts
    └── payment-callback.dto.ts
```

### Criteria Checklist
- [ ] POST /payments/create-session endpoint
- [ ] GET /payments/:sessionId status check
- [ ] POST /payments/callback (mock webhook)
- [ ] Payment methods: CREDIT_CARD, PIX, BOLETO
- [ ] Status flow: PENDING → APPROVED/FAILED
- [ ] Integration com appointment booking
- [ ] Unit tests com TDD

---

## TASK-022: Email Notifications

### Descrição
Sistema de notifications por email usando mock logger para desenvolvimento.

### Fluxos
1. **Booking Confirmation** — Enviada ao client após booking
2. **Reminder D-1** — Lembrete 24h antes do appointment
3. **Cancellation** — Confirmação de cancelamento
4. **Review Request** — Request após completion

### API (Template-based)

```typescript
interface EmailTemplate {
  type: 'BOOKING_CONFIRMATION' | 'REMINDER' | 'CANCELLATION' | 'REVIEW_REQUEST';
  to: string;
  data: Record<string, any>;
}

// Internal service
async function sendEmail(template: EmailTemplate): Promise<void>
async function queueEmail(template: EmailTemplate, delay?: number): Promise<void>
```

### Implementation

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

### Criteria Checklist
- [ ] EmailService with mock transport
- [ ] Templates Handlebars para 4 tipos
- [ ] Queue system (in-memory for dev)
- [ ] Integration hooks em appointment lifecycle
- [ ] Unit tests

---

## TASK-023: SEO & Accessibility

### SEO
- [ ] Dynamic meta tags (title, description, og:image)
- [ ] sitemap.xml auto-generated
- [ ] robots.txt
- [ ] Structured data (JSON-LD) para LocalBusiness
- [ ] Canonical URLs

### Accessibility (WCAG 2.1 AA)
- [ ] Audit de contraste (ratio ≥ 4.5:1)
- [ ] Keyboard navigation em todos interactive elements
- [ ] ARIA labels em ícones e botões
- [ ] Focus indicators visíveis
- [ ] Screen reader announcements

### Implementation

```typescript
// SEO Metadata hook
function generateMetadata(page: string, data: SeoData): Metadata

// Sitemap
// app/sitemap.ts

// JSON-LD
// components/JsonLd.tsx
```

### Files to Create/Update

```
seven7barber-web/src/
├── app/
│   ├── sitemap.ts          # NEW
│   ├── robots.ts           # NEW
│   └── layout.tsx          # UPDATE: metadata
├── components/
│   ├── JsonLd.tsx         # NEW: LocalBusiness schema
│   └── seo/
│       └── metadata.ts     # NEW: SEO hook
└── __tests__/
    └── accessibility/
        └── audit.spec.ts   # NEW
```

### Criteria Checklist
- [ ] Sitemap gerado dinamicamente
- [ ] Meta tags por página
- [ ] robots.txt
- [ ] JSON-LD LocalBusiness schema
- [ ] A11Y audit pass (axe-core)
- [ ] Keyboard navigation tests

---

## TASK-024: Final Deploy Configuration

### Docker Production
```yaml
# docker-compose.prod.yml
services:
  api:
    image: seven7barber-api:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
    restart: unless-stopped

  web:
    image: seven7barber-web:latest
    environment:
      NEXT_PUBLIC_API_URL: https://api.seven7barber.com
    restart: unless-stopped
    depends_on:
      - api

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test
      - run: bun run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun run build
      - run: bun run build --dir seven7barber-web

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploy logic"
```

### Criteria Checklist
- [ ] docker-compose.prod.yml
- [ ] CI pipeline com test + build
- [ ] Environment secrets configurados
- [ ] Health check endpoints
- [ ] Deployment script

---

## Dependências

```
TASK-021 (Payment Gateway)
  └── TASK-015 (Appointment booking) ✅ PHASE-03
  └── TASK-019 (Vouchers integration)

TASK-022 (Email Notifications)
  └── TASK-010 (EmailService mock) ✅ PHASE-02
  └── TASK-015 (Appointment lifecycle)

TASK-023 (SEO & A11Y)
  └── All phases complete

TASK-024 (Deploy)
  └── TASK-021, TASK-022, TASK-023
```

---

## Implementation Order

1. **TASK-021**: Payment Gateway (backend TDD)
2. **TASK-022**: Email Notifications (backend TDD)
3. **TASK-023**: SEO & A11Y (frontend)
4. **TASK-024**: Deploy Configuration (infra)

---

## Test Strategy

### TASK-021 (Payment Gateway) — TDD
```typescript
describe('PaymentsService', () => {
  describe('createPaymentSession', () => {
    it('creates session with PENDING status')
    it('rejects invalid appointmentId')
    it('calculates correct amount from services')
  });

  describe('processPaymentCallback', () => {
    it('updates session to APPROVED')
    it('updates session to FAILED')
    it('triggers appointment update on APPROVED')
  });
});
```

### TASK-022 (Notifications) — TDD
```typescript
describe('NotificationsService', () => {
  describe('sendBookingConfirmation', () => {
    it('sends email with correct template data')
    it('queues email if offline')
  });

  describe('sendReminder', () => {
    it('schedules reminder for 24h before')
    it('does not send if appointment cancelled')
  });
});
```

---

## Success Criteria

- [ ] TASK-021: Payment gateway funcional com 3 métodos
- [ ] TASK-022: Emails Disparados no lifecycle correto
- [ ] TASK-023: SEO audit pass + A11Y WCAG AA
- [ ] TASK-024: Deploy pipeline verde
- [ ] All tests passing: 100+
- [ ] Coverage > 70%

---

## Files to Create

| File | Task | Type |
|------|------|------|
| `docs/PHASES/PHASE-05/phase-board.md` | ALL | Board |
| `docs/PHASES/PHASE-05/SPECS/SPEC-phase-05.md` | ALL | This spec |
| `docs/TASKS/TASK-021-payment-gateway.md` | 021 | Task |
| `docs/TASKS/TASK-022-email-notifications.md` | 022 | Task |
| `docs/TASKS/TASK-023-seo-accessibility.md` | 023 | Task |
| `docs/TASKS/TASK-024-deploy-config.md` | 024 | Task |
| `seven7barber-api/src/payments/**` | 021 | Module |
| `seven7barber-api/src/notifications/**` | 022 | Module |
| `seven7barber-web/src/app/sitemap.ts` | 023 | File |
| `seven7barber-web/src/app/robots.ts` | 023 | File |
| `docker-compose.prod.yml` | 024 | Config |
| `.github/workflows/deploy.yml` | 024 | CI/CD |
