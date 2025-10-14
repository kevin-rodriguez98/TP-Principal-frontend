import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

import { OpProvider } from './Context/OpContext'
import { InsumoProvider } from './Context/InsumoContext'
import { RegistroProvider } from './Context/RegistroContext'
import { PanelProvider } from './Context/PanelContext'
import { OrdenProduccionProvider } from './Context/OrdenesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <OpProvider>
        <InsumoProvider>
          <PanelProvider>
            <RegistroProvider>
              <OrdenProduccionProvider>
                <App />
              </OrdenProduccionProvider>
            </RegistroProvider>
          </PanelProvider>
        </InsumoProvider>
      </OpProvider>
    </Router>
  </StrictMode>,
)