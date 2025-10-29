import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', 
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
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') {
            return 'assets/index.css';
          }
          return 'assets/[name]-[hash].[ext]';
        },
        manualChunks: undefined,
      }
    }
  }
});