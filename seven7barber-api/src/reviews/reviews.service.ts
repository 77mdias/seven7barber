import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(data: {
    appointmentId: string;
    rating: number;
    feedback?: string;
    images?: string[];
  }) {
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if appointment exists and is completed
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed appointments');
    }

    // Check if review already exists
    const existingReview = await this.prisma.serviceHistory.findUnique({
      where: { appointmentId: data.appointmentId },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Review already exists for this appointment',
      );
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

  async getReviewsByBarber(barberId: string) {
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

  async getBarberAverageRating(barberId: string): Promise<number> {
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

  async getBarberReviewStats(barberId: string) {
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
      distribution[r.rating as keyof typeof distribution]++;
      sum += r.rating;
    });

    return {
      totalReviews: reviews.length,
      totalAppointments: total,
      averageRating: reviews.length > 0 ? sum / reviews.length : 0,
      distribution,
    };
  }
}
