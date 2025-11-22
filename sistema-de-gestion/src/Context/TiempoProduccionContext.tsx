import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import { ModalContext } from "../components/modal/ModalContext";
import { URL_estimacion as URLEst } from "../App";

export interface TiempoProduccion {
    codigoProducto: string;
    tiempoPreparacion: number;
    tiempoCiclo: number;
    maximoTanda: number;
}

export interface TiempoProduccionResponse {
    tiempoPreparacion: number;
    tiempoCiclo: number;
    tiempoTotal: number;
    cantidadMaximaTanda: number;

    codigo: string;

}
export interface TiempoProduccionGeneral {
    tiempoPreparacion: number;
    tiempoCiclo: number;
    tiempoTotal: number;
    cantidaTanda: number;

    codigo: string;
    nombre: string;
    categoria: string;
    linea: string;

}

interface TiempoProduccionContextType {
    tiempoProduccion: TiempoProduccionResponse;
    tiempos: TiempoProduccionGeneral[];
    obtenerTiemposProduccion: () => Promise<void>;
    isLoading: boolean;
    error: string;
    agregarTiempoProduccion: (codigoProducto: string, data: TiempoProduccion) => Promise<void>;
    obtenerTiempoProduccionUnitario: (codigoProducto: string) => Promise<TiempoProduccionResponse | null>;

}

export const TiempoProduccionContext = createContext<TiempoProduccionContextType | undefined>(undefined);

interface TiempoProduccionProviderProps {
    children: ReactNode;
}

export function TiempoProduccionProvider({ children }: TiempoProduccionProviderProps) {
    const [tiempoProduccion, setTiemposProduccion] = useState<TiempoProduccionResponse>({
        codigo: "",
        tiempoPreparacion: 0,
        tiempoCiclo: 0,
        tiempoTotal: 0,
        cantidadMaximaTanda: 0,
    });

    const [tiempos, setTiempos] = useState<TiempoProduccionGeneral[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { setModal } = useContext(ModalContext)!;

    useEffect(() => {
        obtenerTiemposProduccion();
    }, []);

    const handleFetchError = async (response: Response, defaultMessage: string) => {
        let errorMessage = defaultMessage;
        try {
            const data = await response.json();
            if (data?.message) errorMessage = data.message;
        } catch { }
        if (response.status === 500) {
            setModal({ tipo: "error", mensaje: errorMessage });
        } else {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage);
    };

    // ➕ Agregar tiempo de producción
    const agregarTiempoProduccion = async (codigoProducto: string, data: TiempoProduccion) => {
        setIsLoading(true);
        data.codigoProducto= codigoProducto;
        try {
            const response = await fetch(`${URLEst}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) await handleFetchError(response, "Error al registrar el tiempo de producción");

            toast.success("⏱️ Tiempo de producción registrado correctamente");
            setModal({ tipo: "success", mensaje: "Tiempo de producción registrado correctamente" });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔍 Obtener el tiempo unitario de un producto
    const obtenerTiempoProduccionUnitario = async (
        codigoProducto: string
    ): Promise<TiempoProduccionResponse | null> => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${URLEst}/obtener-tiempo-unitario?codigoProducto=${codigoProducto}`
            );

            if (!response.ok)
                await handleFetchError(response, "Error al obtener el tiempo unitario");

            const data: TiempoProduccionResponse = await response.json();
            setTiemposProduccion(data);

            return data; // 🔥 RETORNA EL TIEMPO
        } catch (error) {
            console.error(error);
            return null; // para evitar never
        } finally {
            setIsLoading(false);
        }
    };


    // 📋 Obtener todos los tiempos de producción
    const obtenerTiemposProduccion = async () => {
        try {
            const response = await fetch(`${URLEst}/obtener`);
            if (!response.ok) await handleFetchError(response, "Error al obtener tiempos de producción");

            const data = await response.json();
            const listaTransformada = data.map((item: any) => ({
                ...item,

                codigo: item.producto?.codigo || "",
                nombre: item.producto?.nombre || "",
                categoria: item.producto?.categoria || "",
                linea: item.producto?.linea || "",
            }));
            console.log(data)
            setTiempos(listaTransformada);
        } catch {
            toast.error("❌ No se pudieron obtener los tiempos de producción");
            setError("❌ No se pudieron obtener los tiempos de producción");
        }
    };




    return (
        <TiempoProduccionContext.Provider
            value={{
                tiempoProduccion,
                tiempos,
                isLoading,
                error,
                obtenerTiemposProduccion,
                agregarTiempoProduccion,
                obtenerTiempoProduccionUnitario
            }}
        >
            {children}
        </TiempoProduccionContext.Provider>
    );
}
