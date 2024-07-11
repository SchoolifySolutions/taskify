import React from 'react'
import ReactDOM from 'react-dom/client'
import SignupForm from './Login.tsx'
import Home from './home.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
