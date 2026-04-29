# Plano de Refatoração — Strategy Pattern no seven7barber-api

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Refatorar o backend seven7barber-api aplicando o Design Pattern Strategy para eliminar if/else chains e switch statements, tornando o código mais semântico, fluido, legível e extensível.

**Architecture:** Cada bloco condicional que seleciona um algoritmo com base em um tipo/método será extraído para uma interface Strategy com implementações concretas. O serviço original (Context) receberá a strategy via injeção de dependência do NestJS, usando um registry/factory para resolução dinâmica.

**Tech Stack:** NestJS 11, TypeScript, Prisma, Jest

**Referência:** https://refactoring.guru/design-patterns/strategy

---

## Análise do Código Atual — Pontos de Refatoração

### 1. PaymentsService (payments.service.ts)
**Problema:** if/else chain para PIX, BOLETO, CREDIT_CARD em `createPaymentSession()`
```typescript
if (dto.method === PaymentMethod.PIX) { ... }
if (dto.method === PaymentMethod.BOLETO) { ... }
```
**Strategy:** Cada método de pagamento vira uma `PaymentMethodStrategy` com `createSession()` e `processCallback()`.

### 2. NotificationsService (notifications.service.ts)
**Problema:** Métodos separados `sendCancellationNotification`, `sendAlterationNotification`, `sendReminderNotification` com lógica repetida de opt-in check + template interpolation + retry.
**Strategy:** Uma `NotificationStrategy` por tipo de template, com `send()` genérico.

### 3. LoyaltyService (loyalty.service.ts)
**Problema:** switch em `calculateEarnPoints()` para EARN_APPOINTMENT, EARN_REVIEW, EARN_REFERRAL, EARN_BIRTHDAY.
**Strategy:** Cada tipo de earn vira uma `PointsEarningStrategy` com `calculate()` e `execute()`.

### 4. RecurringService (recurring.service.ts)
**Problema:** switch em `generateNextDate()` para WEEKLY, BIWEEKLY, MONTHLY.
**Strategy:** Cada padrão de recorrência vira uma `RecurrenceStrategy` com `nextDate()`.

### 5. VouchersService (vouchers.service.ts)
**Problema:** if/else chain em `applyVoucher()` para DISCOUNT_PERCENTAGE, DISCOUNT_FIXED, FREE_SERVICE, CASHBACK.
**Strategy:** Cada tipo de voucher vira uma `VoucherDiscountStrategy` com `apply()`.

---

## Fase 1: Infraestrutura Base (Strategy Contracts)

### Task 1.1: Criar estrutura de diretórios para strategies

**Objective:** Criar a estrutura de pastas para abrigar as strategies

**Files:**
- Create: `src/payments/strategies/`
- Create: `src/notifications/strategies/`
- Create: `src/loyalty/strategies/`
- Create: `src/recurring/strategies/`
- Create: `src/vouchers/strategies/`

**Step 1: Criar diretórios**

```bash
mkdir -p src/payments/strategies
mkdir -p src/notifications/strategies
mkdir -p src/loyalty/strategies
mkdir -p src/recurring/strategies
mkdir -p src/vouchers/strategies
```

**Step 2: Commit**

```bash
git add src/payments/strategies src/notifications/strategies src/loyalty/strategies src/recurring/strategies src/vouchers/strategies
git commit -m "chore: create strategy directories for refactoring"
```

---

## Fase 2: PaymentsService — Strategy Pattern

### Task 2.1: Criar interface PaymentMethodStrategy

**Objective:** Definir o contrato Strategy para métodos de pagamento

**Files:**
- Create: `src/payments/strategies/payment-method.strategy.ts`

**Step 1: Criar interface**

```typescript
// src/payments/strategies/payment-method.strategy.ts
import { PaymentSessionResult } from '../payments.service';

export interface PaymentMethodStrategy {
  readonly method: string;

  /**
   * Enriquece o resultado da sessão de pagamento com dados
   * específicos do método (qrCode, receiptUrl, etc.)
   */
  enrichSession(sessionId: string, result: PaymentSessionResult): Promise<PaymentSessionResult>;
}
```

**Step 2: Commit**

```bash
git add src/payments/strategies/payment-method.strategy.ts
git commit -m "feat(payments): add PaymentMethodStrategy interface"
```

### Task 2.2: Criar PixPaymentStrategy

**Objective:** Extrair lógica PIX para strategy concreta

**Files:**
- Create: `src/payments/strategies/pix-payment.strategy.ts`

**Step 1: Criar strategy**

```typescript
// src/payments/strategies/pix-payment.strategy.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethodStrategy } from './payment-method.strategy';
import { PaymentSessionResult } from '../payments.service';

@Injectable()
export class PixPaymentStrategy implements PaymentMethodStrategy {
  readonly method = 'PIX';

  constructor(private readonly prisma: PrismaService) {}

  async enrichSession(sessionId: string, result: PaymentSessionResult): Promise<PaymentSessionResult> {
    result.qrCode = `mock-pix-qr-${sessionId}`;

    await this.prisma.paymentSession.update({
      where: { id: sessionId },
      data: { qrCode: result.qrCode },
    });

    return result;
  }
}
```

**Step 2: Commit**

