import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for maximum compatibility
  optimizeDeps: {
    include: ['pdfjs-dist', 'docx', 'buffer']
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'pdfjs': ['pdfjs-dist'],
          'docx': ['docx']
        }
      }
    }
  },
  worker: {
    format: 'es'
  },
  server: {
    port: 3000,
    host: true
  }
})