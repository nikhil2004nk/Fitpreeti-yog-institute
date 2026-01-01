// Single source of truth for API configuration

// Get API base URL from environment variable
const getApiBaseUrl = (): string => {
  // In development, use relative path for Vite proxy
  if (import.meta.env.DEV) {
    return '/api/v1';
  }
  
  // In production, use environment variable or default to production backend
  return import.meta.env.VITE_API_BASE_URL || 'https://fitpreeti-yog-backend.vercel.app/api/v1';
};

// Get backend base URL (without /api/v1) for Vite proxy configuration
export const getBackendBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    // In development, check environment variable or default to localhost
    if (import.meta.env.VITE_API_BASE_URL) {
      try {
        const url = new URL(import.meta.env.VITE_API_BASE_URL);
        return `${url.protocol}//${url.host}`;
      } catch {
        return 'http://localhost:3000';
      }
    }
    return 'http://localhost:3000';
  }
  
  // In production, extract from VITE_API_BASE_URL or use production backend
  if (import.meta.env.VITE_API_BASE_URL) {
    try {
      const url = new URL(import.meta.env.VITE_API_BASE_URL);
      return `${url.protocol}//${url.host}`;
    } catch {
      return 'https://fitpreeti-yog-backend.vercel.app';
    }
  }
  return 'https://fitpreeti-yog-backend.vercel.app';
};

// Export the API base URL
export const API_BASE_URL = getApiBaseUrl();

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('  API Base URL:', API_BASE_URL);
  console.log('  Backend Base URL:', getBackendBaseUrl());
  console.log('  Mode:', import.meta.env.MODE);
  console.log('  Using Vite proxy:', import.meta.env.DEV);
}

