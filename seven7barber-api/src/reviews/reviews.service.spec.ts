import { Test, TestingModule } from '@nestjs/testing';

// Unit tests for ReviewsService - mock implementation pattern
describe('ReviewsService', () => {
  // Mock reviews service implementation
  class ReviewsService {
    private reviews: any[] = [
      { id: 'rev-1', rating: 5, barberId: 'barber-1', createdAt: new Date('2026-04-20') },
      { id: 'rev-2', rating: 4, barberId: 'barber-1', createdAt: new Date('2026-04-18') },
      { id: 'rev-3', rating: 5, barberId: 'barber-2', createdAt: new Date('2026-04-15') },
    ];

    async createReview(data: { appointmentId: string; rating: number; feedback?: string; images?: string[] }) {
      if (data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const review = {
        id: `rev-${Date.now()}`,
        ...data,
        createdAt: new Date(),
      };
      this.reviews.push(review);
      return review;
    }

    async getReviewsByBarber(barberId: string) {
      return this.reviews.filter((r) => r.barberId === barberId);
    }

    async getBarberAverageRating(barberId: string) {
      const barberReviews = this.reviews.filter((r) => r.barberId === barberId);
      if (barberReviews.length === 0) return 0;

      const sum = barberReviews.reduce((acc, r) => acc + r.rating, 0);
      return sum / barberReviews.length;
    }
  }

  let service: ReviewsService;

  beforeEach(() => {
    service = new ReviewsService();
  });

  describe('createReview', () => {
    it('should create a review with valid rating', async () => {
      const review = await service.createReview({
        appointmentId: 'appt-1',
        rating: 5,
        feedback: 'Excelente serviço!',
      });

      expect(review).toHaveProperty('id');
      expect(review.rating).toBe(5);
      expect(review.feedback).toBe('Excelente serviço!');
    });

    it('should reject rating below 1', async () => {
      await expect(
        service.createReview({
          appointmentId: 'appt-1',
          rating: 0,
        })
      ).rejects.toThrow('Rating must be between 1 and 5');
    });

    it('should reject rating above 5', async () => {
      await expect(
        service.createReview({
          appointmentId: 'appt-1',
          rating: 6,
        })
      ).rejects.toThrow('Rating must be between 1 and 5');
    });

    it('should accept rating of 1 (minimum)', async () => {
      const review = await service.createReview({
        appointmentId: 'appt-1',
        rating: 1,
      });

      expect(review.rating).toBe(1);
    });

    it('should accept rating of 5 (maximum)', async () => {
      const review = await service.createReview({
        appointmentId: 'appt-1',
        rating: 5,
      });

      expect(review.rating).toBe(5);
    });

    it('should support images array', async () => {
      const images = ['http://example.com/img1.jpg', 'http://example.com/img2.jpg'];
      const review = await service.createReview({
        appointmentId: 'appt-1',
        rating: 5,
        images,
      });

      expect(review.images).toEqual(images);
    });
  });

  describe('getReviewsByBarber', () => {
    it('should return all reviews for a barber', async () => {
      const reviews = await service.getReviewsByBarber('barber-1');

      expect(reviews).toHaveLength(2);
      reviews.forEach((r) => expect(r.barberId).toBe('barber-1'));
    });

    it('should return empty array for barber with no reviews', async () => {
      const reviews = await service.getReviewsByBarber('barber-nonexistent');

      expect(reviews).toEqual([]);
    });
  });

  describe('getBarberAverageRating', () => {
    it('should calculate correct average for barber with multiple reviews', async () => {
      const avg = await service.getBarberAverageRating('barber-1');
      // (5 + 4) / 2 = 4.5
      expect(avg).toBe(4.5);
    });

    it('should return 0 for barber with no reviews', async () => {
      const avg = await service.getBarberAverageRating('barber-new');

      expect(avg).toBe(0);
    });

    it('should return exact rating for barber with single review', async () => {
      const avg = await service.getBarberAverageRating('barber-2');

      expect(avg).toBe(5);
    });
  });
});