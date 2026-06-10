import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      // Mencegah Rollup memproses React sebagai CJS, biarkan Vite menanganinya sebagai ESM
      exclude: ['react', 'react-dom'],
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});
