import { useContext, useState, useEffect } from "react";
import "../styles/GestionStock.css";
import spinner from "/loading.gif";
import SinResultados from "./SinResultados.tsx";
import { RegistroContext, type Registro } from "../Context/RegistroContext.tsx";

export interface Columna<T> {
    key: keyof T;
    label: string;
}

const columnasRegistro: Columna<Registro>[] = [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre" },
    { key: "categoria", label: "Categoría" },
    { key: "marca", label: "Marca" },
    { key: "stock", label: "Cantidad" },
    { key: "unidad", label: "Unidad" },
    { key: "lote", label: "Lote" },
    { key: "proveedor", label: "Proveedor" },
    { key: "destino", label: "Destino" },
];

function ListadoRegistro() {
    const { registros, error } = useContext(RegistroContext)!;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = registros.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(registros.length / itemsPerPage);

    // Estados de carga
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [registros]);


    return (
        <div className="tabla-insumos">
            <table>
                <thead>
                    <tr>
                        {columnasRegistro.map((col, i) => (
                            <th key={i}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columnasRegistro.length} className="spinner-cell">
                                <img
                                    src={spinner}
                                    alt="Cargando..."
                                    width={60}
                                    height={60}
                                    className="spinner"
                                />
                                <p>Cargando datos...</p>
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={columnasRegistro.length} className="error-cell">
                                <SinResultados
                                    titulo={error}
                                    mensaje="No encontramos registros"
                                />
                            </td>
                        </tr>
                    ) : currentItems.length === 0 ? (
                        <tr>
                            <td colSpan={columnasRegistro.length}>
                                <SinResultados
                                    titulo="No existen registros"
                                    mensaje= "Intenta mas tarde"
                                />
                            </td>
                        </tr>
                    ) : (
                        currentItems.map((item, i) => (
                            <tr key={i}>
                                {columnasRegistro.map((col) => (
                                    <td key={String(col.key)}>
                                        {String(item[col.key])}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {!isLoading && !error && currentItems.length > 0 && (
                <div className="paginacion">
                    <button
                        disabled={currentPage === 1 || totalPages === 0}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {currentPage} / {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default ListadoRegistro;
