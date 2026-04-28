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
    this.strategies = new Map<string, PaymentMethodStrategy>([
      ['PIX', this.pixStrategy],
      ['BOLETO', this.boletoStrategy],
      ['CREDIT_CARD', this.creditCardStrategy],
    ]);
  }

  getStrategy(method: string): PaymentMethodStrategy {
    const strategy = this.strategies.get(method);
    if (!strategy) {
      throw new BadRequestException(
        `Unsupported payment method: ${method}`,
      );
    }
    return strategy;
  }
}