```bash
git add src/payments/strategies/pix-payment.strategy.ts
git commit -m "feat(payments): add PixPaymentStrategy"
```

### Task 2.3: Criar BoletoPaymentStrategy

**Objective:** Extrair lógica Boleto para strategy concreta

**Files:**
- Create: `src/payments/strategies/boleto-payment.strategy.ts`

**Step 1: Criar strategy**

```typescript
// src/payments/strategies/boleto-payment.strategy.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethodStrategy } from './payment-method.strategy';
import { PaymentSessionResult } from '../payments.service';

@Injectable()
export class BoletoPaymentStrategy implements PaymentMethodStrategy {
  readonly method = 'BOLETO';

  constructor(private readonly prisma: PrismaService) {}

  async enrichSession(sessionId: string, result: PaymentSessionResult): Promise<PaymentSessionResult> {
    result.receiptUrl = `http://mockboleto.com/${sessionId}`;

    await this.prisma.paymentSession.update({
      where: { id: sessionId },
      data: { receiptUrl: result.receiptUrl },
    });

    return result;
  }
}
```

**Step 2: Commit**

```bash
git add src/payments/strategies/boleto-payment.strategy.ts
git commit -m "feat(payments): add BoletoPaymentStrategy"
```

### Task 2.4: Criar CreditCardPaymentStrategy

**Objective:** Strategy para cartão de crédito (sem enriquecimento extra)

**Files:**
- Create: `src/payments/strategies/credit-card-payment.strategy.ts`

**Step 1: Criar strategy**

```typescript
// src/payments/strategies/credit-card-payment.strategy.ts
import { Injectable } from '@nestjs/common';
import { PaymentMethodStrategy } from './payment-method.strategy';
import { PaymentSessionResult } from '../payments.service';

@Injectable()
export class CreditCardPaymentStrategy implements PaymentMethodStrategy {
  readonly method = 'CREDIT_CARD';

  async enrichSession(_sessionId: string, result: PaymentSessionResult): Promise<PaymentSessionResult> {
    // Cartão de crédito não precisa de enriquecimento extra
    return result;
  }
}
```

**Step 2: Commit**

```bash
git add src/payments/strategies/credit-card-payment.strategy.ts
git commit -m "feat(payments): add CreditCardPaymentStrategy"
```

### Task 2.5: Criar PaymentStrategyFactory (registry)

**Objective:** Factory para resolver qual strategy usar dado um PaymentMethod

**Files:**
- Create: `src/payments/strategies/payment-strategy.factory.ts`

**Step 1: Criar factory**

```typescript
// src/payments/strategies/payment-strategy.factory.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentMethodStrategy } from './payment-method.strategy';
import { PixPaymentStrategy } from './pix-payment.strategy';
import { BoletoPaymentStrategy } from './boleto-payment.strategy';
import { CreditCardPaymentStrategy } from './credit-card-payment.strategy';

@Injectable()
export class PaymentStrategyFactory {
  private readonly strategies: Map<string, PaymentMethodStrategy>;

  constructor(
    private readonly pixStrategy: PixPaymentStrategy,
    private readonly boletoStrategy: BoletoPaymentStrategy,
    private readonly creditCardStrategy: CreditCardPaymentStrategy,
  ) {
    this.strategies = new Map([
      ['PIX', this.pixStrategy],
      ['BOLETO', this.boletoStrategy],
      ['CREDIT_CARD', this.creditCardStrategy],
    ]);
  }

  getStrategy(method: string): PaymentMethodStrategy {
    const strategy = this.strategies.get(method);
    if (!strategy) {
      throw new BadRequestException(`Unsupported payment method: ${method}`);
    }
    return strategy;
  }
}
```

**Step 2: Commit**

```bash
git add src/payments/strategies/payment-strategy.factory.ts
git commit -m "feat(payments): add PaymentStrategyFactory"
```

### Task 2.6: Refatorar PaymentsService para usar Strategy

**Objective:** Substituir if/else chain por chamada ao factory

**Files:**
- Modify: `src/payments/payments.service.ts`
- Modify: `src/payments/payments.module.ts`

**Step 1: Refatorar PaymentsService**

```typescript
// src/payments/payments.service.ts — trecho modificado
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly strategyFactory: PaymentStrategyFactory,
  ) {}

  async createPaymentSession(
    dto: CreatePaymentSessionDto,
  ): Promise<PaymentSessionResult> {
    if (!dto.appointmentId || dto.appointmentId === 'invalid-id') {
      throw new BadRequestException('Appointment not found');
    }

    const session = await this.prisma.paymentSession.create({
      data: {
        appointmentId: dto.appointmentId,
        status: 'PENDING',
        amount: dto.amount,
        method: dto.method,
      },
    });

    const result: PaymentSessionResult = {
      sessionId: session.id,
      status: session.status as PaymentStatus,
      amount: Number(session.amount),
      method: session.method,
      createdAt: session.createdAt,
    };

    // Strategy pattern: delega enriquecimento para a strategy do método
    const strategy = this.strategyFactory.getStrategy(dto.method);
    return strategy.enrichSession(session.id, result);
  }

  // ... resto do serviço permanece igual
}
```

**Step 2: Atualizar PaymentsModule**

```typescript
// src/payments/payments.module.ts — adicionar providers
import { PixPaymentStrategy } from './strategies/pix-payment.strategy';
import { BoletoPaymentStrategy } from './strategies/boleto-payment.strategy';
import { CreditCardPaymentStrategy } from './strategies/credit-card-payment.strategy';
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory';

