import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Req() req: Request,
    @Body()
    body: {
      appointmentId: string;
      rating: number;
      feedback?: string;
      images?: string[];
    },
  ) {
    const userId = (req.user as any)?.id;
    if (!userId) {
      throw new ForbiddenException('User not found in token');
    }
    return this.reviewsService.createReview(body, userId);
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
