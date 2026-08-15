import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' blob: https://www.gstatic.com 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' blob: data: https://www.gstatic.com http://localhost:5000 http://127.0.0.1:5000 ws://localhost:* ws://127.0.0.1:*; worker-src 'self' blob: https://www.gstatic.com; child-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
}

// Optimized Vite build configuration with WebAssembly CSP & HTTP security headers
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    headers: securityHeaders,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  preview: {
    headers: securityHeaders
  },
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