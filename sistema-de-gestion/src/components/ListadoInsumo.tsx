import { useContext, useState, useEffect } from "react";
import { InsumoContext } from "../Context/InsumoContext.tsx";
import "../styles/GestionStock.css";
import spinner from "/loading.gif";
import SinResultados from "./SinResultados.tsx";
import type { Insumo } from "../Context/InsumoContext.tsx";

export interface Columna<T> {
    key: keyof T;
    label: string;
}

const columnasInsumo: Columna<Insumo>[] = [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre" },
    { key: "categoria", label: "Categoría" },
    { key: "marca", label: "Marca" },
    { key: "stock", label: "Cantidad" },
    { key: "unidad", label: "Unidad" },
    { key: "lote", label: "Lote" },
];

function ListadoInsumo() {
    const { insumos, setInsumoEditar, handleDelete, setTipoModal, error } =
        useContext(InsumoContext)!;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const currentItems = insumos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(insumos.length / itemsPerPage);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, [insumos]);

    return (
        <div>
            <table className="tabla-insumos">
                <thead>
                    <tr>
                        {columnasInsumo.map((col) => (
                            <th key={col.key as string}>{col.label}</th>
                        ))}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columnasInsumo.length + 1} className="spinner-cell">
                                <img src={spinner} alt="Cargando..." width={60} height={60} />
                                <p>Cargando datos...</p>
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={columnasInsumo.length + 1} className="error-cell">
                                <SinResultados
                                    titulo={error}
                                    mensaje="No encontramos insumos"
                                />
                            </td>
                        </tr>
                    ) : currentItems.length === 0 ? (
                        <tr>
                            <td colSpan={columnasInsumo.length + 1}>
                                <SinResultados
                                    titulo="No existen insumos"
                                    mensaje="Intenta mas tarde"
                                />
                            </td>
                        </tr>
                    ) : (
                        currentItems.map((item) => (
                            <tr key={item.codigo}>
                                {columnasInsumo.map((col) => (
                                    <td key={String(col.key)}>{String(item[col.key])}</td>
                                ))}
                                <td className="actions">
                                    <button
                                        className="btn-editar"
                                        onClick={() => {
                                            setInsumoEditar(item);
                                            setTipoModal("editar");
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn-eliminar"
                                        onClick={() => handleDelete(item.codigo)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {!isLoading && !error && currentItems.length > 0 && (
                <div className="paginacion">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
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

export default ListadoInsumo;
