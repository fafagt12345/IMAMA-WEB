import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Memastikan hanya satu versi React yang digunakan, mencegah konflik ESM/CJS
    dedupe: ['react', 'react-dom'],
  },
  build: {
    commonjsOptions: {
      // Menangani transformasi modul campuran (CommonJS & ESM)
      transformMixedEsModules: true,
    },
  },
});
