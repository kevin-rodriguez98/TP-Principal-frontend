import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { OpProvider } from './Context/OpContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <OpProvider>
      <App />
      </OpProvider>
    </Router>
  </StrictMode>,
)
