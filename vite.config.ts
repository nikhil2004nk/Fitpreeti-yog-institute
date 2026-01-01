import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Helper function to get backend base URL (same logic as in src/config/api.ts)
const getBackendBaseUrl = (mode: string): string => {
  if (mode === 'development') {
    if (process.env.VITE_API_BASE_URL) {
      try {
        const url = new URL(process.env.VITE_API_BASE_URL);
        return `${url.protocol}//${url.host}`;
      } catch {
        return 'http://localhost:3000';
      }
    }
    return 'http://localhost:3000';
  }
  
  // In production, extract from VITE_API_BASE_URL or use production backend
  if (process.env.VITE_API_BASE_URL) {
    try {
      const url = new URL(process.env.VITE_API_BASE_URL);
      return `${url.protocol}//${url.host}`;
    } catch {
      return 'https://fitpreeti-yog-backend.vercel.app';
    }
  }
  return 'https://fitpreeti-yog-backend.vercel.app';
};

export default defineConfig(({ mode }) => {
  // For GitHub Pages, use the repository name as base path in production
  const base = mode === 'production' ? '/Fitpreeti-yog-institute/' : '/';
  
  // Get backend URL from single source of truth
  const backendUrl = getBackendBaseUrl(mode);
  
  if (mode === 'development') {
    console.log('🔧 Vite Proxy Configuration:');
    console.log('  Proxy Target:', backendUrl);
    console.log('  Proxy Path: /api ->', `${backendUrl}/api`);
  }
  
  return {
    base,
    plugins: [react()],
    server: {
      // Proxy API requests to avoid CORS issues in development
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: mode === 'production',
          rewrite: (path) => path, // Keep the /api path as is
          configure: (proxy, _options) => {
            proxy.on('error', (err) => {
              console.log('🔴 Proxy error:', err);
            });
            proxy.on('proxyReq', (_proxyReq, req) => {
              // Log proxy requests in development
              if (mode === 'development') {
                console.log(`🔄 Proxying ${req.method} ${req.url} -> ${backendUrl}${req.url}`);
              }
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              // Log proxy responses in development
              if (mode === 'development') {
                console.log(`✅ Proxy response: ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
                // Log Set-Cookie headers for auth endpoints
                if (req.url?.includes('/auth/') && proxyRes.headers['set-cookie']) {
                  console.log('🍪 Cookies being set:', proxyRes.headers['set-cookie']);
                }
              }
            });
          },
          // Ensure cookies are forwarded properly
          // Remove domain from cookies so they work with localhost
          cookieDomainRewrite: '',
          // Keep the path as is (empty string means no rewrite)
          cookiePathRewrite: '',
          // Preserve the original host header for proper cookie handling
          xfwd: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    // Define the base URL as a global constant
    define: {
      'import.meta.env.BASE_URL': JSON.stringify(base),
    },
  };
});
