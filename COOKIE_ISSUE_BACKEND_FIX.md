# Cookie Issue - Backend Configuration Required

## Problem
Login is successful (201 Created), but cookies are not being stored/forwarded, causing 401 errors on subsequent requests.

## Root Cause
This is a **cross-origin cookie issue**. When the frontend (GitHub Pages) makes requests to the backend (Vercel), cookies need special configuration to work across different domains.

## Backend Configuration Required

### 1. CORS Configuration
The backend must allow credentials from your GitHub Pages domain:

```javascript
// Example CORS configuration
const corsOptions = {
  origin: [
    'https://your-username.github.io',  // Your GitHub Pages domain
    'https://your-username.github.io/Fitpreeti-yog-institute',  // With base path
    'http://localhost:5173',  // For local development
  ],
  credentials: true,  // CRITICAL: Must be true
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
};
```

### 2. Cookie Configuration
Cookies must be set with `SameSite=None` and `Secure` for cross-origin requests:

```javascript
// When setting cookies after login
res.cookie('access_token', token, {
  httpOnly: true,
  secure: true,  // Required for SameSite=None
  sameSite: 'none',  // CRITICAL: Allows cross-origin cookies
  maxAge: 15 * 60 * 1000,  // 15 minutes
  path: '/',
  // DO NOT set domain - let it default
});

res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',  // CRITICAL: Allows cross-origin cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  path: '/',
  // DO NOT set domain - let it default
});
```

### 3. Important Notes

- **SameSite=None** requires **Secure=true** (HTTPS only)
- **Do NOT set the domain attribute** - let it default to the backend domain
- **credentials: true** must be set in CORS configuration
- The frontend already sends `credentials: 'include'` in all requests

## Testing

After updating the backend:

1. Clear all cookies in your browser
2. Try logging in again
3. Check browser DevTools → Application → Cookies
4. You should see `access_token` and `refresh_token` cookies
5. Subsequent API requests should work without 401 errors

## Current Frontend Configuration

The frontend is already correctly configured:
- ✅ Sends `credentials: 'include'` with all requests
- ✅ Uses correct API base URL in production
- ✅ Handles cookie-based authentication

The issue is **100% on the backend side** - cookies need to be configured for cross-origin requests.

