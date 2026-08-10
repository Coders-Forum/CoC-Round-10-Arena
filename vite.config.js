import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Netlify serves from root '/' — no subpath needed
export default defineConfig({
  base: '/',
  plugins: [react()],
})