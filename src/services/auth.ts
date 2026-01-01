import { apiRequest, apiRequestWithRefresh, resetRefreshFailed, type ApiResponse } from './api';
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
    try {
      if (import.meta.env.DEV) {
        console.log('🔐 Attempting login:', { phone: phone.replace(/\d(?=\d{4})/g, '*'), pinLength: pin.length });
      }
      
      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, pin }),
      });
      
      // Reset refresh failed flag after successful login
      resetRefreshFailed();
      
      if (import.meta.env.DEV) {
        console.log('✅ Login successful');
        // Check if cookies are available (note: httpOnly cookies won't be accessible via JS)
        // But we can check if the response had Set-Cookie headers
        console.log('🍪 Note: Cookies should be set automatically by the browser');
        console.log('🍪 If subsequent requests fail with 401, cookies may not be set correctly');
      }
      
      return response;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('❌ Login failed:', {
          statusCode: error?.statusCode,
          message: error?.message,
          error: error?.data,
        });
      }
      throw error;
    }
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiRequestWithRefresh<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  // Get profile with automatic token refresh (redirects on failure)
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

  // Get profile without redirecting (for initial auth check)
  async getProfileSilent(): Promise<User | null> {
    try {
      const response = await apiRequest<{ user: User; message: string }>('/auth/profile', {
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
      
      return user || null;
    } catch (error: any) {
      // Silently fail - user is not authenticated
      // 401 is expected for unauthenticated users, so we don't log it
      // Only log unexpected errors in development
      if (import.meta.env.DEV && error?.statusCode !== 401) {
        console.debug('getProfileSilent: User not authenticated', error?.statusCode || 'network error');
      }
      return null;
    }
  }

  async refreshToken(): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/auth/refresh', {
      method: 'POST',
    });
  }
}

export const authService = new AuthService();

