import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu'
import GestionStock from './pages/GestionStock.tsx';
import RegistroInsumos from "./pages/RegistroInsumos.tsx";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/GestionStock" element={<GestionStock />} />
        <Route path="/RegistroInsumos" element={<RegistroInsumos />} />
      </Routes>
    </>
  )
}

export default App
