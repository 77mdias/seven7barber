import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import type {
  CreatePaymentSessionDto,
  PaymentCallbackDto,
} from './payments.service';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-session')
  async createSession(@Body() dto: CreatePaymentSessionDto) {
    return this.paymentsService.createPaymentSession(dto);
  }

  @Get(':sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    return this.paymentsService.getPaymentSession(sessionId);
  }

  @Post('callback')
  async paymentCallback(@Body() dto: PaymentCallbackDto) {
    return this.paymentsService.processPaymentCallback(dto);
  }
}
