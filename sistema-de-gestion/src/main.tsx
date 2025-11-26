import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { OpProvider } from './Context/OpContext'
import { InsumoProvider } from './Context/InsumoContext'
import { Movimiento_insumo_contextProvider } from './Context/Movimiento_insumo_context'
import { Movimiento_producto_contextProvider } from './Context/Movimiento_producto_context'
import { PanelProvider } from './Context/PanelContext'
import { OrdenProduccionProvider } from './Context/OrdenesContext'
import { ProductosProvider } from './Context/ProductosContext';
import { RecetaProvider } from './Context/RecetaContext';
import { ModalProvider } from './components/modal/ModalContext';
import { UsuarioProvider } from './Context/UsuarioContext';
import { AuthProvider } from './Context/AuthContext';
import { TiempoProduccionProvider } from './Context/TiempoProduccionContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ModalProvider>
        <UsuarioProvider>
          <AuthProvider>
            <OpProvider>
              <InsumoProvider>
                <PanelProvider>
                  <Movimiento_insumo_contextProvider>
                    <Movimiento_producto_contextProvider>
                      <ProductosProvider>
                        <TiempoProduccionProvider>
                          <OrdenProduccionProvider>
                            <RecetaProvider>
                              <App />
                              <ToastContainer
                                position="bottom-right"
                                autoClose={2000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="dark"
                              />
                            </RecetaProvider>
                          </OrdenProduccionProvider>
                        </TiempoProduccionProvider>
                      </ProductosProvider>
                    </Movimiento_producto_contextProvider>
                  </Movimiento_insumo_contextProvider>
                </PanelProvider>
              </InsumoProvider>
            </OpProvider>
          </AuthProvider>
        </UsuarioProvider>
      </ModalProvider>
    </Router>
  </StrictMode>,
)