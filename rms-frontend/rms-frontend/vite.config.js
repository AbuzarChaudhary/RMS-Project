import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// '@' is an alias for the src/ folder.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    open: true,
    // Forward API calls to the backend during development so the browser
    // makes same-origin requests (no CORS setup required).
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
