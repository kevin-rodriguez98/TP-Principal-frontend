import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu'
import GestionStock from './pages/GestionStock';
// import './App.css'

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/GestionStock" element={<GestionStock />} />
      </Routes>
    </>
  )
}

export default App
