import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useGLTF } from '@react-three/drei'
import './index.css'
import App from './App.jsx'

// Serve Draco decoders locally to prevent cross-origin/privacy-shield blocks in Edge, Ulaa, Brave & Safari
const base = import.meta.env.BASE_URL || './'
useGLTF.setDecoderPath(`${base}draco/`)

// ─────────────────────────────────────────────────────────────────────
// Suppress uncaught WebGL context creation errors from Three.js / R3F
// These are expected on browsers where WebGL is disabled or sandboxed.
// The app gracefully falls back to placeholder UI via LazyCanvas.
// ─────────────────────────────────────────────────────────────────────
window.addEventListener('unhandledrejection', (event) => {
    const msg = event?.reason?.message || ''
    if (
        msg.includes('WebGL') ||
        msg.includes('context') ||
        msg.includes('GL_RENDERER')
    ) {
        event.preventDefault()
        console.warn('[App] Suppressed WebGL context error — fallback UI active.')
    }
})

window.addEventListener('error', (event) => {
    const msg = event?.message || ''
    if (msg.includes('WebGL') || msg.includes('context')) {
        event.preventDefault()
        console.warn('[App] Suppressed WebGL error — fallback UI active.')
    }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
