import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      buffer: 'buffer', // Ensures Buffer is properly resolved
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.browser': true,
  },
});
