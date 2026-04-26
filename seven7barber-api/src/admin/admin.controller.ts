import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('appointments/today')
  async getTodayAppointments() {
    return this.adminService.getTodayAppointments();
  }

  @Get('appointments')
  async getAppointments(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('barberId') barberId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAppointments({
      startDate,
      endDate,
      status,
      barberId,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Patch('appointments/:id/status')
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateAppointmentStatus(id, status);
  }

  @Get('clients')
  async getClients(@Query('search') search?: string) {
    return this.adminService.getClients(search);
  }

  @Get('barbers')
  async getBarbers() {
    return this.adminService.getBarbers();
  }

  @Get('metrics/overview')
  async getOverviewMetrics() {
    return this.adminService.getOverviewMetrics();
  }
}
