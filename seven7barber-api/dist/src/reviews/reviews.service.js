"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(data) {
        if (data.rating < 1 || data.rating > 5) {
            throw new common_1.BadRequestException('Rating must be between 1 and 5');
        }
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: data.appointmentId },
        });
        if (!appointment) {
            throw new common_1.BadRequestException('Appointment not found');
        }
        if (appointment.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Can only review completed appointments');
        }
        const existingReview = await this.prisma.serviceHistory.findUnique({
            where: { appointmentId: data.appointmentId },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('Review already exists for this appointment');
        }
        return this.prisma.serviceHistory.create({
            data: {
                rating: data.rating,
                feedback: data.feedback,
                images: data.images || [],
                appointmentId: data.appointmentId,
                userId: appointment.clientId,
            },
        });
    }
    async getReviewsByBarber(barberId) {
        return this.prisma.serviceHistory.findMany({
            where: {
                appointment: {
                    barberId,
                },
            },
            include: {
                appointment: {
                    select: {
                        id: true,
                        dateTime: true,
                        service: { select: { name: true } },
                    },
                },
                user: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getBarberAverageRating(barberId) {
        const result = await this.prisma.serviceHistory.aggregate({
            where: {
                appointment: {
                    barberId,
                },
            },
            _avg: { rating: true },
            _count: true,
        });
        return result._avg.rating || 0;
    }
    async getBarberReviewStats(barberId) {
        const [reviews, total] = await Promise.all([
            this.prisma.serviceHistory.findMany({
                where: { appointment: { barberId } },
                select: { rating: true },
            }),
            this.prisma.appointment.count({
                where: { barberId, status: 'COMPLETED' },
            }),
        ]);
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let sum = 0;
        reviews.forEach((r) => {
            distribution[r.rating]++;
            sum += r.rating;
        });
        return {
            totalReviews: reviews.length,
            totalAppointments: total,
            averageRating: reviews.length > 0 ? sum / reviews.length : 0,
            distribution,
        };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map