@Module({
  // ... imports existentes
  providers: [
    PaymentsService,
    PixPaymentStrategy,
    BoletoPaymentStrategy,
    CreditCardPaymentStrategy,
    PaymentStrategyFactory,
  ],
  // ... exports existentes
})
export class PaymentsModule {}
```

**Step 3: Rodar testes para verificar não-regressão**

```bash
bun run test -- --testPathPattern="payments"
```

**Step 4: Commit**

```bash
git add src/payments/payments.service.ts src/payments/payments.module.ts src/payments/strategies/
git commit -m "refactor(payments): apply Strategy pattern for payment methods"
```

---

## Fase 3: VouchersService — Strategy Pattern

### Task 3.1: Criar interface VoucherDiscountStrategy

**Objective:** Definir o contrato Strategy para tipos de desconto de voucher

**Files:**
- Create: `src/vouchers/strategies/voucher-discount.strategy.ts`

**Step 1: Criar interface**

```typescript
// src/vouchers/strategies/voucher-discount.strategy.ts
export interface VoucherApplicationResult {
  discount: number;
  finalValue: number;
  type: string;
  value: number;
  cashbackAmount?: number;
  serviceName?: string;
}

export interface VoucherDiscountStrategy {
  readonly voucherType: string;

  apply(voucherValue: number, appointmentValue?: number): VoucherApplicationResult;
}
```

**Step 2: Commit**

```bash
git add src/vouchers/strategies/voucher-discount.strategy.ts
git commit -m "feat(vouchers): add VoucherDiscountStrategy interface"
```

### Task 3.2: Criar strategies concretas de voucher

**Objective:** Implementar cada tipo de desconto como strategy

**Files:**
- Create: `src/vouchers/strategies/percentage-discount.strategy.ts`
- Create: `src/vouchers/strategies/fixed-discount.strategy.ts`
- Create: `src/vouchers/strategies/free-service-discount.strategy.ts`
- Create: `src/vouchers/strategies/cashback-discount.strategy.ts`

**Step 1: PercentageDiscountStrategy**

```typescript
// src/vouchers/strategies/percentage-discount.strategy.ts
import { Injectable } from '@nestjs/common';
import { VoucherDiscountStrategy, VoucherApplicationResult } from './voucher-discount.strategy';

@Injectable()
export class PercentageDiscountStrategy implements VoucherDiscountStrategy {
  readonly voucherType = 'DISCOUNT_PERCENTAGE';

  apply(voucherValue: number, appointmentValue?: number): VoucherApplicationResult {
    const discount = appointmentValue ? (appointmentValue * voucherValue) / 100 : 0;
    return {
      discount: parseFloat(discount.toFixed(2)),
      finalValue: appointmentValue
        ? parseFloat((appointmentValue - discount).toFixed(2))
        : 0,
      type: 'percentage',
      value: voucherValue,
    };
  }
}
```

**Step 2: FixedDiscountStrategy**

```typescript
// src/vouchers/strategies/fixed-discount.strategy.ts
import { Injectable } from '@nestjs/common';
import { VoucherDiscountStrategy, VoucherApplicationResult } from './voucher-discount.strategy';

@Injectable()
export class FixedDiscountStrategy implements VoucherDiscountStrategy {
  readonly voucherType = 'DISCOUNT_FIXED';

  apply(voucherValue: number, appointmentValue?: number): VoucherApplicationResult {
    return {
      discount: parseFloat(voucherValue.toString()),
      finalValue: appointmentValue
        ? parseFloat(Math.max(0, appointmentValue - voucherValue).toFixed(2))
        : 0,
      type: 'fixed',
      value: voucherValue,
    };
  }
}
```

**Step 3: FreeServiceDiscountStrategy**

```typescript
// src/vouchers/strategies/free-service-discount.strategy.ts
import { Injectable } from '@nestjs/common';
import { VoucherDiscountStrategy, VoucherApplicationResult } from './voucher-discount.strategy';

@Injectable()
export class FreeServiceDiscountStrategy implements VoucherDiscountStrategy {
  readonly voucherType = 'FREE_SERVICE';

  apply(_voucherValue: number, appointmentValue?: number): VoucherApplicationResult {
    return {
      discount: appointmentValue || 0,
      finalValue: 0,
      type: 'free_service',
      value: 0,
    };
  }
}
```

**Step 4: CashbackDiscountStrategy**

```typescript
// src/vouchers/strategies/cashback-discount.strategy.ts
import { Injectable } from '@nestjs/common';
import { VoucherDiscountStrategy, VoucherApplicationResult } from './voucher-discount.strategy';

@Injectable()
export class CashbackDiscountStrategy implements VoucherDiscountStrategy {
  readonly voucherType = 'CASHBACK';

