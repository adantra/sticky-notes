import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lucide-react': ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
})