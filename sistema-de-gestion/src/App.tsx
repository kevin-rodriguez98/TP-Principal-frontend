import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu'
import GestionStock from './pages/GestionStock.tsx';
import RegistroInsumos from "./pages/RegistroInsumos.tsx";
import OrdenProduccionPage from './pages/Ordenes.tsx';
import OrdenFormPage from './pages/OrdenFormPages.tsx';

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/gestion-stock" element={<GestionStock />} />
        <Route path="/registro-insumos" element={<RegistroInsumos />} />
        <Route path="/Ordenes-produccion" element={<OrdenProduccionPage />} />
         <Route path="/Ordenes-produccion/nueva" element={<OrdenFormPage />} />
      </Routes>
    </>
  )
}

export default App
