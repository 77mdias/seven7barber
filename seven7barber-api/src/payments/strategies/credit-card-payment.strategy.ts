import { Injectable } from '@nestjs/common';
import { PaymentMethodStrategy } from './payment-method.strategy';
import { PaymentSessionResult } from '../payments.service';

@Injectable()
export class CreditCardPaymentStrategy implements PaymentMethodStrategy {
  readonly method = 'CREDIT_CARD';

  async enrichSession(
    _sessionId: string,
    result: PaymentSessionResult,
  ): Promise<PaymentSessionResult> {
    return result;
  }
}
