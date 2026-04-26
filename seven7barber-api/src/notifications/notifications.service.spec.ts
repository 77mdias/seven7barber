import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { NotificationsService, EmailType, EmailData } from './notifications.service';

// Mock email queue
const mockEmailQueue: Array<{ template: EmailType; data: EmailData; scheduledAt: Date }> = [];

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    mockEmailQueue.length = 0;
  });

  describe('sendBookingConfirmation', () => {
    const validData: EmailData = {
      appointmentId: 'appt-1',
      clientName: 'João Silva',
      clientEmail: 'joao@email.com',
      barberName: 'Carlos',
      serviceName: 'Corte',
      dateTime: new Date('2026-04-27 10:00'),
      totalPrice: 50,
    };

    it('should send booking confirmation email', async () => {
      const result = await service.sendBookingConfirmation(validData);

      expect(result.success).toBe(true);
      expect(result.sentAt).toBeInstanceOf(Date);
    });

    it('should include appointment details in email', async () => {
      const result = await service.sendBookingConfirmation(validData);

      expect(result.content).toContain('João Silva');
      expect(result.content).toContain('Corte');
      expect(result.content).toContain('Carlos');
    });

    it('should reject invalid email address', async () => {
      const invalidData = { ...validData, clientEmail: '' };

      await expect(
        service.sendBookingConfirmation(invalidData)
      ).rejects.toThrow(BadRequestException);
    });

    it('should log email content in dev mode', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await service.sendBookingConfirmation(validData);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('sendReminder', () => {
    const validData: EmailData = {
      appointmentId: 'appt-1',
      clientName: 'João Silva',
      clientEmail: 'joao@email.com',
      barberName: 'Carlos',
      serviceName: 'Corte',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      totalPrice: 50,
    };

    it('should schedule reminder for 24h before appointment', async () => {
      const result = await service.sendReminder(validData);

      expect(result.success).toBe(true);
      expect(result.scheduledFor).toBeInstanceOf(Date);
    });

    it('should calculate correct delay time', async () => {
      const result = await service.sendReminder(validData);

      const appointmentTime = validData.dateTime.getTime();
      const reminderTime = result.scheduledFor!.getTime();
      const delayMs = appointmentTime - reminderTime;

      expect(delayMs).toBe(24 * 60 * 60 * 1000); // 24 hours
    });

    it('should not send if appointment is cancelled', async () => {
      const cancelledData = { ...validData, appointmentId: 'cancelled-appt' };

      const result = await service.sendReminder(cancelledData);

      expect(result.success).toBe(false);
    });
  });

  describe('sendCancellation', () => {
    const validData: EmailData = {
      appointmentId: 'appt-1',
      clientName: 'João Silva',
      clientEmail: 'joao@email.com',
      barberName: 'Carlos',
      serviceName: 'Corte',
      dateTime: new Date(),
      totalPrice: 50,
    };

    it('should send cancellation email to client', async () => {
      const result = await service.sendCancellation(validData);

      expect(result.success).toBe(true);
      expect(result.content).toContain('cancelado');
    });

    it('should include refund information if applicable', async () => {
      const result = await service.sendCancellation(validData);

      expect(result.content).toContain('reembolso');
    });
  });

  describe('sendReviewRequest', () => {
    const validData: EmailData = {
      appointmentId: 'appt-1',
      clientName: 'João Silva',
      clientEmail: 'joao@email.com',
      barberName: 'Carlos',
      serviceName: 'Corte',
      dateTime: new Date(),
      totalPrice: 50,
    };

    it('should send review request after completion', async () => {
      const result = await service.sendReviewRequest(validData);

      expect(result.success).toBe(true);
      expect(result.content).toContain('Avaliação');
    });

    it('should include direct link to review form', async () => {
      const result = await service.sendReviewRequest(validData);

      expect(result.content).toContain('review');
      expect(result.content).toContain('appt-1');
    });
  });

  describe('queueEmail', () => {
    const validData: EmailData = {
      appointmentId: 'appt-1',
      clientName: 'João Silva',
      clientEmail: 'joao@email.com',
      barberName: 'Carlos',
      serviceName: 'Corte',
      dateTime: new Date(),
      totalPrice: 50,
    };

    it('should add email to queue with delay', async () => {
      const delay = 60 * 60 * 1000; // 1 hour
      const result = await service.queueEmail('BOOKING_CONFIRMATION', validData, delay);

      expect(result.queued).toBe(true);
      expect(result.scheduledFor).toBeInstanceOf(Date);
    });

    it('should schedule email for future processing', async () => {
      const delay = 60 * 60 * 1000; // 1 hour
      const result = await service.queueEmail('BOOKING_CONFIRMATION', validData, delay);

      const scheduledTime = result.scheduledFor!.getTime();
      const now = Date.now();
      expect(scheduledTime).toBeGreaterThan(now);
      expect(scheduledTime - now).toBe(delay);
    });
  });
});
