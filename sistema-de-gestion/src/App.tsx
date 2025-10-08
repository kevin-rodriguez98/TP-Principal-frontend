import { useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu'
import GestionStock from './pages/GestionStock.tsx';
import RegistroInsumos from './pages/RegistroInsumos.tsx';

function App() {


  useEffect(() => {
    fetch("https://tp-principal-backend.onrender.com/") 
      .then(() => console.log("Backend despertado "))
      .catch((err) => console.error("No se pudo despertar el backend:", err));
  }, []);


  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/GestionStock" element={<GestionStock />} />
        <Route path="/registroInsumos" element={<RegistroInsumos />} />
      </Routes>
    </>
  )
}

export default App
