import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Ensure single instance of zustand across the app
    dedupe: ['zustand'],
  },
});
