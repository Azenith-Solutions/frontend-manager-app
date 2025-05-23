import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-markdown': path.resolve(__dirname, 'node_modules/react-markdown/index.js')
    },
  },
  optimizeDeps: {
    include: ['react-markdown'],
    exclude: ['@mui/icons-material/AddAPhoto'], // Exclude the problematic icon from optimization
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    port: 5173,
    open: true,
  }
});
