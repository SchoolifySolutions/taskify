import React from 'react';
import ReactDOM from 'react-dom/client';
import SignupForm from './Login';
import Home from './home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskPage from './tasks';
import TaskPage2 from './yourtasks';
import Management from './management';

import './index.css';
import { ThemeProvider } from './components/theme-provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignupForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/department" element={<TaskPage />} />
            <Route path="/tasks" element={<TaskPage2 />} />
            <Route path="/management" element={<Management />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
