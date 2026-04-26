import { Controller, Get, Param } from '@nestjs/common';
import { BarbersService } from './barbers.service';

@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Get()
  findAvailable() {
    return this.barbersService.findAvailableBarbers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barbersService.findOne(id);
  }
}
