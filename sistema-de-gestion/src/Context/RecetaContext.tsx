import { createContext, useState } from "react";
import { toast } from "react-toastify";

export interface Receta {
    codigoInsumo: string;
    nombre: string;
    stockNecesario: number;
}

interface ModalData {
    tipo: "confirm" | "success" | "error";
    mensaje: string;
    onConfirm?: () => void;
}

interface RecetaContextType {
    recetas: Receta[];
    setRecetas: React.Dispatch<React.SetStateAction<Receta[]>>;
    modal: ModalData | null;
    setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
    obtenerInsumosNecesarios: (codigoProducto: string, cantidad: number) => Promise<void>;
    agregarInsumoAReceta: (
        codigoProducto: string,
        codigoInsumo: string,
        stockNecesarioInsumo: number
    ) => Promise<void>;
    error: string | null;
    isLoading: boolean;
}

export const RecetaContext = createContext<RecetaContextType | undefined>(undefined);

export const RecetaProvider = ({ children }: { children: React.ReactNode }) => {
    // const URL = "http://localhost:8080/recetas";
    const URL = "https://tp-principal-backend.onrender.com/recetas";
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [modal, setModal] = useState<ModalData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const obtenerInsumosNecesarios = async (codigoProducto: string, cantidad: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${URL}/insumos-necesarios?codigoProducto=${codigoProducto}&cantidad=${cantidad}`
            );
            if (!response.ok) throw new Error("Error al obtener insumos");
            const data = await response.json();
            setRecetas(data);
            toast.success("Receta obtenida correctamente");
        } catch (error) {
            setError("No se pudo obtener la receta");
            toast.error("Error al obtener insumos necesarios");
        } finally {
            setIsLoading(false);
        }
    };

    const agregarInsumoAReceta = async ( codigoProducto: string, codigoInsumo: string, stockNecesarioInsumo: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigoProducto, codigoInsumo, stockNecesarioInsumo }),
            });
            if (!response.ok) throw new Error("Error al agregar insumo");
            toast.success("Insumo agregado correctamente a la receta");
        } catch (error) {
            toast.error("No se pudo agregar el insumo");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RecetaContext.Provider
            value={{
                recetas,
                setRecetas,
                modal,
                setModal,
                obtenerInsumosNecesarios,
                agregarInsumoAReceta,
                error,
                isLoading,
            }}
        >
            {children}
        </RecetaContext.Provider>
    );
};
