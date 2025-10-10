import { useContext } from 'react'
import "../styles/Forms.css";
import { RegistroContext } from '../Context/RegistroContext';
import Modal from './modal/Modal';

const Form_Registro = () => {

    const { nuevoRegistro, setNuevoRegistro, handleAddRegistro, modal, setModal} = useContext(RegistroContext)!;

    return (
        <div>
            <section className="card">
                <form className="formulario"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddRegistro(e);
                    }}>
                    <div className=".select">
                        <label style={{ margin: '20px' }}>Tipo:</label>
                        <select style={{ backgroundColor: 'transparent', border: '2px solid #ff5ca2' }} name="tipo" required>
                            <option value="-">-</option>
                            <option value="Ingreso">Ingreso</option>
                            <option value="Egreso">Egreso</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Codigo"
                        value={nuevoRegistro?.codigo || ""}
                        onChange={(e) =>
                            setNuevoRegistro({ ...nuevoRegistro, codigo: e.target.value.trim() })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="nombre"
                        value={nuevoRegistro?.nombre || ""}
                        onChange={(e) =>
                            setNuevoRegistro({ ...nuevoRegistro, nombre: e.target.value.trim() })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="categoria"
                        value={nuevoRegistro?.categoria || ""}
                        onChange={(e) =>
                            setNuevoRegistro({ ...nuevoRegistro, categoria: e.target.value.trim() })
                        }
                    />
                    <input
                        type="text"
                        placeholder="unidad"
                        value={nuevoRegistro?.unidad || ""}
                        onChange={(e) =>
                            setNuevoRegistro({ ...nuevoRegistro, unidad: e.target.value.trim() })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="stock"
                        value={nuevoRegistro?.stock || ""}
                        onChange={(e) =>
                            setNuevoRegistro({ ...nuevoRegistro, stock: Number(e.target.value.trim()) })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="lote"
                        value={nuevoRegistro?.lote || ""}
                        onChange={(e) =>
                            setNuevoRegistro({ ...nuevoRegistro, lote: e.target.value.trim() })
                        }
                        required
                    />
                    <button type="submit" className="btn-guardar">Guardar</button>
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

export default Form_Registro
