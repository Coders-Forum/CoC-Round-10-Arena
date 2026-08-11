import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Netlify serves from root '/' — no subpath needed
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          react: ['react', 'react-dom']
        }
      }
    }
  }
})