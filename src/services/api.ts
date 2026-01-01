// API base configuration and utilities
// In development, use relative path which will be proxied by Vite to avoid CORS
// In production, use the full URL from environment variable
const API_BASE_URL = import.meta.env.DEV
  ? '/api/v1' // Use proxy in development
  : (import.meta.env.VITE_API_BASE_URL || 'https://fitpreeti-yog-backend.vercel.app/api/v1');

// Debug: Log the API base URL being used (remove in production)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Mode:', import.meta.env.MODE);
  console.log('Using Vite proxy for CORS:', import.meta.env.DEV);
}

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

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry configuration for rate limiting
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // Required for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    // Handle non-JSON responses (e.g., CORS errors)
    let data: ApiResponse<T>;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If response is not JSON, create a generic error response
      const text = await response.text();
      throw new ApiError(
        `Server returned non-JSON response: ${text || response.statusText}`,
        response.status,
        { error: text || response.statusText, statusCode: response.status }
      );
    }

    // Handle 429 (Too Many Requests) with retry logic
    if (response.status === 429 && retryCount < MAX_RETRIES) {
      // Get retry-after header if available, otherwise use exponential backoff
      const retryAfter = response.headers.get('retry-after');
      const delayMs = retryAfter 
        ? parseInt(retryAfter) * 1000 
        : INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      
      if (import.meta.env.DEV) {
        console.warn(`Rate limited (429). Retrying in ${delayMs}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      }
      
      await delay(delayMs);
      return apiRequest<T>(endpoint, options, retryCount + 1);
    }

    if (!response.ok) {
      const errorMessage = Array.isArray(data.message) 
        ? data.message.join(', ') 
        : data.message || 'Request failed';
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    // Handle network errors (including CORS)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Network error: Unable to connect to the server. Please check your internet connection and ensure the backend is running.',
        0,
        { error: error.message }
      );
    }
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0,
      { error: String(error) }
    );
  }
};

// Token refresh helper (no retries to avoid infinite loops)
export const refreshAccessToken = async (): Promise<void> => {
  try {
    await apiRequest('/auth/refresh', {
      method: 'POST',
    }, 0); // No retries for refresh token
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
    // Only attempt refresh on 401, and don't retry if refresh endpoint itself fails
    // Also skip refresh if the original error was 400 (bad request - likely no token)
    if (error instanceof ApiError && 
        error.statusCode === 401 && 
        !endpoint.includes('/auth/refresh') &&
        !endpoint.includes('/auth/profile')) {
      try {
        // Try to refresh token (don't retry on 429/500 for refresh endpoint)
        await apiRequest('/auth/refresh', {
          method: 'POST',
        }, 0); // No retries for refresh token
        // Retry original request
        return await apiRequest<T>(endpoint, options);
      } catch (refreshError) {
        // Refresh failed - don't redirect on 400 (no refresh token) or network errors
        // Only redirect on actual auth errors (401/403) when user was previously authenticated
        if (refreshError instanceof ApiError && 
            refreshError.statusCode !== 429 && 
            refreshError.statusCode !== 0 &&
            refreshError.statusCode !== 400 &&
            (refreshError.statusCode === 401 || refreshError.statusCode === 403)) {
          if (typeof window !== 'undefined') {
            // Use base URL for proper routing in GitHub Pages
            const basePath = import.meta.env.BASE_URL || '/';
            window.location.href = `${basePath}#/login`;
          }
        }
        // Re-throw the original error, not the refresh error
        throw error;
      }
    }
    throw error;
  }
};

