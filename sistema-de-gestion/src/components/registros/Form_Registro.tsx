import { useContext } from "react";
import "../../styles/Forms.css";
import { RegistroContext } from "../../Context/RegistroContext";
import Modal from "../modal/Modal";

const Form_Registro = () => {
    const { nuevoRegistro, setNuevoRegistro, handleAddRegistro, modal, setModal } =
        useContext(RegistroContext)!;


    const camposIncompletos = () => {
        return (
            nuevoRegistro.tipo.trim() == "" ||
            nuevoRegistro.nombre.trim() === "" ||
            nuevoRegistro.categoria.trim() === "" ||
            nuevoRegistro.marca.trim() === "" ||
            nuevoRegistro.unidad.trim() === "" ||
            nuevoRegistro.stock <= 0 ||
            nuevoRegistro.lote === "" ||
            nuevoRegistro.proveedor === "" 
            // nuevoRegistro.destino === ""
            // nuevoRegistro.responsable === "" ||
        );
    };

    return (
        <div>
            <section className="card">
                <form
                    className="formulario"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddRegistro(e);
                    }}
                >
                    {/* Tipo */}
                    <div className="select">
                        <label style={{ margin: "20px" }}>Tipo:</label>
                        <select
                            style={{ backgroundColor: "transparent", border: "2px solid #ff5ca2" }}
                            name="tipo"
                            value={nuevoRegistro?.tipo || ""}
                            onChange={(e) =>
                                setNuevoRegistro({ ...nuevoRegistro, tipo: e.target.value })
                            }
                            required
                        >
                            <option value="" >
                                -
                            </option>
                            <option value="Ingreso">Ingreso</option>
                            <option value="Egreso">Egreso</option>
                        </select>
                    </div>

                    {/* Nombre */}
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nuevoRegistro?.nombre || ""}
                        onChange={(e) =>
                            setNuevoRegistro({ ...nuevoRegistro, nombre: e.target.value.trim() })
                        }
                        required
                    />

                    {/* Categoría */}
                    <select name="categoria" value={nuevoRegistro.categoria || ""} onChange={(e) =>
                        setNuevoRegistro({ ...nuevoRegistro, categoria: e.target.value.trim() })
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

                    {/* Marca */}
                    <select name="marca" value={nuevoRegistro.marca || ""} onChange={(e) =>
                        setNuevoRegistro({ ...nuevoRegistro, marca: e.target.value.trim() })
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



                        {/* Unidad */}
                        <select name="unidad" value={nuevoRegistro.unidad || ""} onChange={(e) =>
                            setNuevoRegistro({ ...nuevoRegistro, unidad: e.target.value.trim() })
                        } required>
                            <option value="">unidad</option>
                            <option value="miligramos">mg.</option>
                            <option value="gramos">gr.</option>
                            <option value="kilogramos">kg.</option>
                            <option value="litros">lts.</option>
                            <option value="toneladas">t.</option>
                        </select>

                        {/* Stock */}
                        <input
                            type="number"
                            placeholder="Stock"
                            value={nuevoRegistro?.stock || ""}
                            onChange={(e) =>
                                setNuevoRegistro({
                                    ...nuevoRegistro,
                                    stock: Number(e.target.value),
                                })
                            }
                            required
                        />

                        {/* Lote */}
                        <input
                            type="text"
                            placeholder="Lote"
                            value={nuevoRegistro?.lote || ""}
                            onChange={(e) =>
                                setNuevoRegistro({ ...nuevoRegistro, lote: e.target.value.trim() })
                            }
                            required
                        />

                    </div>

                    {/* Proveedor */}
                    <input
                        type="text"
                        placeholder="Proveedor"
                        value={nuevoRegistro?.proveedor || ""}
                        onChange={(e) =>
                            setNuevoRegistro({
                                ...nuevoRegistro,
                                proveedor: e.target.value.trim(),
                            })
                        }
                    />

                    {/* Destino */}

                    <input
                        type="text"
                        placeholder="Destino"
                        value={nuevoRegistro?.destino || ""}
                        onChange={(e) =>
                            setNuevoRegistro({ ...nuevoRegistro, destino: e.target.value.trim() })
                        }
                        disabled={nuevoRegistro?.tipo === "Ingreso"}
                    />

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
    );
};

export default Form_Registro;
