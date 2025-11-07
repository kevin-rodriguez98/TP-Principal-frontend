import { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { URL_ingresos as URL } from "../App";
import { ModalContext } from "../components/modal/ModalContext";

export interface movimiento_insumo {
    codigoInsumo: string;

    nombre: string;
    categoria: string;
    marca: string;


    tipo: string;
    unidad: string;
    stock: number;
    lote: string;
    proveedor: string;
}

interface Movimiento_insumo_contextType {
    movimiento_insumos: movimiento_insumo[];
    setMovimiento_insumos: React.Dispatch<React.SetStateAction<movimiento_insumo[]>>;
    handleAdd_Movimiento_insumo: (mov: movimiento_insumo) => Promise<void>;
    error: string | null;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Movimiento_insumo_context = createContext<Movimiento_insumo_contextType | undefined>(undefined);

interface Movimiento_insumoProviderProps {
    children: React.ReactNode;
}

export function Movimiento_insumo_contextProvider({ children }: Movimiento_insumoProviderProps) {
    const { setModal } = useContext(ModalContext)!;
    const [movimiento_insumos, setMovimiento_insumos] = useState<movimiento_insumo[]>([]);
    const [error, setError] = useState<string | null>(null);
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

    useEffect(() => {
        obtenermovimientos_insumo();
    }, []);

    const obtenermovimientos_insumo = async () => {
        setIsLoading(true);
        try {
            setError(null);
            const response = await fetch(`${URL}/obtener-ingreso`);
            if (!response.ok) await handleFetchError(response, "Error al obtener los movimientos de insumos");

            const data = await response.json();
            setMovimiento_insumos(data);
        } catch (err: any) {
            setError(err.message);
            setMovimiento_insumos([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd_Movimiento_insumo = async (mov: movimiento_insumo) => {

        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mov),
            });

            if (!response.ok) await handleFetchError(response, "Error al agregar insumo");

            const nuevo = await response.json();
            setMovimiento_insumos([...movimiento_insumos, nuevo]);
            toast.success(`¡Se agregó ${mov.nombre}!`);
        } catch (err) {
            console.error("⚠️ Error al agregar insumo:", err);
            toast.error("Algo salió mal...");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Movimiento_insumo_context.Provider
            value={{
                setMovimiento_insumos,
                movimiento_insumos,
                handleAdd_Movimiento_insumo,
                error,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </Movimiento_insumo_context.Provider>
    );
}
