import { Injectable } from '@nestjs/common';
import {
  VoucherDiscountStrategy,
  VoucherApplicationResult,
} from './voucher-discount.strategy';

@Injectable()
export class CashbackDiscountStrategy implements VoucherDiscountStrategy {
  readonly voucherType = 'CASHBACK';

  apply(
    voucherValue: number,
    appointmentValue?: number,
  ): VoucherApplicationResult {
    const cashback = appointmentValue
      ? (appointmentValue * voucherValue) / 100
      : 0;
    return {
      discount: 0,
      cashbackAmount: parseFloat(cashback.toFixed(2)),
      finalValue: appointmentValue || 0,
      type: 'cashback',
      value: voucherValue,
    };
  }
}
