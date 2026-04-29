import { Module } from '@nestjs/common';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PercentageDiscountStrategy } from './strategies/percentage-discount.strategy';
import { FixedDiscountStrategy } from './strategies/fixed-discount.strategy';
import { FreeServiceDiscountStrategy } from './strategies/free-service-discount.strategy';
import { CashbackDiscountStrategy } from './strategies/cashback-discount.strategy';
import { VoucherStrategyFactory } from './strategies/voucher-strategy.factory';

@Module({
  imports: [PrismaModule],
  controllers: [VouchersController],
  providers: [
    VouchersService,
    PercentageDiscountStrategy,
    FixedDiscountStrategy,
    FreeServiceDiscountStrategy,
    CashbackDiscountStrategy,
    VoucherStrategyFactory,
  ],
  exports: [VouchersService],
})
export class VouchersModule {}
