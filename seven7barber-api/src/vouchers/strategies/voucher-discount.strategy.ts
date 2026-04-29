export interface VoucherApplicationResult {
  discount: number;
  finalValue: number;
  type: string;
  value: number;
  cashbackAmount?: number;
  serviceName?: string;
}

export interface VoucherDiscountStrategy {
  readonly voucherType: string;

  apply(
    voucherValue: number,
    appointmentValue?: number,
  ): VoucherApplicationResult;
}
