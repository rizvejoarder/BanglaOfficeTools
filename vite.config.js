import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  }
})