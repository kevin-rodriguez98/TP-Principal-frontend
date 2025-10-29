import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu'
import GestionStock from './pages/GestionStock.tsx';
import Registro from "./pages/Registro.tsx";
import OrdenProduccionPage from './pages/Ordenes.tsx';

import './app.css';
import ProduccionPage from './pages/Productos.tsx';
import FaceLogin from './login/FaceLogin.tsx';

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/gestion-stock" element={<GestionStock />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/ordenes" element={<OrdenProduccionPage />} />
        <Route path="/produccion" element={<ProduccionPage />} />
        <Route path="/login" element={<FaceLogin />} />
      </Routes>
    </>
  )
}

export default App
