import { PaymentSessionResult } from '../payments.service';

export interface PaymentMethodStrategy {
  readonly method: string;

  enrichSession(
    sessionId: string,
    result: PaymentSessionResult,
  ): Promise<PaymentSessionResult>;
}
