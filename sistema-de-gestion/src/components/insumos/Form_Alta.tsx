import { useContext } from 'react'
import { InsumoContext } from '../../Context/InsumoContext';
import Modal from "../modal/Modal";
import "../../styles/Forms.css";

const Form_Alta = () => {

    const { nuevoInsumo, setNuevoInsumo, handleAddInsumo, modal, setModal } = useContext(InsumoContext)!;


const camposIncompletos = () => {
    return (

        nuevoInsumo.codigo.trim() === "" ||
        nuevoInsumo.nombre.trim() === "" ||
        nuevoInsumo.categoria.trim() === "" ||
        nuevoInsumo.marca.trim() === "" ||
        nuevoInsumo.unidad.trim() === "" ||
        nuevoInsumo.stock <= 0 ||
        nuevoInsumo.umbralMinimoStock === 0
    );
};



    return (
        <div className="forms">
            <section className="card-alta">
                <h2 className='titulo-form-alta'>Alta de Insumo</h2>
                <form
                    className="formulario"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddInsumo(e);
                    }}
                >
                    <input
                        type="number"
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
                    <select name="categoria" value={nuevoInsumo.categoria || ""} onChange={(e) =>
                        setNuevoInsumo({ ...nuevoInsumo, categoria: e.target.value.trim() })
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

                    <select name="marca" value={nuevoInsumo.marca || ""} onChange={(e) =>
                        setNuevoInsumo({ ...nuevoInsumo, marca: e.target.value.trim() })
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

                        <select name="unidad" value={nuevoInsumo.unidad || ""} onChange={(e) =>
                            setNuevoInsumo({ ...nuevoInsumo, unidad: e.target.value.trim() })
                        } required>
                            <option value="">unidad</option>
                            <option value="miligramos">mg.</option>
                            <option value="gramos">gr.</option>
                            <option value="kilogramos">kg.</option>
                            <option value="litros">lts.</option>
                            <option value="toneladas">t.</option>
                        </select>

                        <input
                            type="number"
                            placeholder="Umbral mín."
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
                    </div>

                    <button
                        type="submit"
                        disabled={camposIncompletos()}
                        className="btn-guardar"
                    >
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
