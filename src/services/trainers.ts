import { apiRequest, apiRequestWithRefresh, type ApiResponse } from './api';

export interface Trainer {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  specializations?: string[];
  profileImage?: string;
  certifications?: string[];
  experienceYears?: number;
  rating?: number;
  totalReviews?: number;
  isActive: boolean;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
  };
  availability?: Record<string, Array<{ start: string; end: string }>>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTrainerData {
  name: string;
  title?: string;
  bio?: string;
  specializations?: string[];
  profileImage?: string;
  certifications?: string[];
  experienceYears?: number;
  availability?: Record<string, Array<{ start: string; end: string }>>;
  isActive?: boolean;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
  };
}

export interface UpdateTrainerData {
  name?: string;
  title?: string;
  bio?: string;
  specializations?: string[];
  profileImage?: string;
  certifications?: string[];
  experienceYears?: number;
  availability?: Record<string, Array<{ start: string; end: string }>>;
  isActive?: boolean;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
  };
}

class TrainerService {
  async createTrainer(data: CreateTrainerData): Promise<Trainer> {
    const response = await apiRequestWithRefresh<Trainer>('/trainers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Trainer;
  }

  async getAllTrainers(): Promise<Trainer[]> {
    const response = await apiRequestWithRefresh<Trainer[]>('/trainers', {
      method: 'GET',
    });
    return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
  }

  async getTrainerById(id: string): Promise<Trainer> {
    const response = await apiRequestWithRefresh<Trainer>(`/trainers/${id}`, {
      method: 'GET',
    });
    return response.data || response as unknown as Trainer;
  }

  async updateTrainer(id: string, data: UpdateTrainerData): Promise<Trainer> {
    const response = await apiRequestWithRefresh<Trainer>(`/trainers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data || response as unknown as Trainer;
  }

  async deleteTrainer(id: string): Promise<void> {
    await apiRequestWithRefresh(`/trainers/${id}`, {
      method: 'DELETE',
    });
  }
}

export const trainerService = new TrainerService();

