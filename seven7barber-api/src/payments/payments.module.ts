import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PixPaymentStrategy } from './strategies/pix-payment.strategy';
import { BoletoPaymentStrategy } from './strategies/boleto-payment.strategy';
import { CreditCardPaymentStrategy } from './strategies/credit-card-payment.strategy';
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PixPaymentStrategy,
    BoletoPaymentStrategy,
    CreditCardPaymentStrategy,
    PaymentStrategyFactory,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
