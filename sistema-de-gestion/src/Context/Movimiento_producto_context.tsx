import { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { URL_egresos as URL } from "../App";
import { ModalContext } from "../components/modal/ModalContext";

export interface movimiento_producto {
    codigoProducto: string;
    cantidad: number;
    tipo: string;
    destino: string;
    categoria: string;
    marca: string;
    unidad: string;
    lote: string;
    nombre: string;
}

interface Movimiento_productoContextType {
    movimiento_productos: movimiento_producto[];
    setMovimiento_productos: React.Dispatch<React.SetStateAction<movimiento_producto[]>>;
    handleAdd_Movimiento_producto: (registro: movimiento_producto) => Promise<void>;
    error: string | null;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Movimiento_producto_context = createContext<Movimiento_productoContextType | undefined>(undefined);

interface Movimiento_producto_contextProviderProps {
    children: React.ReactNode;
}

export function Movimiento_producto_contextProvider({ children }: Movimiento_producto_contextProviderProps) {
    const { setModal } = useContext(ModalContext)!;
    const [movimiento_productos, setMovimiento_productos] = useState<movimiento_producto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // ⚙️ Función reutilizable para manejar errores HTTP
    const handleFetchError = async (response: Response, defaultMessage: string) => {
        let errorMessage = defaultMessage;
        try {
            const data = await response.json();
            if (data?.message || data?.mensaje) errorMessage = data.message || data.mensaje;
        } catch { /* no-op */ }

        if (response.status === 500) {
            setModal({ tipo: "error", mensaje: errorMessage });
        } else {
            toast.error(errorMessage);
        }

        throw new Error(errorMessage);
    };

    useEffect(() => {
        obtenermovimientos_producto();
    }, []);

    const obtenermovimientos_producto = async () => {
        setIsLoading(true);
        try {
            setError(null);
            const response = await fetch(`${URL}/obtener`);
            if (!response.ok) await handleFetchError(response, "Error al obtener los movimientos.");

            const data = await response.json();
            setMovimiento_productos(data);
        } catch (err: any) {
            console.error("❌ Error al obtener movimientos:", err);
            setError(err.message);
            setModal({
                tipo: "error",
                mensaje: "El servidor no está disponible.\nIntenta más tarde.",
            });
            setMovimiento_productos([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd_Movimiento_producto = async (mov: movimiento_producto) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mov),
            });

            if (!response.ok) await handleFetchError(response, "Error al agregar movimiento");

            const nuevo = await response.json();
            setMovimiento_productos(prev => [...prev, nuevo]);
            toast.success(`✅ ¡Se agregó ${mov.codigoProducto}!`);
        } catch (err: any) {
            console.error("⚠️ Error al agregar movimiento:", err);
            setModal({
                tipo: "error",
                mensaje: "No se pudo conectar con el servidor.",
            });
            toast.error("❌ Algo salió mal...");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Movimiento_producto_context.Provider
            value={{
                setMovimiento_productos,
                movimiento_productos,
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
