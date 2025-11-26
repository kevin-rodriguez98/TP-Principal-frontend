import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { URL_insumos as URL } from "../App";
import { ModalContext } from "../components/modal/ModalContext";

export interface Insumo {
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string;
    unidad: string;
    stock: number;
    umbralMinimoStock: number;
    locacion: Locacion;
}

export interface Locacion {
    deposito: string;
    sector: string;
    estante: string;
    posicion: string;
}

interface InsumoContextType {
    insumos: Insumo[];
    setInsumos: React.Dispatch<React.SetStateAction<Insumo[]>>;
    insumos_bajo_stock: Insumo[];
    setInsumos_bajo_stock: React.Dispatch<React.SetStateAction<Insumo[]>>;

    handleAddInsumo: (insumo: Insumo) => void;
    handleDelete: (codigo: string) => void;
    handleUpdateInsumo: (insumo: Insumo) => void;
    obtenerSiguienteCodigo: () => void;

    error: string | null;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InsumoContext = createContext<InsumoContextType | undefined>(undefined);

interface InsumoProviderProps {
    children: React.ReactNode;
}

export function InsumoProvider({ children }: InsumoProviderProps) {
    const { setModal } = useContext(ModalContext)!;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [insumos_bajo_stock, setInsumos_bajo_stock] = useState<Insumo[]>([]);
    let count = 0;

    useEffect(() => {
        obtenerInsumos();
        obtenerInsumosBajoStock();
        count++;
        console.log(`Se ejecutó ${count} veces`, new Date().toISOString());
    }, []);


    useEffect(() => {
        obtenerInsumosBajoStock();
        count++;
        console.log(`Se ejecutó ${count} veces`, new Date().toISOString());
    }, [insumos]);

    const handleFetchError = async (response: Response, defaultMessage: string) => {
        let errorMessage = defaultMessage;
        try {
            const data = await response.json();
            if (data?.message) errorMessage = data.message;
        } catch {
            /* no-op */
        }

        if (response.status === 500) {
            setModal({ tipo: "error", mensaje: errorMessage });
        } else {
            toast.error(errorMessage);
        }

        throw new Error(errorMessage);
    };

    const obtenerInsumos = async () => {
        setIsLoading(true);
        try {
            setError(null);
            const response = await fetch(`${URL}/obtener`);
            if (!response.ok) await handleFetchError(response, "Error al obtener los insumos");
            const data = await response.json();
            setInsumos(data);
        } catch {
            setError("❌ No se pudo conectar con el servidor.");
            setModal({
                tipo: "error",
                mensaje: "El servidor no está disponible.\nIntenta más tarde.",
            });
            setInsumos([]);
        } finally {
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    const obtenerInsumosBajoStock = async () => {
        try {
            setError(null);
            const response = await fetch(`${URL}/obtener-bajo-stock`);
            if (!response.ok) await handleFetchError(response, "Error al obtener los insumos con bajo stock");
            const data = await response.json();
            setInsumos_bajo_stock(data);
        } catch {
            setError("❌ No se pudo conectar con el servidor.");
            setModal({
                tipo: "error",
                mensaje: "El servidor no está disponible.\nIntenta más tarde.",
            });
            setInsumos_bajo_stock([]);
        }
    };

    const validarInsumo = (insumo: Insumo, esEdicion: boolean) => {
        const errores: Record<string, string> = {};
        const codigoNormalizado = insumo.codigo.trim().toLowerCase();
        const nombreNormalizado = insumo.nombre.trim().toLowerCase();
        const categoriaNormalizada = insumo.categoria.trim().toLowerCase();
        const marcaNormalizada = insumo.marca.trim().toLowerCase();

        if (!esEdicion && insumos.some(i => i.codigo.trim().toLowerCase() === codigoNormalizado)) {
            errores.codigo = "El código ya existe";
        }

        const repetido = insumos.some(i =>
            i.codigo.trim().toLowerCase() !== codigoNormalizado &&
            i.nombre.trim().toLowerCase() === nombreNormalizado &&
            i.categoria.trim().toLowerCase() === categoriaNormalizada &&
            i.marca.trim().toLowerCase() === marcaNormalizada
        );

        if (repetido) {
            errores.nombre = "Ya existe un insumo con el mismo nombre, categoría y marca";
        }

        return errores;
    };

    const handleAddInsumo = async (insumo: Insumo) => {
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

            if (!response.ok) await handleFetchError(response, "Error al agregar el insumo");

            const nuevo = await response.json();
            setInsumos([...insumos, nuevo]);
            toast.success(`¡Se agregó ${insumo.nombre}!`);
        } catch {
            setModal({ tipo: "error", mensaje: "No se pudo agregar el insumo." });
        }
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

            if (!response.ok) await handleFetchError(response, "Error al actualizar insumo");

            const actualizado = await response.json();
            setInsumos(insumos.map(i => (i.codigo === actualizado.codigo ? actualizado : i)));
            toast.success(`¡${insumo.nombre} ha sido editado!`);
        } catch {
            setModal({ tipo: "error", mensaje: "Error al actualizar insumo" });
        }
    };

    const handleDelete = (codigo: string) => {
        setModal({
            tipo: "confirm",
            mensaje: "¿Seguro que deseas eliminar este insumo?",
            onConfirm: async () => {
                try {
                    const response = await fetch(`${URL}/eliminar/${codigo}`, { method: "DELETE" });
                    if (!response.ok) await handleFetchError(response, "Error al eliminar el insumo");

                    setInsumos(insumos.filter(i => i.codigo !== codigo));
                    setModal(null);
                    toast.success("¡Se ha eliminado!");
                } catch {
                    setModal(null);
                    toast.error("No se pudo eliminar el insumo.");
                }
            },
        });
    };

    const obtenerSiguienteCodigo = () => {
        if (insumos.length === 0) return "I001";
        const ultimo = insumos[insumos.length - 1].codigo;
        const numero = parseInt(ultimo.replace(/\D/g, "")); // toma solo los números
        console.log(`Se ejecutó ${count} veces`, new Date().toISOString());
        return `I${(numero + 1).toString().padStart(3, "0")}`;
    };


    return (
        <InsumoContext.Provider
            value={{
                insumos,
                setInsumos,
                insumos_bajo_stock,
                setInsumos_bajo_stock,
                handleAddInsumo,
                handleDelete,
                handleUpdateInsumo,
                obtenerSiguienteCodigo,
                error,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </InsumoContext.Provider>
    );
}
