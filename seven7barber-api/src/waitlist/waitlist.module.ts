import { Module } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WaitlistService],
  exports: [WaitlistService],
})
export class WaitlistModule {}
