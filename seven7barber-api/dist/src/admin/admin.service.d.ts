import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTodayAppointments(): Promise<({
        service: {
            id: string;
            name: string;
            duration: number;
            price: import("@prisma/client/runtime/client").Decimal;
        };
        barber: {
            id: string;
            name: string;
        };
        client: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateTime: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        notes: string | null;
        barberId: string;
        serviceId: string;
        clientId: string;
    })[]>;
    getAppointments(filters: {
        startDate?: string;
        endDate?: string;
        status?: string;
        barberId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        appointments: ({
            service: {
                id: string;
                name: string;
                price: import("@prisma/client/runtime/client").Decimal;
            };
            barber: {
                id: string;
                name: string;
            };
            client: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dateTime: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            barberId: string;
            serviceId: string;
            clientId: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateAppointmentStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateTime: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        notes: string | null;
        barberId: string;
        serviceId: string;
        clientId: string;
    }>;
    getClients(search?: string): Promise<{
        id: string;
        name: string;
        email: string;
        appointmentCount: any;
        createdAt: Date;
    }[]>;
    getBarbers(): Promise<{
        id: string;
        name: string;
        image: string | null;
        totalAppointments: number;
        avgRating: number;
        specialties: string[];
    }[]>;
    getOverviewMetrics(): Promise<{
        todayAppointments: number;
        weekRevenue: number;
        completionRate: number;
        avgRating: number;
    }>;
}
