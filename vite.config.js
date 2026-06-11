import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix untuk error build Vercel: map path CJS React/ReactDOM ke entry yang benar
      './cjs/react-jsx-runtime.production.min.js': 'react/jsx-runtime',
      './cjs/react.production.min.js': 'react',
      './cjs/react-dom.production.min.js': 'react-dom',
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
