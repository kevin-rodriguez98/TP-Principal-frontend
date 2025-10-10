import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RegistroContext } from "../Context/RegistroContext";
import type { Registro } from "../Context/RegistroContext.tsx";
import type { Columna } from "../components/Listado.tsx";
import Footer from '../components/Footer'
import Header from '../components/Header'
import Modal from "../components/modal/Modal.tsx";
import Form_Registro from "../components/Form_Registro.tsx";
import "../styles/GestionStock.css";
import Listado from "../components/Listado.tsx";

const RegistroInsumos = () => {
    const navigate = useNavigate();

    const { registros, setNuevoRegistro, setRegistros, nuevoRegistro, modal, setModal, handleAddRegistro, open, setOpen } = useContext(RegistroContext)!;

    const columnasRegistro: Columna<Registro>[] = [
        { key: "codigo", label: "Código" },
        { key: "nombre", label: "Nombre" },
        { key: "categoria", label: "Categoría" },
        { key: "marca", label: "Marca" },
        { key: "stock", label: "Cantidad" },
        { key: "unidad", label: "Unidad" },
        { key: "lote", label: "Lote" },
        { key: "proveedor", label: "proveedor" },
        { key: "venta", label: "venta" },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-6 gestion-stock">
                <h2 className="titulo">Registro de Insumos</h2>
                <section className="card">
                    <h3 className="tituloSeccion">Lista de Registros</h3>
                    <Listado lista={registros} columnas={columnasRegistro} />
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