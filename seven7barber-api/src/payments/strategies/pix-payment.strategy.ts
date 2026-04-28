import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethodStrategy } from './payment-method.strategy';
import { PaymentSessionResult } from '../payments.service';

@Injectable()
export class PixPaymentStrategy implements PaymentMethodStrategy {
  readonly method = 'PIX';

  constructor(private readonly prisma: PrismaService) {}

  async enrichSession(
    sessionId: string,
    result: PaymentSessionResult,
  ): Promise<PaymentSessionResult> {
    result.qrCode = `mock-pix-qr-${sessionId}`;

    await this.prisma.paymentSession.update({
      where: { id: sessionId },
      data: { qrCode: result.qrCode },
    });

    return result;
  }
}
