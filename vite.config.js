import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    // ── Dev proxy ────────────────────────────────────────────────────────────
    // Forwards /api/* requests to the Node.js backend so the frontend never
    // has to hardcode a cross-origin URL in development.
    // Production uses VITE_API_BASE_URL (set in .env.production or docker-compose).
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Do NOT rewrite the path — backend is mounted at /api/*
      },
    },
  },
});
