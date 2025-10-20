import { createContext, useEffect, useState } from "react";

export interface Registro {
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string;
    tipo: string;
    unidad: string;
    stock: number;
    lote: string;
    responsable: string;
    proveedor: string;
    destino: string;
}
interface ModalData {
    tipo: "confirm" | "success" | "error";
    mensaje: string;
    onConfirm?: () => void;
}

interface RegistroContextType {
    modal: ModalData | null;
    setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
    handleAddRegistro: (registro: Registro) => void;
    registros: Registro[];
    setRegistros: React.Dispatch<React.SetStateAction<Registro[]>>;
    error: string | null;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RegistroContext = createContext<RegistroContextType | undefined>(undefined);

interface RegistroProviderProps {
    children: React.ReactNode;
}

export function RegistroProvider({ children }: RegistroProviderProps) {
    // const URL = "http://localhost:8080/movimiento-insumo";
    const URL = "https://tp-principal-backend.onrender.com/movimiento-insumo";
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [modal, setModal] = useState<ModalData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        obtenerRegistros();
    }, []);

    const obtenerRegistros = async () => {
        try {
            setError(null); // Limpia errores anteriores
            const response = await fetch(`${URL}/obtener`);
            if (!response.ok) throw new Error("Error al obtener los insumos");

            const data = await response.json();
            setRegistros(data);
            
        } catch {
            setError("❌ No se pudo conectar con el servidor.");
            setModal({
                tipo: "error",
                mensaje: "El servidor no está disponible.\nIntenta más tarde.",
            });
            setRegistros([]); // limpia listado
        }
    };


    const handleAddRegistro = async (registro: Registro) => {

        if (registros.some((i) => i.codigo === registro.codigo)) {
            setModal({ tipo: "error", mensaje: "Ya existe un registro con ese código" });
            return;
        }

        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registro),
            });

            if (!response.ok) throw new Error("Error al agregar registro");

            const nuevo = await response.json();
            setRegistros([...registros, nuevo]);
            setModal({ tipo: "success", mensaje: "Registro agregado con éxito" });
        } catch (error) {
            console.error("⚠️ Error al agregar registro:", error);
            setModal({
                tipo: "error",
                mensaje: "No se pudo agregar el registro.\nEl servidor podría no estar disponible.",
            });
        }
    };

    return (
        <RegistroContext.Provider
            value={{
                setRegistros,
                registros,
                modal,
                setModal,
                handleAddRegistro,
                error,
                isLoading,
                setIsLoading
            }}
        >
            {children}
        </RegistroContext.Provider>
    );
}
