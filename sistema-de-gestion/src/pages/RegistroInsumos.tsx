import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RegistroContext } from "../Context/RegistroContext";
import Footer from '../components/Footer'
import Header from '../components/Header'
import Modal from "../components/modal/Modal.tsx";
import Form_Registro from "../components/registros/Form_Registro.tsx";
import "../styles/GestionStock.css";
import ListadoRegistro from "../components/registros/ListadoRegistro.tsx";
import Busqueda from "../components/registros/Busqueda.tsx";

const RegistroInsumos = () => {
    const navigate = useNavigate();

    const { modal, setModal, open, setOpen } = useContext(RegistroContext)!;



    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-6 gestion-stock">
                <h2 className="titulo">Registro de Insumos</h2>

                <section className="card">
                    <h3 className="tituloSeccion">Lista de Registros realizados</h3>
                    <Busqueda/>
                    <div className="table-wrapper">
                        <ListadoRegistro />
                    </div>
                </section>

                <div className="fab-container">
                    <button
                        className="fab fab-registro"
                        onClick={() => setOpen("movimiento")}
                    >
                        ⇄
                    </button>
                </div>
                {open && (
                    <div className="overlay">
                        <div className="modal">
                            <button className="close-btn" onClick={() => setOpen(null)}>
                                X
                            </button>
                            {open === "movimiento" && (
                                <>
                                    <h2>Registro de Movimiento</h2>
                                    <Form_Registro />
                                </>
                            )}
                        </div>
                    </div>
                )}
                <button onClick={() => navigate("/")} className="btn-guardar btn-volver">Volver</button>
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
    )
}

export default RegistroInsumos