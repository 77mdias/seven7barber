import { AvailabilityService } from './availability.service';
import { GetAvailabilityDto } from './dto/get-availability.dto';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    getAvailability(query: GetAvailabilityDto): Promise<{
        date: string;
        serviceIds: string[];
        slots: import("./availability.service").TimeSlot[];
    }>;
}