  apply(voucherValue: number, appointmentValue?: number): VoucherApplicationResult {
    const cashback = appointmentValue
      ? (appointmentValue * voucherValue) / 100
      : 0;
    return {
      discount: 0,
      cashbackAmount: parseFloat(cashback.toFixed(2)),
      finalValue: appointmentValue || 0,
      type: 'cashback',
      value: voucherValue,
    };
  }
}
```

**Step 5: Commit**

```bash
git add src/vouchers/strategies/
git commit -m "feat(vouchers): add concrete voucher discount strategies"
```

### Task 3.3: Criar VoucherStrategyFactory e refatorar VouchersService

**Objective:** Factory + refatoração do service

**Files:**
- Create: `src/vouchers/strategies/voucher-strategy.factory.ts`
- Modify: `src/vouchers/vouchers.service.ts`
- Modify: `src/vouchers/vouchers.module.ts`

**Step 1: Criar factory**

```typescript
// src/vouchers/strategies/voucher-strategy.factory.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { VoucherDiscountStrategy } from './voucher-discount.strategy';
import { PercentageDiscountStrategy } from './percentage-discount.strategy';
import { FixedDiscountStrategy } from './fixed-discount.strategy';
import { FreeServiceDiscountStrategy } from './free-service-discount.strategy';
import { CashbackDiscountStrategy } from './cashback-discount.strategy';

@Injectable()
export class VoucherStrategyFactory {
  private readonly strategies: Map<string, VoucherDiscountStrategy>;

  constructor(
    private readonly percentageStrategy: PercentageDiscountStrategy,
    private readonly fixedStrategy: FixedDiscountStrategy,
    private readonly freeServiceStrategy: FreeServiceDiscountStrategy,
    private readonly cashbackStrategy: CashbackDiscountStrategy,
  ) {
    this.strategies = new Map([
      ['DISCOUNT_PERCENTAGE', this.percentageStrategy],
      ['DISCOUNT_FIXED', this.fixedStrategy],
      ['FREE_SERVICE', this.freeServiceStrategy],
      ['CASHBACK', this.cashbackStrategy],
    ]);
  }

  getStrategy(voucherType: string): VoucherDiscountStrategy {
    const strategy = this.strategies.get(voucherType);
    if (!strategy) {
      throw new BadRequestException(`Unsupported voucher type: ${voucherType}`);
    }
    return strategy;
  }
}
```

**Step 2: Refatorar applyVoucher**

```typescript
// src/vouchers/vouchers.service.ts — método applyVoucher refatorado
async applyVoucher(code: string, appointmentValue?: number, userId?: string) {
  const validation = await this.validateVoucher(code, userId);
  const voucher = validation.voucher;

  // Strategy pattern: delega cálculo para a strategy do tipo
  const strategy = this.voucherStrategyFactory.getStrategy(voucher.type);
  return strategy.apply(voucher.value, appointmentValue);
}
```

**Step 3: Atualizar VouchersModule**

Adicionar providers das strategies e factory.

**Step 4: Rodar testes**

```bash
bun run test -- --testPathPattern="vouchers"
```

**Step 5: Commit**

```bash
git add src/vouchers/
git commit -m "refactor(vouchers): apply Strategy pattern for voucher discounts"
```

---

## Fase 4: LoyaltyService — Strategy Pattern

### Task 4.1: Criar interface PointsEarningStrategy

**Objective:** Definir o contrato Strategy para cálculo de pontos

**Files:**
- Create: `src/loyalty/strategies/points-earning.strategy.ts`

**Step 1: Criar interface**

```typescript
// src/loyalty/strategies/points-earning.strategy.ts
import { TransactionType } from '../enums/loyalty.enums';

export interface PointsEarningStrategy {
  readonly transactionType: TransactionType;

  calculate(context: { appointmentPrice?: number }): number;
}
```

**Step 2: Commit**

```bash
git add src/loyalty/strategies/points-earning.strategy.ts
git commit -m "feat(loyalty): add PointsEarningStrategy interface"
```

### Task 4.2: Criar strategies concretas de earning

**Objective:** Implementar cada tipo de earn como strategy

**Files:**
- Create: `src/loyalty/strategies/appointment-points.strategy.ts`
- Create: `src/loyalty/strategies/review-points.strategy.ts`
- Create: `src/loyalty/strategies/referral-points.strategy.ts`
- Create: `src/loyalty/strategies/birthday-points.strategy.ts`

**Step 1: AppointmentPointsStrategy**

```typescript
// src/loyalty/strategies/appointment-points.strategy.ts
import { Injectable } from '@nestjs/common';
import { TransactionType, POINTS_CONFIG } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';

@Injectable()
export class AppointmentPointsStrategy implements PointsEarningStrategy {
  readonly transactionType = TransactionType.EARN_APPOINTMENT;

  calculate(context: { appointmentPrice?: number }): number {
    if (!context.appointmentPrice) return 0;
    return Math.floor(context.appointmentPrice * POINTS_CONFIG.CONVERSION_RATE);
  }
}
```

**Step 2: ReviewPointsStrategy**

```typescript
// src/loyalty/strategies/review-points.strategy.ts
import { Injectable } from '@nestjs/common';
import { TransactionType, EARN_POINTS } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';

@Injectable()
export class ReviewPointsStrategy implements PointsEarningStrategy {
  readonly transactionType = TransactionType.EARN_REVIEW;

