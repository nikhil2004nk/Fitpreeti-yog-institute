import { apiRequest, apiRequestWithRefresh, type ApiResponse } from './api';
import type { User, RegisterData } from '../types';

export interface AuthResponse {
  message: string;
  user?: User;
  data?: {
    message: string;
    user?: User;
  };
}

class AuthService {
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(phone: string, pin: string): Promise<ApiResponse<AuthResponse>> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, pin }),
    });
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiRequestWithRefresh<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<User> {
    const response = await apiRequestWithRefresh<{ user: User; message: string }>('/auth/profile', {
      method: 'GET',
    });
    // Handle nested response structure: response.data.user or response.user
    const data = response.data as unknown;
    let user: User | undefined;
    
    // Check if response.data has a user property (nested structure)
    if (data && typeof data === 'object' && data !== null && 'user' in data) {
      user = (data as { user: User; message: string }).user;
    } 
    // Check if user is directly in response
    else if (response.user) {
      user = response.user as unknown as User;
    }
    
    if (!user) {
      throw new Error('User data not found in profile response');
    }
    return user;
  }

  async refreshToken(): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/auth/refresh', {
      method: 'POST',
    });
  }
}

export const authService = new AuthService();

