import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VouchersService {
  constructor(private readonly prisma: PrismaService) {}

  async validateVoucher(code: string, userId?: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code },
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

    if (voucher.type === 'DISCOUNT_PERCENTAGE') {
      const discount = appointmentValue
        ? (appointmentValue * voucher.value) / 100
        : 0;
      return {
        discount: parseFloat(discount.toFixed(2)),
        finalValue: appointmentValue
          ? parseFloat((appointmentValue - discount).toFixed(2))
          : 0,
        type: 'percentage',
        value: voucher.value,
      };
    }

    if (voucher.type === 'DISCOUNT_FIXED') {
      const discount = voucher.value;
      return {
        discount: parseFloat(discount.toString()),
        finalValue: appointmentValue
          ? parseFloat(Math.max(0, appointmentValue - discount).toFixed(2))
          : 0,
        type: 'fixed',
        value: voucher.value,
      };
    }

    if (voucher.type === 'FREE_SERVICE') {
      return {
        discount: appointmentValue || 0,
        finalValue: 0,
        type: 'free_service',
        value: 0,
      };
    }

    if (voucher.type === 'CASHBACK') {
      const cashback = appointmentValue
        ? (appointmentValue * voucher.value) / 100
        : 0;
      return {
        discount: 0, // Cashback doesn't reduce current appointment
        cashbackAmount: parseFloat(cashback.toFixed(2)),
        finalValue: appointmentValue || 0,
        type: 'cashback',
        value: voucher.value,
      };
    }

    return { discount: 0, finalValue: appointmentValue || 0 };
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
