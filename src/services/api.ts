// API base configuration and utilities
// Base URL: http://localhost:3000/api/v1
// To override, set VITE_API_BASE_URL in .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  user?: T;
  error?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
  method?: string;
}

class ApiError extends Error {
  statusCode: number;
  data: ApiResponse;

  constructor(message: string, statusCode: number, data: ApiResponse) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // Required for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    const errorMessage = Array.isArray(data.message) 
      ? data.message.join(', ') 
      : data.message || 'Request failed';
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
};

// Token refresh helper
export const refreshAccessToken = async (): Promise<void> => {
  try {
    await apiRequest('/auth/refresh', {
      method: 'POST',
    });
  } catch (error) {
    // If refresh fails, user needs to login again
    throw error;
  }
};

// Interceptor for automatic token refresh on 401
export const apiRequestWithRefresh = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    return await apiRequest<T>(endpoint, options);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      try {
        // Try to refresh token
        await refreshAccessToken();
        // Retry original request
        return await apiRequest<T>(endpoint, options);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/#/login';
        }
        throw refreshError;
      }
    }
    throw error;
  }
};

