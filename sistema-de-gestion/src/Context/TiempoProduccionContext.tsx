import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import { ModalContext } from "../components/modal/ModalContext";
import { URL_estimacion as URLEst } from "../App";

export interface TiempoProduccion {
    codigoProducto: string;
    tiempoPorUnidad: number;
}

interface TiempoProduccionContextType {
    tiemposProduccion: TiempoProduccion[];
    tiempoProduccionUnitario: number;
    isLoading: boolean;
    agregarTiempoProduccion: (codigoProducto: string, tiempoPorUnidad: number) => Promise<void>;
    obtenerTiemposProduccion: () => Promise<void>;
    obtenerTiempoProduccionUnitario: (codigoProducto: string) => Promise<void>;
    calcularTiempoEstimado: (codigoProducto: string, cantidad: number) => Promise<number | null>;
}

export const TiempoProduccionContext = createContext<TiempoProduccionContextType | undefined>(undefined);

interface TiempoProduccionProviderProps {
    children: ReactNode;
}

export function TiempoProduccionProvider({ children }: TiempoProduccionProviderProps) {
    const [tiemposProduccion, setTiemposProduccion] = useState<TiempoProduccion[]>([]);
    const [tiempoProduccionUnitario, setTiempoProduccionUnitario] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const { setModal } = useContext(ModalContext)!;

    // ✅ Función centralizada para manejar errores HTTP
    const handleFetchError = async (response: Response, defaultMessage: string) => {
        let errorMessage = defaultMessage;
        try {
            const data = await response.json();
            if (data?.message) errorMessage = data.message;
        } catch {
            /* no-op */
        }

        if (response.status === 500) {
            setModal({
                tipo: "error",
                mensaje: errorMessage,
            });
        } else {
            toast.error(errorMessage);
        }

        throw new Error(errorMessage);
    };

    // ➕ Agregar tiempo de producción
    const agregarTiempoProduccion = async (codigoProducto: string, tiempoPorUnidad: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URLEst}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigoProducto, tiempoPorUnidad }),
            });

            if (!response.ok)
                await handleFetchError(response, "Error al registrar el tiempo de producción");

            toast.success("⏱️ Tiempo de producción registrado correctamente");
            await obtenerTiemposProduccion();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // 📋 Obtener todos los tiempos de producción
    const obtenerTiemposProduccion = async () => {
        try {
            const response = await fetch(`${URLEst}/obtener`);
            if (!response.ok)
                await handleFetchError(response, "Error al obtener tiempos de producción");

            const data = await response.json();
            setTiemposProduccion(data);
        } catch {
            toast.error("❌ No se pudieron obtener los tiempos de producción");
        }
    };

    // 🔍 Obtener el tiempo unitario de un producto
    const obtenerTiempoProduccionUnitario = async (codigo: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URLEst}/obtener-tiempo-unitario?codigoProducto=${codigo}`);

            if (!response.ok)
                await handleFetchError(response, "Error al obtener el tiempo de producción");

            const data = await response.json();
            setTiempoProduccionUnitario(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // const obtenerTiempoProduccionUnitario = async (codigo: string): Promise<number | null> => {
    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(`${URLEst}/obtener-tiempo-unitario?codigoProducto=${codigo}`);

    //         if (!response.ok)
    //             await handleFetchError(response, "Error al obtener el tiempo de producción");

    //         const data = await response.json();
    //         return typeof data === "number" ? data : data?.tiempoPorUnidad ?? null;
    //     } catch (error) {
    //         console.error(error);
    //         return null;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // ⏱️ Calcular tiempo estimado total
    const calcularTiempoEstimado = async (codigoProducto: string, cantidad: number): Promise<number | null> => {
        try {
            const response = await fetch(`${URLEst}/calcular?codigoProducto=${codigoProducto}&cantidad=${cantidad}`);
            if (!response.ok)
                await handleFetchError(response, "Error al calcular el tiempo estimado");

            const data = await response.json();
            toast.info(`🕒 Tiempo estimado: ${data.tiempoEstimado} horas`);
            return data.tiempoEstimado;
        } catch {
            toast.error("❌ No se pudo calcular el tiempo estimado");
            return null;
        }
    };

    return (
        <TiempoProduccionContext.Provider
            value={{
                tiemposProduccion,
                tiempoProduccionUnitario,
                isLoading,
                agregarTiempoProduccion,
                obtenerTiemposProduccion,
                obtenerTiempoProduccionUnitario,
                calcularTiempoEstimado,
            }}
        >
            {children}
        </TiempoProduccionContext.Provider>
    );
}
