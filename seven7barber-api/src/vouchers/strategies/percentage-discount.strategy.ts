import { Injectable } from '@nestjs/common';
import {
  VoucherDiscountStrategy,
  VoucherApplicationResult,
} from './voucher-discount.strategy';

@Injectable()
export class PercentageDiscountStrategy implements VoucherDiscountStrategy {
  readonly voucherType = 'DISCOUNT_PERCENTAGE';

  apply(
    voucherValue: number,
    appointmentValue?: number,
  ): VoucherApplicationResult {
    const discount = appointmentValue
      ? (appointmentValue * voucherValue) / 100
      : 0;
    return {
      discount: parseFloat(discount.toFixed(2)),
      finalValue: appointmentValue
        ? parseFloat((appointmentValue - discount).toFixed(2))
        : 0,
      type: 'percentage',
      value: voucherValue,
    };
  }
}
