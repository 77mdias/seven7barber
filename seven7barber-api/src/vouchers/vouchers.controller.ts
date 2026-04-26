import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validateVoucher(@Body() body: { code: string }, @Req() req: any) {
    return this.vouchersService.validateVoucher(body.code, req.user.id);
  }

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  async applyVoucher(
    @Body() body: { code: string; appointmentValue?: number },
    @Req() req: any,
  ) {
    return this.vouchersService.applyVoucher(
      body.code,
      body.appointmentValue,
      req.user.id,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createVoucher(
    @Body()
    body: {
      code: string;
      type:
        | 'FREE_SERVICE'
        | 'DISCOUNT_PERCENTAGE'
        | 'DISCOUNT_FIXED'
        | 'CASHBACK';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async listVouchers() {
    return { message: 'Admin endpoint - implement with pagination' };
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deactivateVoucher(@Param('id') id: string) {
    return this.vouchersService.deactivateVoucher(id);
  }
}
