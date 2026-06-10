import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      // Memastikan modul CommonJS (CJS) dikonversi dengan benar ke ESM saat build
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    // Memaksa Vite untuk melakukan pre-bundling pada React runtime
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
});
