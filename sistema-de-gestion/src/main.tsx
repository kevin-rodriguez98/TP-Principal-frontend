import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { OpProvider } from './Context/OpContext';
import { InsumoProvider } from './Context/InsumoContext';
import { RegistroProvider } from './Context/RegistroContext';
import { PanelProvider } from './Context/PanelContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <OpProvider>
        <InsumoProvider>
          <PanelProvider>
            <RegistroProvider>
              <App />
            </RegistroProvider>
          </PanelProvider>
        </InsumoProvider>
      </OpProvider>
    </Router>
  </StrictMode>,
)
