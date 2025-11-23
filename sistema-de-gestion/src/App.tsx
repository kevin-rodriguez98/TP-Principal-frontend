import { Routes, Route } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import Menu from "./pages/Menu";
import "./app.css";
import FaceLogin from "./login/FaceLogin.tsx";
import PanelGeneral from "./components/Tables/PanelGeneral.tsx";
import PanelUsuarios from "./pages/PanelUsuarios.tsx";
import ReportesInsumos from "./pages/ReportesInsumos.tsx";
import ReportesOrdenes from "./pages/ReportesOrdenes.tsx";


import { ModalContext } from "./components/modal/ModalContext.tsx";
import Modal from "./components/modal/Modal.tsx";

import ModalCambiarPassword from "./components/modal/ModalCambiarPassword.tsx";
import { useUsuarios } from "./Context/UsuarioContext";

// URL´s SERVER
export const URL = "https://tp-principal-backend.onrender.com/" 

export const URL_ordenes = "https://tp-principal-backend.onrender.com/orden-produccion";
export const URL_insumos = "https://tp-principal-backend.onrender.com/insumos";
export const URL_ingresos = "https://tp-principal-backend.onrender.com/movimiento-insumo";
export const URL_egresos = "https://tp-principal-backend.onrender.com/movimiento-producto";
export const URL_productos = "https://tp-principal-backend.onrender.com/productos";
export const URL_estimacion = "https://tp-principal-backend.onrender.com/tiempo-produccion";
export const URL_recetas = "https://tp-principal-backend.onrender.com/recetas";
export const URL_empleados = "https://tp-principal-backend.onrender.com/empleados";

function App() {
  const { modal, setModal } = useContext(ModalContext)!;

  const { usuario, modificarPassword } = useUsuarios();

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (usuario?.isPrimerIngreso) {
      setShowPasswordModal(true);
    }
  }, [usuario]);

  const handlePasswordChange = async (_actual: string, nueva: string) => {
  if (!usuario) return;

  try {
    await modificarPassword(usuario.legajo, nueva);
    setShowPasswordModal(false);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
      {showPasswordModal && (
        <ModalCambiarPassword
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordChange}
        />
      )}

      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<FaceLogin />} />
        <Route path="/PanelGestion/:id" element={<PanelGeneral />} />
        <Route path="/usuarios" element={<PanelUsuarios />} />
        <Route path="/reportes/insumos" element={<ReportesInsumos />} />
        <Route path="/reportes/ordenes" element={<ReportesOrdenes />} />
      </Routes>

      {modal && (
        <Modal
          tipo={modal.tipo}
          mensaje={modal.mensaje}
          onConfirm={modal.onConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

export default App;