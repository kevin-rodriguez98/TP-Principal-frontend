import { createContext, useEffect, useState } from "react";

export interface Registro {
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string;
    unidad: string;
    stock: number;
    lote: string;
    proveedor: string;
    tipo: string;
    destino: string | "";
}

interface ModalData {
    tipo: "confirm" | "success" | "error";
    mensaje: string;
    onConfirm?: () => void;
}

interface RegistroContextType {
    modal: ModalData | null;
    setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
    handleAddRegistro: (e: React.FormEvent) => void;
    registros: Registro[];
    setRegistros: React.Dispatch<React.SetStateAction<Registro[]>>;
    nuevoRegistro: Registro;
    setNuevoRegistro: React.Dispatch<React.SetStateAction<Registro>>;
    open: "movimiento" | null;
    setOpen: React.Dispatch<React.SetStateAction<"movimiento" | null>>;
    error: string | null;
}

export const RegistroContext = createContext<RegistroContextType | undefined>(undefined);

interface RegistroProviderProps {
    children: React.ReactNode;
}

export function RegistroProvider({ children }: RegistroProviderProps) {
    const URL = "http://localhost:8080/movimiento-insumo";
    // const URL = "https://tp-principal-backend.onrender.com/movimiento-insumo";
    const [open, setOpen] = useState<"movimiento" | null>(null);
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [nuevoRegistro, setNuevoRegistro] = useState<Registro>({
        codigo: "",
        nombre: "",
        categoria: "",
        marca: "",
        unidad: "",
        stock: 1,
        lote: "",
        tipo: "",
        proveedor: "",
        destino: ""
    });

    const [modal, setModal] = useState<ModalData | null>(null);
    const [error, setError] = useState<string | null>(null);

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
                mensaje: "El servidor no está disponible. Intenta más tarde.",
            });
            setRegistros([]); // limpia listado
        }
    };

    const handleAddRegistro = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registros.some((i) => i.codigo === nuevoRegistro.codigo)) {
            setModal({ tipo: "error", mensaje: "Ya existe un registro con ese código" });
            return;
        }

        const registroParaEnviar = {
            codigo: String(nuevoRegistro.codigo),
            nombre: String(nuevoRegistro.nombre),
            categoria: String(nuevoRegistro.categoria),
            marca: String(nuevoRegistro.marca),
            unidad: String(nuevoRegistro.unidad),
            stock: Number(nuevoRegistro.stock),
            lote: String(nuevoRegistro.lote),
            tipo: String(nuevoRegistro.tipo),
        };

        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registroParaEnviar),
            });

            if (!response.ok) throw new Error("Error al agregar registro");

            const nuevo = await response.json();
            setRegistros([...registros, nuevo]);
            setNuevoRegistro({
                codigo: "",
                nombre: "",
                categoria: "",
                marca: "",
                unidad: "",
                stock: 1,
                lote: "",
                tipo: "",
                proveedor: "",
                destino: ""
            });
            setModal({ tipo: "success", mensaje: "Registro agregado con éxito" });
        } catch (error) {
            console.error("⚠️ Error al agregar registro:", error);
            setModal({
                tipo: "error",
                mensaje: "No se pudo agregar el registro. El servidor podría no estar disponible.",
            });
        }
    };

    return (
        <RegistroContext.Provider
            value={{
                setNuevoRegistro,
                setRegistros,
                registros,
                nuevoRegistro,
                modal,
                setModal,
                handleAddRegistro,
                open,
                setOpen,
                error
            }}
        >
            {children}
        </RegistroContext.Provider>
    );
}
