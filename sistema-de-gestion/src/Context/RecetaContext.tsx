import { createContext, useState } from "react";
import { toast } from "react-toastify";

export interface Receta {
    codigoInsumo: string;
    nombreInsumo: string;
    cantidadNecesaria: number;
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
    // error: string | null;
    isLoading: boolean;
}

export const RecetaContext = createContext<RecetaContextType | undefined>(undefined);

export const RecetaProvider = ({ children }: { children: React.ReactNode }) => {
    // const URL = "http://localhost:8080/recetas";
    const URL = "https://tp-principal-backend.onrender.com/recetas";
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [modal, setModal] = useState<ModalData | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const agregarInsumoAReceta = async (
        codigoProducto: string,
        codigoInsumo: string,
        stockNecesarioInsumo: number
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigoProducto, codigoInsumo, stockNecesarioInsumo }),
            });

            if (!response.ok) {
                let errorMessage = "Error al agregar insumo";
                try {
                    const data = await response.json();
                    if (data?.message) errorMessage = data.message;
                } catch {
                    // Si no es JSON válido, lo dejamos con el mensaje por defecto
                }

                // Mostramos el modal si es 500
                if (response.status === 500) {
                    setModal({
                        tipo: "error",
                        mensaje: errorMessage,
                    });
                }

                throw new Error(errorMessage);
            }

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

            if (!response.ok) {
                let errorMessage = "Error al obtener insumos";
                try {
                    const data = await response.json();
                    if (data?.message) errorMessage = data.message;
                } catch { }

                if (response.status === 500) {
                    setModal({ tipo: "error", mensaje: errorMessage });
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            setRecetas(data);
            toast.success("Receta obtenida correctamente");
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
                modal,
                setModal,
                obtenerInsumosNecesarios,
                agregarInsumoAReceta,
                // error,
                isLoading,
            }}
        >
            {children}
        </RecetaContext.Provider>
    );
};
