import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { VouchersService } from './vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post('validate')
  async validateVoucher(
    @Body() body: { code: string; userId?: string },
  ) {
    return this.vouchersService.validateVoucher(body.code, body.userId);
  }

  @Post('apply')
  async applyVoucher(
    @Body() body: { code: string; appointmentValue?: number; userId?: string },
  ) {
    return this.vouchersService.applyVoucher(
      body.code,
      body.appointmentValue,
      body.userId,
    );
  }

  @Post()
  async createVoucher(
    @Body()
    body: {
      code: string;
      type: 'FREE_SERVICE' | 'DISCOUNT_PERCENTAGE' | 'DISCOUNT_FIXED' | 'CASHBACK';
      value: number;
      minServices?: number;
      expiresAt?: string;
    },
  ) {
    return this.vouchersService.createVoucher({
      ...body,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });
  }

  @Get()
  async listVouchers() {
    // For admin use
    return { message: 'Admin endpoint - implement with pagination' };
  }

  @Patch(':id/deactivate')
  async deactivateVoucher(@Param('id') id: string) {
    return this.vouchersService.deactivateVoucher(id);
  }
}