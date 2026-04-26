import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    getAppointments(startDate?: string, endDate?: string, status?: string, barberId?: string, page?: string, limit?: string): Promise<{
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
