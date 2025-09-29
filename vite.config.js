import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/manager/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-markdown': path.resolve(__dirname, 'node_modules/react-markdown/index.js')
    },
  },
  optimizeDeps: {
    include: ['react-markdown'],
    exclude: ['@mui/icons-material/AddAPhoto'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    port: 5173,
    open: true,
  }
});
