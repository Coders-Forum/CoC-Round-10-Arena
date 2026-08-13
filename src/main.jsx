import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useGLTF } from '@react-three/drei'
import './index.css'
import App from './App.jsx'

// Serve Draco decoders locally to prevent cross-origin/privacy-shield blocks in Edge, Ulaa, Brave & Safari
const base = import.meta.env.BASE_URL || './'
useGLTF.setDecoderPath(`${base}draco/`)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
