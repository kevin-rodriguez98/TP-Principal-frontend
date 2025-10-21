import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';

export interface movimiento_insumo {
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string;
    tipo: string;
    unidad: string;
    stock: number;
    lote: string;
    proveedor: string;

    // creationUsername: string;
}

interface ModalData {
    tipo: "confirm" | "success" | "error";
    mensaje: string;
    onConfirm?: () => void;
}

interface Movimiento_insumo_contextType {
    modal: ModalData | null;
    setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;

    movimiento_insumos: movimiento_insumo[];
    setMovimiento_insumos: React.Dispatch<React.SetStateAction<movimiento_insumo[]>>;

    handleAdd_Movimiento_insumo: (mov: movimiento_insumo) => void;
    error: string | null;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Movimiento_insumo_context = createContext<Movimiento_insumo_contextType | undefined>(undefined);

interface Movimiento_insumoProviderProps {
    children: React.ReactNode;
}

export function Movimiento_insumo_contextProvider({ children }: Movimiento_insumoProviderProps) {
    const URL = "http://localhost:8080/movimiento-insumo";
    // const URL = "https://tp-principal-backend.onrender.com/movimiento-insumo";
    const [movimiento_insumos, setMovimiento_insumos] = useState<movimiento_insumo[]>([]);
    const [modal, setModal] = useState<ModalData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        obtenermovimientos_insumo();
    }, []);

    const obtenermovimientos_insumo = async () => {
        try {
            setError(null); // Limpia errores anteriores
            const response = await fetch(`${URL}/obtener-ingreso`);
            if (!response.ok) throw new Error("Error al obtener los insumos");

            const data = await response.json();
            setMovimiento_insumos(data);

        } catch {
            setError("❌ No se pudo conectar con el servidor.");
            setModal({
                tipo: "error",
                mensaje: "El servidor no está disponible.\nIntenta más tarde.",
            });
            setMovimiento_insumos([]); // limpia listado
        }
    };

    const handleAdd_Movimiento_insumo = async (mov: movimiento_insumo) => {

        if (movimiento_insumos.some((i) => i.codigo === mov.codigo)) {
            setModal({ tipo: "error", mensaje: "Ya existe un registro de insumo con ese código" });
            return;
        }

        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mov),
            });

            if (!response.ok) throw new Error("Error al agregar insumo");

            const nuevo = await response.json();
            setMovimiento_insumos([...movimiento_insumos, nuevo]);
            toast.success(`¡Se agregó ${mov.nombre}!`);
        } catch (error) {
            console.error("⚠️ Error al agregar insumo:", error);
            toast.error("Algo salió mal...");
        }
    };

    return (
        <Movimiento_insumo_context.Provider
            value={{
                setMovimiento_insumos,
                movimiento_insumos,
                modal,
                setModal,
                handleAdd_Movimiento_insumo,
                error,
                isLoading,
                setIsLoading
            }}
        >
            {children}
        </Movimiento_insumo_context.Provider>
    );
}
