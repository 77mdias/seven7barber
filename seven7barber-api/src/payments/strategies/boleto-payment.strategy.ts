import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethodStrategy } from './payment-method.strategy';
import { PaymentSessionResult } from '../payments.service';

@Injectable()
export class BoletoPaymentStrategy implements PaymentMethodStrategy {
  readonly method = 'BOLETO';

  constructor(private readonly prisma: PrismaService) {}

  async enrichSession(
    sessionId: string,
    result: PaymentSessionResult,
  ): Promise<PaymentSessionResult> {
    result.receiptUrl = `http://mockboleto.com/${sessionId}`;

    await this.prisma.paymentSession.update({
      where: { id: sessionId },
      data: { receiptUrl: result.receiptUrl },
    });

    return result;
  }
}
