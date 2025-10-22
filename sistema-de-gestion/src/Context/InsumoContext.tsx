import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';

export interface Insumo {
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string;
    unidad: string;
    lote: string;
    stock: number;
    umbralMinimoStock: number;
}
interface ModalData {
    tipo: "confirm" | "success" | "error";
    mensaje: string;
    onConfirm?: () => void;
}

interface InsumoContextType {
    insumos: Insumo[];
    setInsumos: React.Dispatch<React.SetStateAction<Insumo[]>>;
    insumos_bajo_stock: Insumo[];
    setInsumos_bajo_stock: React.Dispatch<React.SetStateAction<Insumo[]>>;
    modal: ModalData | null;
    setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
    handleAddInsumo: (insumo: Insumo) => void;
    handleDelete: (codigo: string) => void;
    handleUpdateInsumo: (insumo: Insumo) => void;
    error: string | null;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export const InsumoContext = createContext<InsumoContextType | undefined>(undefined);

interface InsumoProviderProps {
    children: React.ReactNode;
}

export function InsumoProvider({ children }: InsumoProviderProps) {
    // const URL = "http://localhost:8080/insumos";
    const URL = "https://tp-principal-backend.onrender.com/insumos";
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState<ModalData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [insumos_bajo_stock, setInsumos_bajo_stock] = useState<Insumo[]>([]);

    useEffect(() => {
        obtenerInsumos();
    }, []);

    useEffect(() => {
        obtenerInsumosBajoStock();
    }, [insumos]);

    const obtenerInsumos = async () => {
        try {
            setError(null); // Limpia errores anteriores
            const response = await fetch(`${URL}/obtener`);
            if (!response.ok) throw new Error("Error al obtener los insumos");
            const data = await response.json();
            setInsumos(data);
        } catch {
            setError("❌ No se pudo conectar con el servidor.");
            setModal({
                tipo: "error",
                mensaje: "El servidor no está disponible.\nIntenta más tarde.",
            });
            setInsumos([]); // limpia listado
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    const obtenerInsumosBajoStock = async () => {
        try {
            setError(null); // Limpia errores anteriores
            const response = await fetch(`${URL}/obtener-bajo-stock`);
            if (!response.ok) throw new Error("Error al obtener los insumos");

            const data = await response.json();
            setInsumos_bajo_stock(data);
        } catch {
            setError("❌ No se pudo conectar con el servidor.");
            setModal({
                tipo: "error",
                mensaje: "El servidor no está disponible.\nIntenta más tarde.",
            });
            setInsumos_bajo_stock([]); // limpia listado
        }
    };

    const validarInsumo = (insumo: Insumo, esEdicion: boolean) => {
        const errores: Record<string, string> = {};

        const codigoNormalizado = insumo.codigo.trim().toLowerCase();
        const nombreNormalizado = insumo.nombre.trim().toLowerCase();
        const categoriaNormalizada = insumo.categoria.trim().toLowerCase();
        const marcaNormalizada = insumo.marca.trim().toLowerCase();

        // Código repetido
        if (!esEdicion && insumos.some(i => i.codigo.trim().toLowerCase() === codigoNormalizado)) {
            errores.codigo = "El código ya existe";
        }

        // Conjunto repetido: nombre + marca + categoría
        const repetido = insumos.some(i =>
            i.codigo.trim().toLowerCase() !== codigoNormalizado &&
            i.nombre.trim().toLowerCase() === nombreNormalizado &&
            i.categoria.trim().toLowerCase() === categoriaNormalizada &&
            i.marca.trim().toLowerCase() === marcaNormalizada
        );
        if (repetido) errores.nombre = "Ya existe un insumo con el mismo nombre, categoría y marca";

        return errores;
    };

    const handleAddInsumo = async (insumo: Insumo) => {
        console.log("Nuevo insumo:", insumo);
        console.log("Lista actual de insumos:", insumos.map(i => i.codigo));
        const errores = validarInsumo(insumo, false);
        if (Object.keys(errores).length > 0) {
            setModal({ tipo: "error", mensaje: Object.values(errores).join("\n") });
            return;
        }
        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(insumo),
            });
            if (!response.ok) throw new Error();
            const nuevo = await response.json();
            setInsumos([...insumos, nuevo]);
            toast.success(`¡Se agregó ${insumo.nombre}!`);
        } catch {
            setModal({ tipo: "error", mensaje: "No se pudo agregar el insumo." });
            toast.error("Algo salió mal...");
        }
        //   toast.info("Información importante");
        //   toast.warning("Cuidado con esto");
    };

    const handleUpdateInsumo = async (insumo: Insumo) => {
        const errores = validarInsumo(insumo, true);
        if (Object.keys(errores).length > 0) {
            setModal({ tipo: "error", mensaje: Object.values(errores).join("\n") });
            return;
        }
        try {
            const response = await fetch(`${URL}/editar/${insumo.codigo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(insumo),
            });
            if (!response.ok) throw new Error();
            const actualizado = await response.json();
            setInsumos(insumos.map(i => (i.codigo === actualizado.codigo ? actualizado : i)));
            toast.success(`¡${insumo.nombre} ha sido editado!`);
        } catch {
            setModal({ tipo: "error", mensaje: "Error al actualizar insumo" });
            toast.error("Algo salió mal...");
        }
    };

    const handleDelete = async (codigo: string) => {
        setModal({
            tipo: "confirm",
            mensaje: "¿Seguro que deseas eliminar este insumo?",
            onConfirm: async () => {
                try {
                    const response = await fetch(`${URL}/eliminar/${codigo}`, {
                        method: "DELETE",
                    });
                    if (!response.ok) throw new Error();

                    setInsumos(insumos.filter((i) => i.codigo !== codigo));
                    setModal(null);
                    toast.success(`Se ha eliminado!`);
                } catch {
                    setModal(null);
                    toast.error("Algo salió mal...");
                }
            },
        });
    };

    return (
        <InsumoContext.Provider
            value={{
                insumos,
                setInsumos,
                modal,
                setModal,
                handleAddInsumo,
                handleDelete,
                handleUpdateInsumo,
                error,
                isLoading,
                setIsLoading,
                insumos_bajo_stock,
                setInsumos_bajo_stock,
            }}
        >
            {children}
        </InsumoContext.Provider>
    );
}
