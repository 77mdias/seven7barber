import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    // Clear mock storage between tests
    // Note: In real implementation, this would clear the Map
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
        })
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
        signature: 'valid-signature',
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
        signature: 'valid-signature',
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
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw for non-existent session', async () => {
      await expect(
        service.processPaymentCallback({
          sessionId: 'invalid-session',
          status: 'APPROVED',
          signature: 'any-signature',
        })
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
        NotFoundException
      );
    });
  });
});
