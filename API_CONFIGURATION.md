# API Configuration Guide

## Single Source of Truth

All API configuration is centralized in `src/config/api.ts`. This ensures consistency across:
- Frontend API calls (`src/services/api.ts`)
- Vite proxy configuration (`vite.config.ts`)

## Configuration

### Development Mode
- **API Base URL**: `/api/v1` (relative path, proxied by Vite)
- **Backend URL**: `http://localhost:3000` (default)
- **Proxy**: Vite proxies `/api/*` → `http://localhost:3000/api/*`

### Production Mode
- **API Base URL**: Uses `VITE_API_BASE_URL` or defaults to production backend
- **Backend URL**: Extracted from `VITE_API_BASE_URL` or uses production backend

## Environment Variables

### `.env` file (optional)
```env
# For local development - set backend URL
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Backend Configuration
Your NestJS backend:
- Runs on port **3000** (default)
- API prefix: `/api/v1`
- CORS allows: `http://localhost:5173` and other localhost ports

## How It Works

### Development Flow
1. Frontend makes request to `/api/v1/auth/profile`
2. Vite proxy intercepts `/api` requests
3. Proxy forwards to `http://localhost:3000/api/v1/auth/profile`
4. Backend responds (CORS headers allow the request)

### Production Flow
1. Frontend makes request to full URL (e.g., `https://fitpreeti-yog-backend.vercel.app/api/v1/auth/profile`)
2. Direct request to backend (no proxy needed)

## Troubleshooting

### Requests still going to `localhost:5173`
**Solution**: Restart your Vite dev server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Proxy not working
1. Check console for proxy configuration logs:
   ```
   🔧 Vite Proxy Configuration:
     Proxy Target: http://localhost:3000
     Proxy Path: /api -> http://localhost:3000/api
   ```

2. Verify backend is running on port 3000

3. Check Network tab - requests should show:
   - **Request URL**: `http://localhost:5173/api/v1/...`
   - **Proxied to**: `http://localhost:3000/api/v1/...`

### CORS errors
Even if proxy isn't working, your backend CORS config allows `localhost:5173`, so requests should still work. But using the proxy is recommended for:
- Better debugging
- Consistent behavior
- No CORS preflight requests

## Files

- `src/config/api.ts` - Single source of truth for API configuration
- `src/services/api.ts` - Uses `API_BASE_URL` from config
- `vite.config.ts` - Uses same logic for proxy configuration