  calculate(): number {
    return EARN_POINTS.REVIEW;
  }
}
```

**Step 3: ReferralPointsStrategy**

```typescript
// src/loyalty/strategies/referral-points.strategy.ts
import { Injectable } from '@nestjs/common';
import { TransactionType, EARN_POINTS } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';

@Injectable()
export class ReferralPointsStrategy implements PointsEarningStrategy {
  readonly transactionType = TransactionType.EARN_REFERRAL;

  calculate(): number {
    return EARN_POINTS.REFERRAL;
  }
}
```

**Step 4: BirthdayPointsStrategy**

```typescript
// src/loyalty/strategies/birthday-points.strategy.ts
import { Injectable } from '@nestjs/common';
import { TransactionType, EARN_POINTS } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';

@Injectable()
export class BirthdayPointsStrategy implements PointsEarningStrategy {
  readonly transactionType = TransactionType.EARN_BIRTHDAY;

  calculate(): number {
    return EARN_POINTS.BIRTHDAY;
  }
}
```

**Step 5: Commit**

```bash
git add src/loyalty/strategies/
git commit -m "feat(loyalty): add concrete points earning strategies"
```

### Task 4.3: Criar PointsStrategyFactory e refatorar LoyaltyService

**Objective:** Factory + refatação do switch/case

**Files:**
- Create: `src/loyalty/strategies/points-strategy.factory.ts`
- Modify: `src/loyalty/loyalty.service.ts`
- Modify: `src/loyalty/loyalty.module.ts`

**Step 1: Criar factory**

```typescript
// src/loyalty/strategies/points-strategy.factory.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { TransactionType } from '../enums/loyalty.enums';
import { PointsEarningStrategy } from './points-earning.strategy';
import { AppointmentPointsStrategy } from './appointment-points.strategy';
import { ReviewPointsStrategy } from './review-points.strategy';
import { ReferralPointsStrategy } from './referral-points.strategy';
import { BirthdayPointsStrategy } from './birthday-points.strategy';

@Injectable()
export class PointsStrategyFactory {
  private readonly strategies: Map<TransactionType, PointsEarningStrategy>;

  constructor(
    private readonly appointmentStrategy: AppointmentPointsStrategy,
    private readonly reviewStrategy: ReviewPointsStrategy,
    private readonly referralStrategy: ReferralPointsStrategy,
    private readonly birthdayStrategy: BirthdayPointsStrategy,
  ) {
    this.strategies = new Map([
      [TransactionType.EARN_APPOINTMENT, this.appointmentStrategy],
      [TransactionType.EARN_REVIEW, this.reviewStrategy],
      [TransactionType.EARN_REFERRAL, this.referralStrategy],
      [TransactionType.EARN_BIRTHDAY, this.birthdayStrategy],
    ]);
  }

  getStrategy(type: TransactionType): PointsEarningStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new BadRequestException(`Unsupported transaction type: ${type}`);
    }
    return strategy;
  }
}
```

**Step 2: Refatorar calculateEarnPoints**

```typescript
// src/loyalty/loyalty.service.ts — método refatorado
async calculateEarnPoints(
  type: TransactionType,
  context: { appointmentPrice?: number },
): Promise<number> {
  const strategy = this.pointsStrategyFactory.getStrategy(type);
  return strategy.calculate(context);
}
```

**Step 3: Atualizar LoyaltyModule**

**Step 4: Rodar testes**

```bash
bun run test -- --testPathPattern="loyalty"
```

**Step 5: Commit**

```bash
git add src/loyalty/
git commit -m "refactor(loyalty): apply Strategy pattern for points calculation"
```

---

## Fase 5: RecurringService — Strategy Pattern

### Task 5.1: Criar interface RecurrenceStrategy

**Objective:** Definir o contrato Strategy para geração de datas de recorrência

**Files:**
- Create: `src/recurring/strategies/recurrence.strategy.ts`

**Step 1: Criar interface**

```typescript
// src/recurring/strategies/recurrence.strategy.ts
import { RecurrencePattern } from '../interfaces/recurring.interface';

export interface RecurrenceStrategy {
  readonly pattern: RecurrencePattern;

  nextDate(lastDate: Date): Date;
}
```

**Step 2: Commit**

```bash
git add src/recurring/strategies/recurrence.strategy.ts
git commit -m "feat(recurring): add RecurrenceStrategy interface"
```

### Task 5.2: Criar strategies concretas de recorrência

**Objective:** Implementar cada padrão de recorrência como strategy

**Files:**
- Create: `src/recurring/strategies/weekly-recurrence.strategy.ts`
- Create: `src/recurring/strategies/biweekly-recurrence.strategy.ts`
- Create: `src/recurring/strategies/monthly-recurrence.strategy.ts`

**Step 1: WeeklyRecurrenceStrategy**

```typescript
// src/recurring/strategies/weekly-recurrence.strategy.ts
import { Injectable } from '@nestjs/common';
import { RecurrencePattern } from '../interfaces/recurring.interface';
import { RecurrenceStrategy } from './recurrence.strategy';

@Injectable()
export class WeeklyRecurrenceStrategy implements RecurrenceStrategy {
  readonly pattern = RecurrencePattern.WEEKLY;

