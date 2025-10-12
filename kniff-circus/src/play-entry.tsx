import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// If your page needs global styles, import them here
import './index.css'

// Import your existing PlayPage component
import PlayPage from './play/PlayPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayPage />
  </StrictMode>
)
