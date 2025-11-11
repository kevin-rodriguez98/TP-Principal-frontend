import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { URL_recetas as URL } from "../App";
import { ModalContext } from "../components/modal/ModalContext";

export interface Receta {
    codigoInsumo: string;
    stockNecesarioInsumo: number;
    nombreInsumo: string;
    unidad: string;
}

interface RecetaContextType {
    recetas: Receta[];
    setRecetas: React.Dispatch<React.SetStateAction<Receta[]>>;
    obtenerInsumosNecesarios: (codigoProducto: string, cantidad: number) => Promise<void>;
    agregarInsumoAReceta: (codigoProducto:string,  insumo: Receta) => Promise<void>;
    isLoading: boolean;
}

export const RecetaContext = createContext<RecetaContextType | undefined>(undefined);

export const RecetaProvider = ({ children }: { children: React.ReactNode }) => {
    const { setModal } = useContext(ModalContext)!;
    const [recetas, setRecetas] = useState<Receta[]>([]);
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

    const agregarInsumoAReceta = async ( codigoProducto: string, insumo: Receta ) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({codigoProducto, insumo}),
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
            setRecetas(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener insumos necesarios");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RecetaContext.Provider
            value={{
                recetas,
                setRecetas,
                obtenerInsumosNecesarios,
                agregarInsumoAReceta,
                isLoading,
            }}
        >
            {children}
        </RecetaContext.Provider>
    );
};
