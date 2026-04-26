import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, CreateServiceSchema } from './dto/create-service.dto';
import { UpdateServiceDto, UpdateServiceSchema } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateServiceDto) {
    const parsed = CreateServiceSchema.parse(dto);
    return this.servicesService.create(parsed);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    const parsed = UpdateServiceSchema.parse(dto);
    return this.servicesService.update(id, parsed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
