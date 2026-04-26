import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(body: {
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
    getBarberStats(barberId: string): Promise<{
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
    getBarberAverageRating(barberId: string): Promise<{
        averageRating: number;
    }>;
}
