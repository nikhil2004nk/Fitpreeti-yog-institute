import { apiRequest, apiRequestWithRefresh, type ApiResponse } from './api';

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_profile_image?: string;
  booking_id?: string;
  rating: number;
  comment: string;
  reviewer_type?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  booking_id?: string;
  rating: number;
  comment: string;
  reviewer_type?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  reviewer_type?: string;
  is_approved?: boolean;
}

class ReviewService {
  async createReview(data: CreateReviewData): Promise<Review> {
    const response = await apiRequestWithRefresh<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Review;
  }

  async getAllReviews(approvedOnly: boolean = true): Promise<Review[]> {
    const url = `/reviews?approved=${approvedOnly}`;
    const response = await apiRequest<Review[]>(url, {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getApprovedReviews(): Promise<Review[]> {
    const response = await apiRequest<Review[]>('/reviews/approved', {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getPendingReviews(): Promise<Review[]> {
    const response = await apiRequestWithRefresh<Review[]>('/reviews/pending', {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getMyReviews(): Promise<Review[]> {
    const response = await apiRequestWithRefresh<Review[]>('/reviews/my-reviews', {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getReviewById(id: string): Promise<Review> {
    const response = await apiRequest<Review>(`/reviews/${id}`, {
      method: 'GET',
    });
    return response.data || response as unknown as Review;
  }

  async updateReview(id: string, data: UpdateReviewData): Promise<Review> {
    const response = await apiRequestWithRefresh<Review>(`/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Review;
  }

  async deleteReview(id: string): Promise<void> {
    await apiRequestWithRefresh(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }
}

export const reviewService = new ReviewService();

