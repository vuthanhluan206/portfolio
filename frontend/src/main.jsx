import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

history.scrollRestoration = 'manual'
history.replaceState(null, '', location.pathname + location.search)
scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
