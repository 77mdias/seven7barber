import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createReview(data: {
        appointmentId: string;
        rating: number;
        feedback?: string;
        images?: string[];
    }): Promise<{
        id: string;
        createdAt: Date;
        rating: number;
        feedback: string | null;
        images: string[];
        appointmentId: string;
        userId: string;
    }>;
    getReviewsByBarber(barberId: string): Promise<({
        user: {
            name: string;
        };
        appointment: {
            id: string;
            service: {
                name: string;
            };
            dateTime: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        rating: number;
        feedback: string | null;
        images: string[];
        appointmentId: string;
        userId: string;
    })[]>;
    getBarberAverageRating(barberId: string): Promise<number>;
    getBarberReviewStats(barberId: string): Promise<{
        totalReviews: number;
        totalAppointments: number;
        averageRating: number;
        distribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
}
