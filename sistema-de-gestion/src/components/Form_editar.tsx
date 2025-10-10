import { useContext } from 'react'
import { InsumoContext } from '../Context/InsumoContext';
import Modal from "../components/modal/Modal";
import "../styles/Forms.css";

const Form_editar = () => {

    const { insumoEditar, setInsumoEditar, handleUpdateInsumo, modal, setModal } = useContext(InsumoContext)!;

    if (!insumoEditar) {
        return <p style={{ textAlign: "center" }}>No hay insumo seleccionado para editar.</p>;
    }

    return (
        <div className="forms">
            <section className="card">
                <form className="formulario" onSubmit={handleUpdateInsumo}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={insumoEditar.nombre}
                        onChange={(e) => setInsumoEditar({ ...insumoEditar, nombre: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Categoría"
                        value={insumoEditar.categoria}
                        onChange={(e) => setInsumoEditar({ ...insumoEditar, categoria: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Marca"
                        value={insumoEditar.marca}
                        onChange={(e) => setInsumoEditar({ ...insumoEditar, marca: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="stock"
                        value={insumoEditar.stock}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setInsumoEditar({ ...insumoEditar, stock: Number(value) });
                        }}
                    />
                    <input
                        type="text"
                        placeholder="unidad"
                        value={insumoEditar.unidad}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setInsumoEditar({ ...insumoEditar, unidad: (value) });
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Lote"
                        value={insumoEditar.lote}
                        onChange={(e) => setInsumoEditar({ ...insumoEditar, lote: e.target.value })}
                    />
                    <button type="submit" className="btn-actualizar">Actualizar</button>
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

export default Form_editar
