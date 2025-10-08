import { useContext } from 'react'
import { InsumoContext } from '../Context/InsumoContext';
import Modal from "../components/modal/Modal";
import "../styles/Forms.css";

const Form_Alta = () => {

    const { nuevoInsumo, setNuevoInsumo, handleAddInsumo, modal, setModal } = useContext(InsumoContext)!;

    return (
        <div className="forms">
            <section className="card">
                <form
                    className="formulario"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddInsumo(e);
                    }}
                >
                    <input
                        type="text"
                        placeholder="Código de producto"
                        value={nuevoInsumo.codigo}
                        onChange={(e) =>
                            setNuevoInsumo({ ...nuevoInsumo, codigo: e.target.value.trim() })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nuevoInsumo.nombre}
                        onChange={(e) =>
                            setNuevoInsumo({ ...nuevoInsumo, nombre: e.target.value.trim() })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Categoría"
                        value={nuevoInsumo.categoria}
                        onChange={(e) =>
                            setNuevoInsumo({ ...nuevoInsumo, categoria: e.target.value.trim() })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Marca"
                        value={nuevoInsumo.marca}
                        onChange={(e) =>
                            setNuevoInsumo({ ...nuevoInsumo, marca: e.target.value.trim() })
                        }
                        required
                    />

                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={nuevoInsumo.stock || ""}
                        min="0"
                        onChange={(e) =>
                            setNuevoInsumo({
                                ...nuevoInsumo,
                                stock: Number(e.target.value) || 0,
                            })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Lote"
                        value={nuevoInsumo.lote}
                        onChange={(e) =>
                            setNuevoInsumo({ ...nuevoInsumo, lote: e.target.value.trim() })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Unidad"
                        value={nuevoInsumo.unidad}
                        onChange={(e) =>
                            setNuevoInsumo({ ...nuevoInsumo, unidad: e.target.value.trim() })
                        }
                        required
                    />

                    <input
                        type="number"
                        placeholder="Umbral mínimo"
                        value={nuevoInsumo.umbralMinimoStock || ""}
                        min="0"
                        onChange={(e) =>
                            setNuevoInsumo({
                                ...nuevoInsumo,
                                umbralMinimoStock: Number(e.target.value) || 0,
                            })
                        }
                        required
                    />

                    <button type="submit" className="btn-guardar">
                        Guardar
                    </button>
                </form>
            </section>

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

export default Form_Alta
