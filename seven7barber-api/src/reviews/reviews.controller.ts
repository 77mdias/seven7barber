import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(
    @Body()
    body: {
      appointmentId: string;
      rating: number;
      feedback?: string;
      images?: string[];
    },
  ) {
    return this.reviewsService.createReview(body);
  }

  @Get('barber/:barberId')
  async getReviewsByBarber(@Param('barberId') barberId: string) {
    return this.reviewsService.getReviewsByBarber(barberId);
  }

  @Get('barber/:barberId/stats')
  async getBarberStats(@Param('barberId') barberId: string) {
    return this.reviewsService.getBarberReviewStats(barberId);
  }

  @Get('barber/:barberId/average')
  async getBarberAverageRating(@Param('barberId') barberId: string) {
    const avg = await this.reviewsService.getBarberAverageRating(barberId);
    return { averageRating: avg };
  }
}