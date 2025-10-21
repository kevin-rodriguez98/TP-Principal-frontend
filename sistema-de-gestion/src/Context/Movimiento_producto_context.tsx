import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';

export interface movimiento_producto {
    // id: number;
    // impactado: boolean;
    // creationUsername: string;
    // fecha:Date,

    codigoProducto: string;
    // nombre: string,
    // categoria: string;
    // marca: string; 
    // unidad:string;
    // lote:string;
    cantidad: number;
    tipo: string;
    destino: string,
}
interface ModalData {
    tipo: "confirm" | "success" | "error";
    mensaje: string;
    onConfirm?: () => void;
}

interface Movimiento_productoContextType {
    modal: ModalData | null;
    setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;

    movimiento_productos: movimiento_producto[];
    setMovimiento_productos: React.Dispatch<React.SetStateAction<movimiento_producto[]>>;

    handleAdd_Movimiento_producto: (registro: movimiento_producto) => void;
    error: string | null;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Movimiento_producto_context = createContext<Movimiento_productoContextType | undefined>(undefined);

interface Movimiento_producto_contextProviderProps {
    children: React.ReactNode;
}

export function Movimiento_producto_contextProvider({ children }: Movimiento_producto_contextProviderProps) {
    const URL = "http://localhost:8080/movimiento-producto";
    // const URL = "https://tp-principal-backend.onrender.com/movimiento-producto";
    const [movimiento_productos, setMovimiento_productos] = useState<movimiento_producto[]>([]);
    const [modal, setModal] = useState<ModalData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        obtenermovimientos_producto();
    }, []);

    const obtenermovimientos_producto = async () => {
        try {
            setError(null); // Limpia errores anteriores
            const response = await fetch(`${URL}/obtener`);
            if (!response.ok) throw new Error("Error al obtener los insumos");

            const data = await response.json();
            setMovimiento_productos(data);

        } catch {
            setError("❌ No se pudo conectar con el servidor.");
            setModal({
                tipo: "error",
                mensaje: "El servidor no está disponible.\nIntenta más tarde.",
            });
            setMovimiento_productos([]); // limpia listado
        }
    };

    const handleAdd_Movimiento_producto = async (mov: movimiento_producto) => {
        if (movimiento_productos.some((i) => i.codigoProducto === mov.codigoProducto)) {
            setModal({ tipo: "error", mensaje: "Ya existe un registro con ese código" });
            return;
        }
        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mov),
            });
            if (!response.ok) throw new Error("Error al agregar registro");
            const nuevo = await response.json();
            setMovimiento_productos([...movimiento_productos, nuevo]);
            toast.success(`¡Se agregó ${mov.codigoProducto}!`);
        } catch (error) {
            console.error("⚠️ Error al agregar registro:", error);
            toast.error("Algo salió mal...");
        }
    };

    return (
        <Movimiento_producto_context.Provider
            value={{
                setMovimiento_productos,
                movimiento_productos,
                modal,
                setModal,
                handleAdd_Movimiento_producto,
                error,
                isLoading,
                setIsLoading
            }}
        >
            {children}
        </Movimiento_producto_context.Provider>
    );
}
