import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './Canvas/Canvas.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // https://reactrouter.com/start/declarative/routing
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </StrictMode>,
  </BrowserRouter>
)
