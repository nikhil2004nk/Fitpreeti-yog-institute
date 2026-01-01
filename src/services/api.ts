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

// Track if we're currently refreshing to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// Token refresh helper
const refreshAccessToken = async (): Promise<void> => {
  // If already refreshing, wait for the existing refresh to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      await apiRequest('/auth/refresh', {
        method: 'POST',
      }, 0); // No retries for refresh token
    } catch (error) {
      // Refresh failed - clear the promise so we can try again
      refreshPromise = null;
      throw error;
    } finally {
      isRefreshing = false;
    }
  })();

  return refreshPromise;
};

// Export for use in auth service if needed
export { refreshAccessToken };

// Interceptor for automatic token refresh on 401
export const apiRequestWithRefresh = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // Step 1: Try the request with the current access_token (sent via cookies)
  try {
    return await apiRequest<T>(endpoint, options);
  } catch (error) {
    // Step 2: If we get a 401, try to refresh the token
    // Don't attempt refresh for the refresh endpoint itself or login/register
    if (error instanceof ApiError && 
        error.statusCode === 401 && 
        !endpoint.includes('/auth/refresh') &&
        !endpoint.includes('/auth/login') &&
        !endpoint.includes('/auth/register')) {
      
      try {
        // Step 3: Attempt to refresh the access token using refresh_token cookie
        await refreshAccessToken();
        
        // Step 4: Retry the original request with the new access_token
        return await apiRequest<T>(endpoint, options);
      } catch (refreshError) {
        // Refresh failed - handle based on error type
        if (refreshError instanceof ApiError) {
          // 400 = No refresh token (user never logged in or token expired)
          // 401 = Invalid refresh token (user needs to login again)
          // 429 = Rate limited (don't redirect)
          // 0 = Network error (don't redirect)
          
          // Only redirect on actual auth failures (401/403), not on missing tokens (400) or network errors
          if (refreshError.statusCode !== 429 && 
              refreshError.statusCode !== 0 &&
              refreshError.statusCode !== 400 &&
              (refreshError.statusCode === 401 || refreshError.statusCode === 403)) {
            // User had a session but refresh token is invalid - redirect to login
            if (typeof window !== 'undefined') {
              const basePath = import.meta.env.BASE_URL || '/';
              window.location.href = `${basePath}#/login`;
            }
          }
        }
        // Re-throw the original 401 error, not the refresh error
        throw error;
      }
    }
    // For non-401 errors, just re-throw
    throw error;
  }
};

