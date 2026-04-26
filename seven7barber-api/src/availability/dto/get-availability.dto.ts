import { IsDateString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAvailabilityDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @Transform(({ value }) => value.split(',').map((s: string) => s.trim()))
  @IsNotEmpty()
  serviceIds: string[];
}
