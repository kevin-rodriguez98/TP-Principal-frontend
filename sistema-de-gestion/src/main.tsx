import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { OpProvider } from './Context/OpContext';
import { InsumoProvider } from './Context/InsumoContext';
import { RegistroProvider } from './Context/RegistroContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <OpProvider>
        <InsumoProvider>
          <RegistroProvider>
            <App />
          </RegistroProvider>
        </InsumoProvider>
      </OpProvider>
    </Router>
  </StrictMode>,
)
