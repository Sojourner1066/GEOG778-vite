import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/GEOG778-vite/',
  plugins: [react()],
  optimizeDeps: {
    include: ['deck.gl', 'deck.gl-leaflet', 'leaflet']
  },
  build: {
    sourcemap: true
  }
});