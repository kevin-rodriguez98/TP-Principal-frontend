import { useContext, useState, useEffect } from "react";
import { OrdenProduccionContext, type OrdenProduccion } from "../../Context/OrdenesContext";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "../../styles/GestionStock.css";
import SinResultados from "../SinResultados";
import spinner from "/loading.gif";

export interface Columna<T> {
  key: keyof T;
  label: string;
}

const columnasOrden: Columna<OrdenProduccion>[] = [
  { key: "codigo", label: "Código" },
  { key: "producto", label: "Producto" },
  { key: "responsable", label: "Responsable" },
  { key: "estado", label: "Estado" },
];

function ListadoOrden() {
  const {
    ordenFiltradas,
    setOrdenSeleccionada,
    handleDeleteOrden,
    setTipoModal,
    error,
    isLoading,
    setIsLoading,
  } = useContext(OrdenProduccionContext)!;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const currentItems = ordenFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(ordenFiltradas.length / itemsPerPage);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [ordenFiltradas]);

  return (
    <div>
      <table className="tabla-insumos">
        <thead>
          <tr>
            {columnasOrden.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columnasOrden.length + 1} className="spinner-cell">
                <img src={spinner} alt="Cargando..." width={60} height={60} />
                <p>Cargando datos...</p>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columnasOrden.length + 1} className="error-cell">
                <SinResultados titulo={error} mensaje="No encontramos órdenes" />
              </td>
            </tr>
          ) : currentItems.length === 0 ? (
            <tr>
              <td colSpan={columnasOrden.length + 1}>
                <SinResultados titulo="No existen órdenes" mensaje="Intenta más tarde" />
              </td>
            </tr>
          ) : (
            currentItems.map((item) => (
              <tr key={item.codigo}>
                {columnasOrden.map((col) => (
                  <td key={String(col.key)}>
                    {String(item[col.key as keyof OrdenProduccion])}
                  </td>
                ))}
                <td className="actions">
                  <button
                    className="btn-detalles"
                    onClick={() => {
                      setOrdenSeleccionada(item);
                      setTipoModal("detalles");
                    }}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn-editar"
                    onClick={() => {
                      setOrdenSeleccionada(item);
                      setTipoModal("editar");
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleDeleteOrden(item.codigo)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!isLoading && !error && currentItems.length > 0 && (
        <div className="paginacion">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Anterior
          </button>
          <span>
            Página {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default ListadoOrden;