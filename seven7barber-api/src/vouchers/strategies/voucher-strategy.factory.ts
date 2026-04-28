import { Injectable, BadRequestException } from '@nestjs/common';
import { VoucherDiscountStrategy } from './voucher-discount.strategy';
import { PercentageDiscountStrategy } from './percentage-discount.strategy';
import { FixedDiscountStrategy } from './fixed-discount.strategy';
import { FreeServiceDiscountStrategy } from './free-service-discount.strategy';
import { CashbackDiscountStrategy } from './cashback-discount.strategy';

@Injectable()
export class VoucherStrategyFactory {
  private readonly strategies: Map<string, VoucherDiscountStrategy>;

  constructor(
    private readonly percentageStrategy: PercentageDiscountStrategy,
    private readonly fixedStrategy: FixedDiscountStrategy,
    private readonly freeServiceStrategy: FreeServiceDiscountStrategy,
    private readonly cashbackStrategy: CashbackDiscountStrategy,
  ) {
    this.strategies = new Map<string, VoucherDiscountStrategy>([
      ['DISCOUNT_PERCENTAGE', this.percentageStrategy],
      ['DISCOUNT_FIXED', this.fixedStrategy],
      ['FREE_SERVICE', this.freeServiceStrategy],
      ['CASHBACK', this.cashbackStrategy],
    ]);
  }

  getStrategy(voucherType: string): VoucherDiscountStrategy {
    const strategy = this.strategies.get(voucherType);
    if (!strategy) {
      throw new BadRequestException(
        `Unsupported voucher type: ${voucherType}`,
      );
    }
    return strategy;
  }
}
