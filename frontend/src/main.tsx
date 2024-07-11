import React from 'react'
import ReactDOM from 'react-dom/client'
import SignupForm from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <SignupForm />
    </ThemeProvider>
  </React.StrictMode>,
)
