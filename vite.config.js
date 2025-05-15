import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: ['@emotion/babel-plugin'],
    },
  })],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
          hmr: {
            overlay: false
          }
        
      }
    }
  },
  define: {
    'process.env': process.env,
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled'],
  }
});