  nextDate(lastDate: Date): Date {
    const next = new Date(lastDate);
    next.setDate(next.getDate() + 7);
    return next;
  }
}
```

**Step 2: BiweeklyRecurrenceStrategy**

```typescript
// src/recurring/strategies/biweekly-recurrence.strategy.ts
import { Injectable } from '@nestjs/common';
import { RecurrencePattern } from '../interfaces/recurring.interface';
import { RecurrenceStrategy } from './recurrence.strategy';

@Injectable()
export class BiweeklyRecurrenceStrategy implements RecurrenceStrategy {
  readonly pattern = RecurrencePattern.BIWEEKLY;

  nextDate(lastDate: Date): Date {
    const next = new Date(lastDate);
    next.setDate(next.getDate() + 14);
    return next;
  }
}
```

**Step 3: MonthlyRecurrenceStrategy**

```typescript
// src/recurring/strategies/monthly-recurrence.strategy.ts
import { Injectable } from '@nestjs/common';
import { RecurrencePattern } from '../interfaces/recurring.interface';
import { RecurrenceStrategy } from './recurrence.strategy';

@Injectable()
export class MonthlyRecurrenceStrategy implements RecurrenceStrategy {
  readonly pattern = RecurrencePattern.MONTHLY;

  nextDate(lastDate: Date): Date {
    const next = new Date(lastDate);
    next.setMonth(next.getMonth() + 1);
    // Handle month-end edge case (e.g., Jan 31 -> Feb 28)
    if (next.getDate() !== lastDate.getDate()) {
      next.setDate(0);
    }
    return next;
  }
}
```

**Step 4: Commit**

```bash
git add src/recurring/strategies/
git commit -m "feat(recurring): add concrete recurrence strategies"
```

### Task 5.3: Criar RecurrenceStrategyFactory e refatorar RecurringService

**Objective:** Factory + refatoração do switch

**Files:**
- Create: `src/recurring/strategies/recurrence-strategy.factory.ts`
- Modify: `src/recurring/recurring.service.ts`
- Modify: `src/recurring/recurring.module.ts`

**Step 1: Criar factory**

```typescript
// src/recurring/strategies/recurrence-strategy.factory.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { RecurrencePattern } from '../interfaces/recurring.interface';
import { RecurrenceStrategy } from './recurrence.strategy';
import { WeeklyRecurrenceStrategy } from './weekly-recurrence.strategy';
import { BiweeklyRecurrenceStrategy } from './biweekly-recurrence.strategy';
import { MonthlyRecurrenceStrategy } from './monthly-recurrence.strategy';

@Injectable()
export class RecurrenceStrategyFactory {
  private readonly strategies: Map<RecurrencePattern, RecurrenceStrategy>;

  constructor(
    private readonly weeklyStrategy: WeeklyRecurrenceStrategy,
    private readonly biweeklyStrategy: BiweeklyRecurrenceStrategy,
    private readonly monthlyStrategy: MonthlyRecurrenceStrategy,
  ) {
    this.strategies = new Map([
      [RecurrencePattern.WEEKLY, this.weeklyStrategy],
      [RecurrencePattern.BIWEEKLY, this.biweeklyStrategy],
      [RecurrencePattern.MONTHLY, this.monthlyStrategy],
    ]);
  }

  getStrategy(pattern: RecurrencePattern): RecurrenceStrategy {
    const strategy = this.strategies.get(pattern);
    if (!strategy) {
      throw new BadRequestException(`Unsupported recurrence pattern: ${pattern}`);
    }
    return strategy;
  }
}
```

**Step 2: Refatorar generateNextDate**

```typescript
// src/recurring/recurring.service.ts — método refatorado
generateNextDate(pattern: RecurrencePattern, lastDate: Date): Date {
  const strategy = this.recurrenceStrategyFactory.getStrategy(pattern);
  return strategy.nextDate(lastDate);
}
```

**Step 3: Atualizar RecurringModule**

**Step 4: Rodar testes**

```bash
bun run test -- --testPathPattern="recurring"
```

**Step 5: Commit**

```bash
git add src/recurring/
git commit -m "refactor(recurring): apply Strategy pattern for recurrence dates"
```

---

## Fase 6: NotificationsService — Strategy Pattern

### Task 6.1: Criar interface NotificationStrategy

**Objective:** Unificar a lógica repetida de notificação em uma strategy

**Files:**
- Create: `src/notifications/strategies/notification.strategy.ts`

**Step 1: Criar interface**

```typescript
// src/notifications/strategies/notification.strategy.ts
import { NotificationTemplateType, NotificationStatus } from '../interfaces/notification.interface';

export interface NotificationSendResult {
  status: NotificationStatus;
  message?: string;
  externalId?: string;
}

export interface NotificationStrategy {
  readonly templateType: NotificationTemplateType;

  /**
   * Monta a mensagem a partir dos dados do appointment/user
   */
  buildMessage(context: NotificationContext): string;
}

