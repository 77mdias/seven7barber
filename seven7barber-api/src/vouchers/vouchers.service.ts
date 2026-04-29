import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VoucherStrategyFactory } from './strategies/voucher-strategy.factory';

@Injectable()
export class VouchersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly voucherStrategyFactory: VoucherStrategyFactory,
  ) {}

  async validateVoucher(code: string, userId?: string) {
    // L4: Case-insensitive lookup - codes are stored uppercase
    const voucher = await this.prisma.voucher.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!voucher) {
      throw new BadRequestException('Voucher not found');
    }

    if (!voucher.isActive) {
      throw new BadRequestException('Voucher is no longer active');
    }

    if (voucher.expiresAt && voucher.expiresAt < new Date()) {
      throw new BadRequestException('Voucher has expired');
    }

    // Check minimum services requirement
    if (userId && voucher.minServices > 0) {
      const userAppointmentCount = await this.prisma.appointment.count({
        where: {
          clientId: userId,
          status: 'COMPLETED',
        },
      });

      if (userAppointmentCount < voucher.minServices) {
        throw new BadRequestException(
          `This voucher requires at least ${voucher.minServices} completed services`,
        );
      }
    }

    return {
      valid: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        type: voucher.type,
        value: parseFloat(voucher.value.toString()),
      },
    };
  }

  async applyVoucher(code: string, appointmentValue?: number, userId?: string) {
    const validation = await this.validateVoucher(code, userId);
    const voucher = validation.voucher;

    // Strategy pattern: delegate discount calculation to the voucher type strategy
    const strategy = this.voucherStrategyFactory.getStrategy(voucher.type);
    return strategy.apply(voucher.value, appointmentValue);
  }

  async createVoucher(data: {
    code: string;
    type:
      | 'FREE_SERVICE'
      | 'DISCOUNT_PERCENTAGE'
      | 'DISCOUNT_FIXED'
      | 'CASHBACK';
    value: number;
    minServices?: number;
    expiresAt?: Date;
  }) {
    return this.prisma.voucher.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type as any,
        value: data.value,
        minServices: data.minServices || 0,
        expiresAt: data.expiresAt,
        isActive: true,
      },
    });
  }

  async deactivateVoucher(id: string) {
    return this.prisma.voucher.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
