import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
