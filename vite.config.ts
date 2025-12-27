import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // For GitHub Pages, use the repository name as base path in production
  const base = mode === 'production' ? '/Fitpreeti-yog-institute/' : '/';
  
  return {
    base,
    plugins: [react()],
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
