import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InsumoContext } from "../Context/InsumoContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Form_Alta from "../components/insumos/Form_Alta";
import Form_editar from "../components/insumos/Form_editar";
import Modal from "../components/modal/Modal";
import ListadoInsumo from "../components/insumos/ListadoInsumo";
import Busqueda_insumos from "../components/insumos/Busqueda_insumos";

import "../styles/GestionStock.css";


const GestionStock = () => {
  const navigate = useNavigate();

  const { modal, setModal, tipoModal, setTipoModal } =
    useContext(InsumoContext)!;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 gestion-stock">
        <h2 className="titulo">Gestión de Stock</h2>

        <section className="card">
          <h3 className="tituloSeccion">Lista de Insumos</h3>
          <Busqueda_insumos />
          <div className="table-wrapper">
            <ListadoInsumo />
          </div>
        </section>

        <div className="fab-container">
          <button className="fab fab-alta" onClick={() => setTipoModal("alta")}>
            +
          </button>
        </div>

        {tipoModal && (
          <div className="overlay">
            <div className="modal">
              <button className="close-btn" onClick={() => setTipoModal(null)}>
                X
              </button>

              {tipoModal === "alta" && (
                <>
                  <Form_Alta />
                </>
              )}
              {tipoModal === "editar" && (
                <>
                  <Form_editar />
                </>
              )}
            </div>
          </div>
        )}

        <button onClick={() => navigate("/")} className="btn-volver">
          Volver
        </button>
      </main>

      <Footer />

      {modal && (
        <Modal
          tipo={modal.tipo}
          mensaje={modal.mensaje}
          onConfirm={modal.onConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default GestionStock;
