import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { useAppStore } from './store/useAppStore'
import { storyControls } from './story/StoryDirector'

// Solo en desarrollo: permite saltar a cualquier escena desde la consola (window.__store).
if (import.meta.env.DEV) {
  const w = window as unknown as { __store: typeof useAppStore; __story: typeof storyControls }
  w.__store = useAppStore
  w.__story = storyControls
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
