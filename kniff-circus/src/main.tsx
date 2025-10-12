import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App.tsx'
import PlayPage from './play/PlayPage.tsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/play', element: <PlayPage /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
