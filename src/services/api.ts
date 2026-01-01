// API base configuration and utilities
// Import from single source of truth
import { API_BASE_URL } from '../config/api';

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

  // Log request details in development
  if (import.meta.env.DEV && retryCount === 0) {
    const logData: any = {
      method: options.method || 'GET',
      url,
      credentials: 'include',
      hasBody: !!options.body,
    };
    
    // Log request body (sanitized for sensitive endpoints)
    if (options.body && typeof options.body === 'string') {
      try {
        const bodyObj = JSON.parse(options.body);
        if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
          // Sanitize sensitive data
          logData.body = {
            ...bodyObj,
            pin: bodyObj.pin ? '*'.repeat(bodyObj.pin.length) : undefined,
            password: bodyObj.password ? '*'.repeat(bodyObj.password.length) : undefined,
          };
        } else {
          logData.body = bodyObj;
        }
      } catch {
        logData.body = '[non-JSON body]';
      }
    }
    
    console.log(`📡 API Request:`, logData);
  }
  
  // Log in production for debugging cookie issues
  if (!import.meta.env.DEV && retryCount === 0 && endpoint.includes('/auth/')) {
    console.log(`📡 API Request: ${options.method || 'GET'} ${url}`, {
      credentials: 'include',
      origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
    });
  }

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      });

      // Log response details in development
      if (import.meta.env.DEV && retryCount === 0) {
        console.log(`📥 API Response: ${options.method || 'GET'} ${url}`, {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
        });
      }
      
      // Log cookie headers in production for debugging
      if (!import.meta.env.DEV && retryCount === 0 && endpoint.includes('/auth/')) {
        const setCookieHeaders = response.headers.get('set-cookie');
        if (setCookieHeaders) {
          console.log('🍪 Set-Cookie headers received:', setCookieHeaders);
          console.log('⚠️  If cookies are not working, check backend CORS and cookie settings:');
          console.log('   1. Backend must set cookies with SameSite=None; Secure');
          console.log('   2. Backend CORS must allow your GitHub Pages domain');
          console.log('   3. Backend CORS must allow credentials: true');
        } else {
          console.warn('⚠️  No Set-Cookie headers in response. Cookies may not be set by backend.');
        }
      }

      // Handle non-JSON responses (e.g., CORS errors)
      let data: ApiResponse<T>;
      const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, read as text
        const text = await response.text();
        throw new ApiError(
          `Invalid JSON response from server: ${text || response.statusText}`,
          response.status,
          { error: text || response.statusText, statusCode: response.status }
        );
      }
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
      // Enhanced error logging for development
      // Skip logging 401 errors for /auth/profile (expected when not logged in)
      const isExpected401 = response.status === 401 && endpoint.includes('/auth/profile');
      
      if (import.meta.env.DEV && !isExpected401) {
        console.error(`❌ API Error [${response.status}]:`, {
          endpoint,
          url,
          status: response.status,
          statusText: response.statusText,
        });
        // Log error data separately for better readability
        console.error('Error Response Data:', data);
        // Log response headers if needed
        if (response.status >= 500) {
          console.error('Response Headers:', Object.fromEntries(response.headers.entries()));
        }
      }
      
      const errorMessage = Array.isArray(data.message) 
        ? data.message.join(', ') 
        : data.message || data.error || `Request failed with status ${response.status}`;
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
let refreshFailed = false; // Track if refresh has permanently failed (400 = no token)

// Token refresh helper
const refreshAccessToken = async (): Promise<void> => {
  // If refresh already failed (400 = no refresh token), don't try again
  if (refreshFailed) {
    throw new ApiError('No refresh token available', 400, { error: 'No refresh token' });
  }

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
      // If refresh failed with 400 (no refresh token), mark as permanently failed
      if (error instanceof ApiError && error.statusCode === 400) {
        refreshFailed = true;
      }
      // Clear the promise so we can try again (unless it's 400)
      if (!refreshFailed) {
        refreshPromise = null;
      }
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
    // Also skip if refresh has already failed (400 = no refresh token)
    if (error instanceof ApiError && 
        error.statusCode === 401 && 
        !endpoint.includes('/auth/refresh') &&
        !endpoint.includes('/auth/login') &&
        !endpoint.includes('/auth/register') &&
        !refreshFailed) {
      
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
          
          // For 400 (no refresh token), just fail silently - user is not authenticated
          if (refreshError.statusCode === 400) {
            // Don't retry, just throw the original 401 error
            throw error;
          }
          
          // Only redirect on actual auth failures (401/403), not on network errors
          if (refreshError.statusCode !== 429 && 
              refreshError.statusCode !== 0 &&
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

// Reset refresh failed flag (call this after successful login)
export const resetRefreshFailed = () => {
  refreshFailed = false;
  refreshPromise = null;
};

