import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu'
import GestionStock from './pages/GestionStock.tsx';
import Registro from "./pages/Registro.tsx";
import OrdenProduccionPage from './pages/Ordenes.tsx';

import './app.css';
import ProduccionPage from './pages/Productos.tsx';
import FaceLogin from './login/FaceLogin.tsx';

// URL´s LOCALES

export const URL_ordenes = "http://localhost:8080/orden-produccion";
export const URL_insumos = "http://localhost:8080/insumos";
export const URL_ingresos = "http://localhost:8080/movimiento-insumo";
export const URL_egresos = "http://localhost:8080/movimiento-producto";
export const URL_productos = "http://localhost:8080/productos";
export const URL_estimacion = "http://localhost:8080/tiempo-produccion";
export const URL_recetas = "http://localhost:8080/recetas";


// URL´s SERVER

// export const URL_ordenes = "https://tp-principal-backend.onrender.com/orden-produccion";
// export const URL_insumos = "https://tp-principal-backend.onrender.com/insumos";
// export const URL_ingresos = "https://tp-principal-backend.onrender.com/movimiento-insumo";
// export const URL_egresos = "https://tp-principal-backend.onrender.com/movimiento-producto";
// export const URL_productos = "https://tp-principal-backend.onrender.com/productos";
// export const URL_estimacion = "https://tp-principal-backend.onrender.com/tiempo-produccion";
// export const URL_recetas = "https://tp-principal-backend.onrender.com/recetas";

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
