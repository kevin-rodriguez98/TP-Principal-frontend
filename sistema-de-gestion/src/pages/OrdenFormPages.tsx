import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ModalAgregarInsumo from "../components/modal/ModalAgregarInsumo";
import Modal from "../components/modal/Modal";
import { OrdenProduccionContext, type Insumo } from "../Context/OrdenesContext";
import "../styles/Ordenes.css";

const OrdenFormPage = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();

  const {
    obtenerOrdenPorCodigo,
    ordenSeleccionada,
    setOrdenSeleccionada,
    handleAddOrden,
    setTipoModal,
    tipoModal,
    setFiltros,
    isLoading,
    setIsLoading,
    modal,
    setModal
  } = useContext(OrdenProduccionContext)!;

  const [orden, setOrden] = useState(ordenSeleccionada || {
    codigo: "",
    producto: "",
    unidad: "",
    responsable: "",
    estado: "PENDIENTE",
    cantidadPlaneada: 0,
    cantidadFinal: 0,
    fechaInicio: "",
    fechaFin: "",
    fechaCreacion: "",
    insumos: [] as Insumo[],
  });

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const isDetalles = tipoModal === "detalles";

  useEffect(() => {
    if (codigo) {
      obtenerOrdenPorCodigo(codigo);
      setTipoModal("editar");
    } else {
      setTipoModal("alta");
    }
  }, [codigo]);

  useEffect(() => {
    if (ordenSeleccionada) setOrden(ordenSeleccionada);
  }, [ordenSeleccionada]);

  const handleChange = (key: string, value: any) => {
    setOrden({ ...orden, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDetalles) return;

    try {
      setIsLoading(true);
      await handleAddOrden(orden);
      setModal({ tipo: "success", mensaje: "Orden guardada con éxito" });

      const ordenInicial = {
        codigo: "",
        producto: "",
        unidad: "",
        responsable: "",
        estado: "PENDIENTE",
        cantidadPlaneada: 0,
        cantidadFinal: 0,
        fechaInicio: "",
        fechaFin: "",
        fechaCreacion: "",
        insumos: [] as Insumo[],
      };
      setOrden(ordenInicial);
      if (setOrdenSeleccionada) setOrdenSeleccionada(ordenInicial);
      setFiltros({ estado: "TODOS", codigo: "", producto: "", responsable: "" });
    } catch {
      setModal({ tipo: "error", mensaje: "Error al guardar la orden" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 ordenes-main">
        <section className="card orden-container">
          <h2>
            {tipoModal === "alta"
              ? "Nueva orden de producción"
              : tipoModal === "editar"
              ? "Editar orden"
              : "Detalles de orden"}
          </h2>

          <form className="orden-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {[
                { label: "Código", key: "codigo", editable: false },
                { label: "Producto", key: "producto", editable: !isDetalles },
                { label: "Unidad", key: "unidad", editable: !isDetalles },
                { label: "Responsable", key: "responsable", editable: !isDetalles },
                { label: "Estado", key: "estado", editable: !isDetalles },
                { label: "Cantidad planeada", key: "cantidadPlaneada", type: "number", editable: !isDetalles },
                { label: "Cantidad final", key: "cantidadFinal", type: "number", editable: !isDetalles },
                { label: "Fecha inicio", key: "fechaInicio", type: "date", editable: !isDetalles },
                { label: "Fecha fin", key: "fechaFin", type: "date", editable: !isDetalles },
                { label: "Fecha creación", key: "fechaCreacion", type: "date", editable: false },
              ].map((field) => (
                <React.Fragment key={field.key}>
                  <label>{field.label}:</label>
                  <input
                    type={field.type || "text"}
                    value={orden[field.key as keyof typeof orden]}
                    disabled={!field.editable}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </React.Fragment>
              ))}
            </div>

            {!isDetalles && (
              <div className="insumos-section">
                <h3>Insumos asignados:</h3>

                <button className="btn-agregar" onClick={() => setShowModalAgregar(true)}>
                  + Agregar insumo
                </button>

                {orden.insumos.length === 0 ? (
                  <p>No hay insumos asignados a esta orden.</p>
                ) : (
                  <table className="tabla-insumos">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Unidad</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orden.insumos.map((insumo, index) => (
                        <tr key={index}>
                          <td>{insumo.codigo}</td>
                          <td>{insumo.nombre}</td>
                          <td>{insumo.unidad}</td>
                          <td>{insumo.cantidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="botones-form">
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => navigate("/ordenes-produccion")}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-guardar">
                    Guardar
                  </button>
                </div>

                {showModalAgregar && (
                  <ModalAgregarInsumo
                    onClose={() => setShowModalAgregar(false)}
                    onSave={(nuevoInsumo) => {
                      setOrden({
                        ...orden,
                        insumos: [...orden.insumos, nuevoInsumo],
                      });
                      if (setOrdenSeleccionada)
                        setOrdenSeleccionada({
                          ...orden,
                          insumos: [...orden.insumos, nuevoInsumo],
                        });
                      setShowModalAgregar(false);
                    }}
                  />
                )}
              </div>
            )}
          </form>
        </section>
      </main>
      <Footer />

      {modal && (
        <Modal
          tipo={modal.tipo}
          mensaje={modal.mensaje}
          onConfirm={() => setModal(null)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default OrdenFormPage;