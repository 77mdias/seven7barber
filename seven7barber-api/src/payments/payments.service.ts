import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory';

export enum PaymentMethod {
  PIX = 'PIX',
  BOLETO = 'BOLETO',
  CREDIT_CARD = 'CREDIT_CARD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface CreatePaymentSessionDto {
  appointmentId: string;
  amount: number;
  method: PaymentMethod;
}

export interface PaymentCallbackDto {
  sessionId: string;
  status: 'APPROVED' | 'FAILED';
  signature: string;
}

export interface PaymentSessionResult {
  sessionId: string;
  status: PaymentStatus;
  amount: number;
  method: string;
  qrCode?: string;
  receiptUrl?: string;
  createdAt: Date;
}

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

    // Strategy pattern: delegate enrichment to the payment method strategy
    const strategy = this.strategyFactory.getStrategy(dto.method);
    return strategy.enrichSession(session.id, result);
  }

  async processPaymentCallback(
    dto: PaymentCallbackDto,
  ): Promise<{ sessionId: string; status: PaymentStatus }> {
    const session = await this.prisma.paymentSession.findUnique({
      where: { id: dto.sessionId },
    });

    if (!session) {
      throw new NotFoundException('Payment session not found');
    }

    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new BadRequestException('Payment webhook secret not configured');
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify({ sessionId: dto.sessionId, status: dto.status }))
      .digest('hex');

    if (dto.signature !== expectedSignature) {
      throw new BadRequestException('Invalid signature');
    }

    const updated = await this.prisma.paymentSession.update({
      where: { id: dto.sessionId },
      data: { status: dto.status as any },
    });

    return {
      sessionId: updated.id,
      status: updated.status as PaymentStatus,
    };
  }

  async getPaymentSession(sessionId: string) {
    const session = await this.prisma.paymentSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Payment session not found');
    }

    return {
      sessionId: session.id,
      status: session.status as PaymentStatus,
      amount: Number(session.amount),
      method: session.method,
      updatedAt: session.updatedAt,
    };
  }
}
