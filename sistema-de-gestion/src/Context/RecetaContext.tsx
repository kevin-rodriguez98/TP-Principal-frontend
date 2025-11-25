import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { URL_recetas as URL } from "../App";
import { ModalContext } from "../components/modal/ModalContext";

export interface Receta {
    codigoInsumo: string;
    cantidadNecesaria: number;
    nombreInsumo: string;
    unidad: string;
}

interface RecetaContextType {
    insumosProducto: Receta[];
    setInsumosProducto: React.Dispatch<React.SetStateAction<Receta[]>>;
    obtenerInsumosNecesarios: (codigoProducto: string, cantidad: number) => Promise<void>;
    agregarInsumoAReceta: (codigoProducto: string, insumo: Receta) => Promise<void>;
    eliminarInsumoProducto: (codigoProducto: string, codigoInsumo: string) => Promise<void>;
    isLoading: boolean;
}

export const RecetaContext = createContext<RecetaContextType | undefined>(undefined);

export const RecetaProvider = ({ children }: { children: React.ReactNode }) => {
    const { setModal } = useContext(ModalContext)!;
    const [insumosProducto, setInsumosProducto] = useState<Receta[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // ⚙️ Función reutilizable para manejar errores HTTP
    const handleFetchError = async (response: Response, defaultMessage: string) => {
        let errorMessage = defaultMessage;
        try {
            const data = await response.json();
            if (data?.message) errorMessage = data.message;
        } catch { /* no-op */ }
        if (response.status === 500) {
            setModal({ tipo: "error", mensaje: errorMessage });
        } else {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage);
    };

    const agregarInsumoAReceta = async (codigoProducto: string, insumo: Receta) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigoProducto, insumo }),
            });
            if (!response.ok) await handleFetchError(response, "Error al agregar insumo a la receta");
            toast.success("Insumo agregado correctamente a la receta");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo agregar el insumo");
        } finally {
            setIsLoading(false);
        }
    };

    const obtenerInsumosNecesarios = async (codigoProducto: string, cantidad: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${URL}/insumos-necesarios?codigoProducto=${codigoProducto}&cantidad=${cantidad}`
            );
            if (!response.ok) await handleFetchError(response, "Error al obtener insumos necesarios");
            const data = await response.json();
            console.log(data)
            setInsumosProducto(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener insumos necesarios");
        } finally {
            setIsLoading(false);
        }
    };

    const eliminarInsumoProducto = async (codigoProducto: string, codigoInsumo: string) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("codigoProducto", codigoProducto);
            params.append("codigoInsumo", codigoInsumo);

            const response = await fetch(`${URL}/eliminar?${params.toString()}`, {
                method: "POST",
            });

            const data = await response.text();

            if (response.ok) {
                toast.success(data);
                // Actualizar la lista local de insumos
                setInsumosProducto((prev) =>
                    prev.filter((i) => i.codigoInsumo !== codigoInsumo)
                );
            } else {
                toast.error(data || "No se pudo eliminar el insumo");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al comunicarse con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RecetaContext.Provider
            value={{
                insumosProducto,
                setInsumosProducto,
                obtenerInsumosNecesarios,
                agregarInsumoAReceta,
                eliminarInsumoProducto,
                isLoading,
            }}
        >
            {children}
        </RecetaContext.Provider>
    );
};
