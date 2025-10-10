import { useContext, useState, useEffect } from "react";
import { InsumoContext } from "../Context/InsumoContext";
import "../styles/GestionStock.css";
import spinner from "/loading.gif";
import SinResultados from "../components/SinResultados"; // 👈 importa tu componente

export interface Columna<T> {
    key: keyof T;
    label: string;
}

interface ListadoProps<T> {
    lista: T[];
    columnas: Columna<T>[];
}

function Listado<T extends object>({ lista = [], columnas }: ListadoProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = lista.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(lista.length / itemsPerPage);

    // Estados locales de carga y error
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const { setInsumoEditar, handleDelete, setTipoModal } =
        useContext(InsumoContext)!;

    // ⏳ Simular carga y detectar error si no hay datos
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!lista || lista.length === 0) {
                setHasError(true);
            }
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [lista]);

    return (
        <div>
            <table className="tabla-insumos">
                <thead>
                    <tr>
                        {columnas.map((col, i) => (
                            <th key={i}>{col.label}</th>
                        ))}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columnas.length + 1} className="spinner-cell">
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
                    ) : hasError ? (
                        <tr>
                            <td colSpan={columnas.length + 1}>
                                <SinResultados /> {/* 👈 tu componente cuando el back falla */}
                            </td>
                        </tr>
                    ) : currentItems.length === 0 ? (
                        <tr>
                            <td colSpan={columnas.length + 1}>
                                <SinResultados />
                            </td>
                        </tr>
                    ) : (
                        currentItems.map((item, i) => (
                            <tr key={i}>
                                {columnas.map((col) => (
                                    <td key={String(col.key)}>{String(item[col.key])}</td>
                                ))}
                                <td className="actions">
                                    <button
                                        className="btn-editar"
                                        onClick={() => {
                                            setInsumoEditar(item as any);
                                            setTipoModal("editar");
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn-eliminar"
                                        onClick={() =>
                                            handleDelete && handleDelete((item as any).codigo)
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {!isLoading && !hasError && currentItems.length > 0 && (
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

export default Listado;
