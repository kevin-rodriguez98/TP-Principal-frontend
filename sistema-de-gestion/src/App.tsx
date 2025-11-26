import { Routes, Route } from "react-router-dom";
import { useContext } from "react";

import Menu from "./pages/Menu";
import "./app.css";
import Login from "./pages/Login";
import PanelGeneral from "./components/Tables/PanelGeneral";
import PanelUsuarios from "./pages/PanelUsuarios";
import ReportesInsumos from "./pages/ReportesInsumos";
import ReportesOrdenes from "./pages/ReportesOrdenes";
import { ModalContext } from "./components/modal/ModalContext";
import Modal from "./components/modal/Modal";
import NotFound from "./pages/NotFound";
// import ProtectedRoute from "./ProtectedRoute";

// URL´s SERVER
export const URL = "https://tp-principal-backend.onrender.com/";

export const URL_ordenes = `${URL}orden-produccion`;
export const URL_insumos = `${URL}insumos`;
export const URL_ingresos = `${URL}movimiento-insumo`;
export const URL_egresos = `${URL}movimiento-producto`;
export const URL_productos = `${URL}productos`;
export const URL_estimacion = `${URL}tiempo-produccion`;
export const URL_recetas = `${URL}recetas`;
export const URL_empleados = `${URL}empleados`;

function App() {
  const { modal, setModal } = useContext(ModalContext)!;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/menu"
          element={
            // <ProtectedRoute>
              <Menu />
            //  </ProtectedRoute>
          }
        />

        <Route
          path="/PanelGestion/:id"
          element={
            // <ProtectedRoute>
              <PanelGeneral />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            // <ProtectedRoute >
            <PanelUsuarios />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/reportes/insumos"
          element={
            // <ProtectedRoute>
            <ReportesInsumos />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/reportes/ordenes"
          element={
            // <ProtectedRoute>
            <ReportesOrdenes />
            // </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modal global */}
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
