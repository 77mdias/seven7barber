import { Controller, Get, Query, Param, Patch, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
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