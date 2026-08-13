import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optimized Vite build configuration for high performance & fast loading
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    assetsInlineLimit: 4096,
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