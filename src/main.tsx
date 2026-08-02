import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from '@/lib/store'
import { Toaster } from '@/components/ui/sonner'
import App from './App'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
        <Toaster position="top-center" />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
