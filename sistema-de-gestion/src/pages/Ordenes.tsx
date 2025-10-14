import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ListadoOrden from "../components/Operaciones/ListadoOperaciones";
import BusquedaOrdenes from "../components/Operaciones/BusquedaOrdenes";
import "../styles/Ordenes.css";
import { OrdenProduccionContext } from "../Context/OrdenesContext";
import Modal from "../components/modal/Modal";

const OrdenProduccionPage = () => {
  const navigate = useNavigate();
  const { modal, tipoModal, setTipoModal } = useContext(OrdenProduccionContext)!;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 ordenes-main">
        <section className="card ordenes-listado">
          <div className="flex justify-between items-center mb-4">
            <h2>Órdenes de producción</h2>
            <button className="btn-agregar" onClick={() => navigate("/ordenes/nueva")}>
              +Nueva orden
            </button>
          </div>

          <BusquedaOrdenes />
          <div className="table-wrapper">
            <ListadoOrden />
          </div>
        </section>
      </main>
      <Footer />

      {tipoModal && modal && (
        <Modal
          tipo={modal.tipo}
          mensaje={modal.mensaje}
          onConfirm={modal.onConfirm}
          onClose={() => setTipoModal(null)}
        />
      )}
    </div>
  );
};

export default OrdenProduccionPage;