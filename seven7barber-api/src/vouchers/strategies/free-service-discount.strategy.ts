import { Injectable } from '@nestjs/common';
import {
  VoucherDiscountStrategy,
  VoucherApplicationResult,
} from './voucher-discount.strategy';

@Injectable()
export class FreeServiceDiscountStrategy implements VoucherDiscountStrategy {
  readonly voucherType = 'FREE_SERVICE';

  apply(
    _voucherValue: number,
    appointmentValue?: number,
  ): VoucherApplicationResult {
    return {
      discount: appointmentValue || 0,
      finalValue: 0,
      type: 'free_service',
      value: 0,
    };
  }
}
