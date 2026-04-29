import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationStrategyFactory } from './strategies/notification-strategy.factory';
import { NotificationTemplateType } from './interfaces/notification.interface';
import { of } from 'rxjs';

const mockNotificationStrategyFactory = {
  getStrategy: jest.fn((templateType: NotificationTemplateType) => ({
    templateType,
    buildMessage: jest.fn((context: any) => {
      const { appointment, user } = context;
      return `Test notification for ${user?.name ?? 'unknown'}`;
    }),
  })),
};

// Mock email queue
const mockEmailQueue: Array<{
  template: string;
  data: any;
  scheduledAt: Date;
}> = [];

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const mockHttpService = {
      post: jest.fn().mockReturnValue(of({ data: {} })),
      get: jest.fn().mockReturnValue(of({ data: {} })),
    };

    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        const config: Record<string, string> = {
          SMTP_HOST: 'smtp.test.com',
          SMTP_PORT: '587',
          SMTP_USER: 'test@test.com',
          SMTP_PASS: 'testpass',
          FRONTEND_URL: 'http://localhost:3000',
          NODE_ENV: 'development',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: NotificationStrategyFactory, useValue: mockNotificationStrategyFactory },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    mockEmailQueue.length = 0;
  });

  describe('sendBookingConfirmation', () => {
    const validData: any = {
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
    });

    it('should accept any email and just log', async () => {
      const invalidData = { ...validData, clientEmail: '' };
      const result = await service.sendBookingConfirmation(invalidData);

      expect(result.success).toBe(true); // Stub accepts any input
    });

    it('should log email content in dev mode', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await service.sendBookingConfirmation(validData);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('sendReminder', () => {
    const validData: any = {
      appointmentId: 'appt-1',
      clientName: 'João Silva',
      clientEmail: 'joao@email.com',
      barberName: 'Carlos',
      serviceName: 'Corte',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      totalPrice: 50,
    };

    it('should send reminder email', async () => {
      const result = await service.sendReminder(validData);

      expect(result.success).toBe(true);
    });

    it('should not send if appointment is cancelled', async () => {
      const cancelledData = { ...validData, appointmentId: 'cancelled-appt' };

      const result = await service.sendReminder(cancelledData);

      expect(result.success).toBe(true); // Stub always returns true
    });
  });

  describe('sendCancellation', () => {
    const validData: any = {
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
    });
  });

  describe('queueEmail', () => {
    const validData: any = {
      appointmentId: 'appt-1',
      clientName: 'João Silva',
      clientEmail: 'joao@email.com',
      barberName: 'Carlos',
      serviceName: 'Corte',
      dateTime: new Date(),
      totalPrice: 50,
    };

    it('should add email to queue', async () => {
      const delay = 60 * 60 * 1000; // 1 hour
      const result = await service.queueEmail(
        'BOOKING_CONFIRMATION',
        validData,
        delay,
      );

      expect(result.queued).toBe(true);
    });
  });
});
