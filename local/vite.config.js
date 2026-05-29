import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared':     path.resolve(__dirname, '../shared'),
      '@engine':     path.resolve(__dirname, '../shared/engine'),
      '@components': path.resolve(__dirname, '../shared/components'),
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api':    'http://localhost:3000',
      '/health': 'http://localhost:3000'
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/, /shared\/engine\/.*\.js$/]
    }
  }
});
