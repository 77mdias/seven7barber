import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ServicesModule } from './services/services.module';
import { AvailabilityModule } from './availability/availability.module';
import { AdminModule } from './admin/admin.module';
import { ReviewsModule } from './reviews/reviews.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { PaymentsModule } from './payments/payments.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, EmailModule, ServicesModule, AvailabilityModule, AdminModule, ReviewsModule, VouchersModule, PaymentsModule, NotificationsModule, HealthModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
