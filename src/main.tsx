import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { useAppStore } from './store/useAppStore'

// Solo en desarrollo: permite saltar a cualquier escena desde la consola (window.__store).
if (import.meta.env.DEV) (window as unknown as { __store: typeof useAppStore }).__store = useAppStore

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
