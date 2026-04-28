import { Injectable } from '@nestjs/common';
import {
  VoucherDiscountStrategy,
  VoucherApplicationResult,
} from './voucher-discount.strategy';

@Injectable()
export class FixedDiscountStrategy implements VoucherDiscountStrategy {
  readonly voucherType = 'DISCOUNT_FIXED';

  apply(
    voucherValue: number,
    appointmentValue?: number,
  ): VoucherApplicationResult {
    return {
      discount: parseFloat(voucherValue.toString()),
      finalValue: appointmentValue
        ? parseFloat(Math.max(0, appointmentValue - voucherValue).toFixed(2))
        : 0,
      type: 'fixed',
      value: voucherValue,
    };
  }
}
