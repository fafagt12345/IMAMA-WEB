import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Memaksa Vite menggunakan satu instansi React yang sama untuk semua library
    dedupe: ['react', 'react-dom'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  // Membantu Rollup menentukan branch kode production/development pada library CJS
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
