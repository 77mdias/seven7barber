import { PrismaService } from '../prisma/prisma.service';
export interface TimeSlot {
    time: string;
    barberId: string;
    barberName: string;
    date: string;
}
interface WorkingHours {
    start: string;
    end: string;
    bufferMinutes: number;
}
export declare class AvailabilityService {
    private readonly prisma;
    private readonly DEFAULT_WORKING_HOURS;
    constructor(prisma: PrismaService);
    getAvailableSlots(date: Date, serviceIds: string[]): Promise<TimeSlot[]>;
    getWorkingHours(): WorkingHours;
}
export {};
