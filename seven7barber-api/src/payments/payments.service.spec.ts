import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory';

function computeSignature(sessionId: string, status: string): string {
  return crypto
    .createHmac('sha256', process.env.PAYMENT_WEBHOOK_SECRET || 'test-secret')
    .update(JSON.stringify({ sessionId, status }))
    .digest('hex');
}

const createMockStrategy = (method: string) => ({
  method,
  enrichSession: jest.fn((sessionId: string, result: any) => {
    if (method === 'PIX') {
      result.qrCode = `mock-pix-qr-${sessionId}`;
    }
    if (method === 'BOLETO') {
      result.receiptUrl = `http://mockboleto.com/${sessionId}`;
    }
    return Promise.resolve(result);
  }),
});

const mockPaymentStrategyFactory = {
  getStrategy: jest.fn((method: string) => createMockStrategy(method)),
};

const mockSessions = new Map<string, any>();

const mockPrismaService = {
  paymentSession: {
    create: jest.fn(({ data }) => {
      const id = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const session = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockSessions.set(id, session);
      return session;
    }),
    update: jest.fn(({ where, data }) => {
      const existing = mockSessions.get(where.id) || {};
      const updated = { ...existing, ...data, updatedAt: new Date() };
      mockSessions.set(where.id, updated);
      return updated;
    }),
    findUnique: jest.fn(({ where }) => {
      return mockSessions.get(where.id) || null;
    }),
  },
};

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    mockSessions.clear();
    jest.clearAllMocks();
    process.env.PAYMENT_WEBHOOK_SECRET = 'test-webhook-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaymentStrategyFactory, useValue: mockPaymentStrategyFactory },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('createPaymentSession', () => {
    it('should create session with PENDING status', async () => {
      const result = await service.createPaymentSession({
        appointmentId: 'appt-1',
        amount: 100,
        method: 'CREDIT_CARD',
      });

      expect(result).toHaveProperty('sessionId');
      expect(result.status).toBe('PENDING');
      expect(result.amount).toBe(100);
      expect(result.method).toBe('CREDIT_CARD');
    });

    it('should reject invalid appointmentId', async () => {
      await expect(
        service.createPaymentSession({
          appointmentId: 'invalid-id',
          amount: 100,
          method: 'CREDIT_CARD',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should generate qrCode for PIX method', async () => {
      const result = await service.createPaymentSession({
        appointmentId: 'appt-1',
        amount: 100,
        method: 'PIX',
      });

      expect(result.qrCode).toBeDefined();
      expect(result.qrCode).toContain('mock-pix-qr-');
    });

    it('should generate receiptUrl for BOLETO method', async () => {
      const result = await service.createPaymentSession({
        appointmentId: 'appt-1',
        amount: 100,
        method: 'BOLETO',
      });

      expect(result.receiptUrl).toBeDefined();
      expect(result.receiptUrl).toContain('mockboleto.com');
    });
  });

  describe('processPaymentCallback', () => {
    it('should update session to APPROVED', async () => {
      const createResult = await service.createPaymentSession({
        appointmentId: 'appt-1',
        amount: 100,
        method: 'CREDIT_CARD',
      });

      const result = await service.processPaymentCallback({
        sessionId: createResult.sessionId,
        status: 'APPROVED',
        signature: computeSignature(createResult.sessionId, 'APPROVED'),
      });

      expect(result.status).toBe('APPROVED');
    });

    it('should update session to FAILED', async () => {
      const createResult = await service.createPaymentSession({
        appointmentId: 'appt-1',
        amount: 100,
        method: 'CREDIT_CARD',
      });

      const result = await service.processPaymentCallback({
        sessionId: createResult.sessionId,
        status: 'FAILED',
        signature: computeSignature(createResult.sessionId, 'FAILED'),
      });

      expect(result.status).toBe('FAILED');
    });

    it('should reject invalid signature', async () => {
      const createResult = await service.createPaymentSession({
        appointmentId: 'appt-1',
        amount: 100,
        method: 'CREDIT_CARD',
      });

      await expect(
        service.processPaymentCallback({
          sessionId: createResult.sessionId,
          status: 'APPROVED',
          signature: 'invalid-signature',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw for non-existent session', async () => {
      await expect(
        service.processPaymentCallback({
          sessionId: 'invalid-session',
          status: 'APPROVED',
          signature: 'any-signature',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPaymentSession', () => {
    it('should return session by id', async () => {
      const createResult = await service.createPaymentSession({
        appointmentId: 'appt-1',
        amount: 100,
        method: 'CREDIT_CARD',
      });

      const result = await service.getPaymentSession(createResult.sessionId);

      expect(result).toHaveProperty('sessionId', createResult.sessionId);
      expect(result).toHaveProperty('status', 'PENDING');
    });

    it('should throw for non-existent session', async () => {
      await expect(service.getPaymentSession('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
