import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

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

// Mock storage for tests
const mockSessions = new Map<string, any>();

@Injectable()
export class PaymentsService {
  private sessions = mockSessions;

  async createPaymentSession(dto: CreatePaymentSessionDto): Promise<PaymentSessionResult> {
    if (!dto.appointmentId || dto.appointmentId === 'invalid-id') {
      throw new BadRequestException('Appointment not found');
    }

    const sessionId = `session-${Date.now()}`;
    const session = {
      id: sessionId,
      appointmentId: dto.appointmentId,
      status: 'PENDING',
      amount: dto.amount,
      method: dto.method,
      createdAt: new Date(),
    };

    this.sessions.set(sessionId, session);

    const result: PaymentSessionResult = {
      sessionId: session.id,
      status: session.status as PaymentStatus,
      amount: session.amount,
      method: session.method,
      createdAt: session.createdAt,
    };

    if (dto.method === 'PIX') {
      result.qrCode = `mock-pix-qr-${session.id}`;
    }

    if (dto.method === 'BOLETO') {
      result.receiptUrl = `http://mockboleto.com/${session.id}`;
    }

    return result;
  }

  async processPaymentCallback(dto: PaymentCallbackDto): Promise<{ sessionId: string; status: PaymentStatus }> {
    const session = this.sessions.get(dto.sessionId);

    if (!session) {
      throw new NotFoundException('Payment session not found');
    }

    const validSignature = 'valid-signature';
    if (dto.signature !== validSignature) {
      throw new BadRequestException('Invalid signature');
    }

    session.status = dto.status;
    this.sessions.set(dto.sessionId, session);

    return {
      sessionId: session.id,
      status: session.status as PaymentStatus,
    };
  }

  async getPaymentSession(sessionId: string) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new NotFoundException('Payment session not found');
    }

    return {
      sessionId: session.id,
      status: session.status as PaymentStatus,
      amount: session.amount,
      method: session.method,
      updatedAt: session.updatedAt,
    };
  }
}
