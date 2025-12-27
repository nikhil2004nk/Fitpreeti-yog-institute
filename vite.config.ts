import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      'import.meta.env.BASE_URL': JSON.stringify(env.VITE_BASE_PATH || '/'),
    },
  };
});
