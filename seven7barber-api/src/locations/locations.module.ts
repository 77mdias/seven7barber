import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
