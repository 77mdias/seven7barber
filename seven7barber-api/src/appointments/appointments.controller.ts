import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import type { CreateBookingDto } from './booking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBooking(@Body() data: CreateBookingDto, @Request() req: any) {
    // Override clientId with authenticated user
    const bookingData = { ...data, clientId: req.user.userId };
    return this.bookingService.createBooking(bookingData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyAppointments(@Request() req: any) {
    return this.bookingService.getClientAppointments(req.user.userId);
  }

  @Get('summary/:id')
  @UseGuards(JwtAuthGuard)
  async getBookingSummary(@Param('id') id: string) {
    return this.bookingService.getBookingSummary(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
  ) {
    return this.bookingService.updateAppointmentStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async cancelAppointment(@Param('id') id: string) {
    return this.bookingService.cancelAppointment(id);
  }

  @Get('barber/:barberId')
  @UseGuards(JwtAuthGuard)
  async getBarberAppointments(
    @Param('barberId') barberId: string,
    @Body('date') date?: string,
  ) {
    const dateParam = date ? new Date(date) : undefined;
    return this.bookingService.getBarberAppointments(barberId, dateParam);
  }
}