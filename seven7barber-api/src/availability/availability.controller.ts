import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { GetAvailabilityDto } from './dto/get-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability(@Query() query: GetAvailabilityDto) {
    if (!query.date || !query.serviceIds?.length) {
      throw new BadRequestException('date and serviceIds are required');
    }

    const date = new Date(query.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const slots = await this.availabilityService.getAvailableSlots(
      date,
      query.serviceIds,
    );

    return {
      date: query.date,
      serviceIds: query.serviceIds,
      slots,
    };
  }
}