export interface NotificationContext {
  appointment: any;
  user: { id: string; name: string; phone: string; whatsappOptIn: boolean };
  oldDateTime?: Date;
  newDateTime?: Date;
}
```

**Step 2: Commit**

```bash
git add src/notifications/strategies/notification.strategy.ts
git commit -m "feat(notifications): add NotificationStrategy interface"
```

### Task 6.2: Criar strategies concretas de notificação

**Objective:** Implementar cada tipo de notificação como strategy

**Files:**
- Create: `src/notifications/strategies/cancellation-notification.strategy.ts`
- Create: `src/notifications/strategies/alteration-notification.strategy.ts`
- Create: `src/notifications/strategies/reminder-notification.strategy.ts`

**Step 1: CancellationNotificationStrategy**

```typescript
// src/notifications/strategies/cancellation-notification.strategy.ts
import { Injectable } from '@nestjs/common';
import { NotificationTemplateType } from '../interfaces/notification.interface';
import { NotificationStrategy, NotificationContext } from './notification.strategy';

@Injectable()
export class CancellationNotificationStrategy implements NotificationStrategy {
  readonly templateType = NotificationTemplateType.CANCELLATION;

  buildMessage(context: NotificationContext): string {
    const { appointment, user } = context;
    return `Olá ${user.name}, sua marcação de ${
      appointment.service?.name || appointment.serviceName || 'Serviço'
    } foi cancelada. Data: ${new Date(appointment.dateTime).toLocaleString('pt-BR')}. Em caso de dúvidas, entre em contato.`;
  }
}
```

**Step 2: AlterationNotificationStrategy**

```typescript
// src/notifications/strategies/alteration-notification.strategy.ts
import { Injectable } from '@nestjs/common';
import { NotificationTemplateType } from '../interfaces/notification.interface';
import { NotificationStrategy, NotificationContext } from './notification.strategy';

@Injectable()
export class AlterationNotificationStrategy implements NotificationStrategy {
  readonly templateType = NotificationTemplateType.ALTERATION;

  buildMessage(context: NotificationContext): string {
    const { appointment, user, oldDateTime, newDateTime } = context;
    return `Olá ${user.name}, sua marcação de ${
      appointment.service?.name || appointment.serviceName || 'Serviço'
    } foi alterada. Nova hora: ${newDateTime?.toLocaleString('pt-BR')}. Anterior: ${oldDateTime?.toLocaleString('pt-BR')}.`;
  }
}
```

**Step 3: ReminderNotificationStrategy**

```typescript
// src/notifications/strategies/reminder-notification.strategy.ts
import { Injectable } from '@nestjs/common';
import { NotificationTemplateType } from '../interfaces/notification.interface';
import { NotificationStrategy, NotificationContext } from './notification.strategy';

@Injectable()
export class ReminderNotificationStrategy implements NotificationStrategy {
  readonly templateType = NotificationTemplateType.REMINDER_2H;

  buildMessage(context: NotificationContext): string {
    const { appointment, user } = context;
    return `Olá ${user.name}, lembrete: sua marcação de ${
      appointment.service?.name || appointment.serviceName || 'Serviço'
    } é em 2 horas (${new Date(appointment.dateTime).toLocaleString('pt-BR')}) na ${
      appointment.location?.name || appointment.locationName || 'Seven7Barber'
    }. Nos vemos lá!`;
  }
}
```

**Step 4: Commit**

```bash
git add src/notifications/strategies/
git commit -m "feat(notifications): add concrete notification strategies"
```

### Task 6.3: Criar NotificationStrategyFactory e refatorar NotificationsService

**Objective:** Factory + refatoração eliminando templates hardcoded e métodos duplicados

**Files:**
- Create: `src/notifications/strategies/notification-strategy.factory.ts`
- Modify: `src/notifications/notifications.service.ts`
- Modify: `src/notifications/notifications.module.ts`

**Step 1: Criar factory**

```typescript
// src/notifications/strategies/notification-strategy.factory.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { NotificationTemplateType } from '../interfaces/notification.interface';
import { NotificationStrategy } from './notification.strategy';
import { CancellationNotificationStrategy } from './cancellation-notification.strategy';
import { AlterationNotificationStrategy } from './alteration-notification.strategy';
import { ReminderNotificationStrategy } from './reminder-notification.strategy';

@Injectable()
export class NotificationStrategyFactory {
  private readonly strategies: Map<NotificationTemplateType, NotificationStrategy>;

  constructor(
    private readonly cancellationStrategy: CancellationNotificationStrategy,
    private readonly alterationStrategy: AlterationNotificationStrategy,
    private readonly reminderStrategy: ReminderNotificationStrategy,
  ) {
    this.strategies = new Map([
      [NotificationTemplateType.CANCELLATION, this.cancellationStrategy],
      [NotificationTemplateType.ALTERATION, this.alterationStrategy],
      [NotificationTemplateType.REMINDER_2H, this.reminderStrategy],
    ]);
  }

  getStrategy(templateType: NotificationTemplateType): NotificationStrategy {
    const strategy = this.strategies.get(templateType);
    if (!strategy) {
      throw new BadRequestException(`Unsupported notification template: ${templateType}`);
    }
    return strategy;
  }
}
```

**Step 2: Refatorar NotificationsService — método genérico send()**

Substituir os 3 métodos quase idênticos por um único método:

```typescript
async sendNotification(
  templateType: NotificationTemplateType,
  context: NotificationContext,
): Promise<NotificationSendResult> {
  if (!context.user.whatsappOptIn) {
    await this.logNotification({
      userId: context.user.id,
      appointmentId: context.appointment.id,
      channel: NotificationChannel.WHATSAPP,
      template: templateType,
      status: NotificationStatus.SKIPPED,
      attempts: 0,
    });
    return { status: NotificationStatus.SKIPPED };
  }

  const strategy = this.notificationStrategyFactory.getStrategy(templateType);
  const message = strategy.buildMessage(context);

  return this.sendWhatsAppWithRetry(
    context.user.phone,
    message,
    context.appointment.id,
    templateType,
  );
}

