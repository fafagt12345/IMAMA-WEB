import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Secara eksplisit memetakan jalur CJS yang bermasalah ke jalur ESM yang benar
      // Ini seringkali menjadi solusi untuk error "Could not resolve ./cjs/react-jsx-runtime.production.min.js"
      './cjs/react-jsx-runtime.production.min.js': 'react/jsx-runtime',
      './cjs/react.production.min.js': 'react', // Juga alias react itu sendiri
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
