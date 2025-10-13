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

                    <select name="categoria" value={insumoEditar.categoria || ""} onChange={(e) =>
                        setInsumoEditar({ ...insumoEditar, categoria: e.target.value.trim() })
                    } required>
                        <option value="">Categoría</option>
                        <option value="Bebidas lácteas">Bebidas lácteas</option>
                        <option value="Quesos">Quesos</option>
                        <option value="Postres">Postres</option>
                        <option value="crema">Crema</option>
                        <option value="manteca">Manteca</option>
                        <option value="helado">Helado</option>
                        <option value="congelados">Congelados</option>
                    </select>


                    <select name="marca" value={insumoEditar.marca || ""} onChange={(e) =>
                        setInsumoEditar({ ...insumoEditar, marca: e.target.value.trim() })
                    } required>
                        <option value="">Marca</option>
                        <option value="La Serenísima">La Serenísima</option>
                        <option value="Sancor">Sancor</option>
                        <option value="Milkaut">Milkaut</option>
                        <option value="Yougurisímo">Yougurisímo</option>
                        <option value="Ilolay">Ilolay</option>
                        <option value="La Paulina">La Paulina</option>
                        <option value="Tregar">Tregar</option>
                    </select>


                    <div className='div-cantidad'>
                        <input
                            type="number"
                            placeholder="Stock"
                            value={insumoEditar.stock || ""}
                            min="0"
                            onChange={(e) =>
                                setInsumoEditar({
                                    ...insumoEditar,
                                    stock: Number(e.target.value) || 0,
                                })
                            }
                            required
                        />


                        <select name="unidad" value={insumoEditar.unidad || ""} onChange={(e) =>
                            setInsumoEditar({ ...insumoEditar, unidad: e.target.value.trim() })
                        } required>
                            <option value="" >unidad</option>
                            <option value="miligramos">mg.</option>
                            <option value="gramos">gr.</option>
                            <option value="kilogramos">kg.</option>
                            <option value="litros">lts.</option>
                            <option value="toneladas">t.</option>
                        </select>

                        <input
                            type="number"
                            placeholder="Umbral mín."
                            value={insumoEditar.umbralMinimoStock || ""}
                            min="0"
                            onChange={(e) =>
                                setInsumoEditar({
                                    ...insumoEditar,
                                    umbralMinimoStock: Number(e.target.value) || 0,
                                })
                            }
                            required
                        />
                    </div>
                    {/* <input
                        type="text"
                        placeholder="Lote"
                        value={insumoEditar.lote}
                        onChange={(e) => setInsumoEditar({ ...insumoEditar, lote: e.target.value })}
                    /> */}
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