// Manter métodos legados como wrappers para backward compatibility
async sendCancellationNotification(appointment: any, user: any) {
  return this.sendNotification(NotificationTemplateType.CANCELLATION, {
    appointment, user,
  });
}

async sendAlterationNotification(appointment: any, user: any, oldDateTime: Date, newDateTime: Date) {
  return this.sendNotification(NotificationTemplateType.ALTERATION, {
    appointment, user, oldDateTime, newDateTime,
  });
}

async sendReminderNotification(appointment: any, user: any) {
  return this.sendNotification(NotificationTemplateType.REMINDER_2H, {
    appointment, user,
  });
}
```

**Step 3: Atualizar NotificationsModule**

**Step 4: Rodar testes**

```bash
bun run test -- --testPathPattern="notifications"
```

**Step 5: Commit**

```bash
git add src/notifications/
git commit -m "refactor(notifications): apply Strategy pattern for notification types"
```

---

## Fase 7: Verificação Final — Todos os Testes

### Task 7.1: Rodar suite completa de testes

**Objective:** Garantir que nenhuma regressão foi introduzida

**Step 1: Rodar todos os testes**

```bash
cd seven7barber-api && bun run test
```

**Expected:** Todos os 144 testes que passavam antes continuam passando (os 2 que já falhavam em OAuth podem continuar falhando — são pré-existentes).

**Step 2: Rodar testes com cobertura**

```bash
cd seven7barber-api && bun run test:cov
```

**Step 3: Verificar que o build funciona**

```bash
cd seven7barber-api && bun run build
```

**Step 4: Commit final**

```bash
git add -A
git commit -m "refactor: complete Strategy pattern refactoring across all services"
```

---

## Resumo das Mudasanças

| Serviço | Antes (Code Smell) | Depois (Pattern) | Strategies Criadas |
|---------|--------------------|--------------------|-------------------|
| PaymentsService | if/else chain por método | PaymentMethodStrategy | Pix, Boleto, CreditCard |
| VouchersService | if/else chain por tipo | VoucherDiscountStrategy | Percentage, Fixed, FreeService, Cashback |
| LoyaltyService | switch/case por tipo | PointsEarningStrategy | Appointment, Review, Referral, Birthday |
| RecurringService | switch/case por padrão | RecurrenceStrategy | Weekly, Biweekly, Monthly |
| NotificationsService | métodos duplicados | NotificationStrategy | Cancellation, Alteration, Reminder |

**Total de arquivos criados:** ~25 (interfaces, strategies, factories)
**Total de arquivos modificados:** ~10 (services, modules)
**Princípios aplicados:** Open/Closed Principle, Single Responsibility, Dependency Inversion

---

## Estrutura Final de Diretórios

```
src/
├── payments/
│   ├── strategies/
│   │   ├── payment-method.strategy.ts        (interface)
│   │   ├── pix-payment.strategy.ts
│   │   ├── boleto-payment.strategy.ts
│   │   ├── credit-card-payment.strategy.ts
│   │   └── payment-strategy.factory.ts
│   ├── payments.service.ts                    (refatorado)
│   └── payments.module.ts                     (atualizado)
├── vouchers/
│   ├── strategies/
│   │   ├── voucher-discount.strategy.ts       (interface)
│   │   ├── percentage-discount.strategy.ts
│   │   ├── fixed-discount.strategy.ts
│   │   ├── free-service-discount.strategy.ts
│   │   ├── cashback-discount.strategy.ts
│   │   └── voucher-strategy.factory.ts
│   ├── vouchers.service.ts                    (refatorado)
│   └── vouchers.module.ts                     (atualizado)
├── loyalty/
│   ├── strategies/
│   │   ├── points-earning.strategy.ts         (interface)
│   │   ├── appointment-points.strategy.ts
│   │   ├── review-points.strategy.ts
│   │   ├── referral-points.strategy.ts
│   │   ├── birthday-points.strategy.ts
│   │   └── points-strategy.factory.ts
│   ├── loyalty.service.ts                     (refatorado)
│   └── loyalty.module.ts                      (atualizado)
├── recurring/
│   ├── strategies/
│   │   ├── recurrence.strategy.ts             (interface)
│   │   ├── weekly-recurrence.strategy.ts
│   │   ├── biweekly-recurrence.strategy.ts
│   │   ├── monthly-recurrence.strategy.ts
│   │   └── recurrence-strategy.factory.ts
│   ├── recurring.service.ts                   (refatorado)
│   └── recurring.module.ts                    (atualizado)
└── notifications/
    ├── strategies/
    │   ├── notification.strategy.ts           (interface)
    │   ├── cancellation-notification.strategy.ts
    │   ├── alteration-notification.strategy.ts
    │   ├── reminder-notification.strategy.ts
    │   └── notification-strategy.factory.ts
    ├── notifications.service.ts               (refatorado)
    └── notifications.module.ts                (atualizado)
```
