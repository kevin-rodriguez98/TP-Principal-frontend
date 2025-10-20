import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu'
import GestionStock from './pages/GestionStock.tsx';
import RegistroInsumos from "./pages/RegistroInsumos.tsx";
import OrdenProduccionPage from './pages/Ordenes.tsx';

import './app.css';

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/gestion-stock" element={<GestionStock />} />
        <Route path="/registro-insumos" element={<RegistroInsumos />} />
        <Route path="/ordenes-produccion" element={<OrdenProduccionPage />} />
      </Routes>
    </>
  )
}

export default App
