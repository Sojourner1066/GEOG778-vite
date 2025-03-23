import { defineConfig } from 'vite';

export default defineConfig({
  base: '/GEOG778-vite/',
  optimizeDeps: {
    include: ['deck.gl', 'deck.gl-leaflet', 'leaflet']
  },
  build: {
    sourcemap: true
  }
});