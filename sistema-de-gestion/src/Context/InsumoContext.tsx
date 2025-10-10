import { createContext, useEffect, useState } from "react";

export interface Insumo {
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string;
    unidad: string;
    stock: number;
    lote: string;
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
    nuevoInsumo: Insumo;
    setNuevoInsumo: React.Dispatch<React.SetStateAction<Insumo>>;
    insumoEditar: Insumo | null;
    setInsumoEditar: React.Dispatch<React.SetStateAction<Insumo | null>>;
    modal: ModalData | null;
    setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
    handleAddInsumo: (e: React.FormEvent) => void;
    handleDelete: (codigo: string) => void;
    handleUpdateInsumo: (e: React.FormEvent) => void;
    tipoModal: "alta" | "editar" | "movimiento" | null;
    setTipoModal: React.Dispatch<React.SetStateAction<"alta" | "editar" | "movimiento" | null>>;
}

export const InsumoContext = createContext<InsumoContextType | undefined>(
    undefined
);

interface InsumoProviderProps {
    children: React.ReactNode;
}

export function InsumoProvider({ children }: InsumoProviderProps) {
    const URL = "http://localhost:8080/productos/insumos"
    const [tipoModal, setTipoModal] = useState<"alta" | "editar" | "movimiento" | null>(null);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [insumoEditar, setInsumoEditar] = useState<Insumo | null>(null);
    const [nuevoInsumo, setNuevoInsumo] = useState<Insumo>({
        codigo: "",
        nombre: "",
        categoria: "",
        marca: "",
        unidad: "",
        stock: 0,
        lote: "",
        umbralMinimoStock: 0,
    });
    const [modal, setModal] = useState<ModalData | null>(null);
    // const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${URL}/obtener`)
            .then((response) => response.json())
            .then((data) => {
                setInsumos(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);


// === Agregar Insumo ===
const handleAddInsumo = (e: React.FormEvent) => {
    e.preventDefault();

    if (
        !nuevoInsumo.codigo.trim() ||
        !nuevoInsumo.nombre.trim() ||
        !nuevoInsumo.categoria.trim() ||
        !nuevoInsumo.marca.trim() ||
        !nuevoInsumo.unidad.trim() ||
        nuevoInsumo.stock <= 0 ||
        !nuevoInsumo.lote.trim()
    ) {
        setModal({
            tipo: "error",
            mensaje: "Todos los campos son obligatorios y deben ser válidos",
        });
        return;
    }

    if (insumos.some((i) => i.codigo === nuevoInsumo.codigo)) {
        setModal({
            tipo: "error",
            mensaje: "Ya existe un insumo con ese código",
        });
        return;
    }

    fetch(`${URL}/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoInsumo),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al agregar insumo");
            return response.json();
        })
        .then((nuevo: Insumo) => {
            setInsumos([...insumos, nuevo]);
            setNuevoInsumo({
                codigo: "",
                nombre: "",
                categoria: "",
                marca: "",
                unidad: "",
                stock: 0,
                lote: "",
                umbralMinimoStock: 0,
            });
            setTipoModal(null);
            setModal({ tipo: "success", mensaje: "Insumo agregado con éxito" });
        })
        .catch(() => {
            setModal({ tipo: "error", mensaje: "Error al agregar insumo" });
        });
};

// === Eliminar Insumo ===
const handleDelete = (codigo: string) => {
    setModal({
        tipo: "confirm",
        mensaje: "¿Seguro que deseas eliminar este insumo?",
        onConfirm: () => {
            fetch(
                `${URL}/eliminar/${codigo}`,
                { method: "DELETE" }
            )
                .then((response) => {
                    if (!response.ok) throw new Error("Error al eliminar insumo");
                    setInsumos(insumos.filter((i) => i.codigo !== codigo));
                    if (insumoEditar?.codigo === codigo) setInsumoEditar(null);
                    setModal({ tipo: "success", mensaje: "Insumo eliminado con éxito" });
                })
                .catch(() =>
                    setModal({ tipo: "error", mensaje: "Error al eliminar insumo" })
                );
        },
    });
};

// === Editar Insumo ===
const handleUpdateInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insumoEditar) return;

    fetch(
        `${URL}/eliminar/${insumoEditar.codigo}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(insumoEditar),
        }
    )
        .then((response) => {
            if (!response.ok) throw new Error("Error al actualizar insumo");
            return response.json();
        })
        .then((actualizado: Insumo) => {
            setInsumos(
                insumos.map((i) => (i.codigo === actualizado.codigo ? actualizado : i))
            );
            setInsumoEditar(null);
            setTipoModal(null);
            setModal({ tipo: "success", mensaje: "Insumo actualizado con éxito" });
        })
        .catch(() => {
            setModal({ tipo: "error", mensaje: "Error al actualizar insumo" });
        });
};

return (
    <InsumoContext.Provider
        value={{
            insumos,
            setInsumos,
            nuevoInsumo,
            setNuevoInsumo,
            insumoEditar,
            setInsumoEditar,
            modal,
            setModal,
            handleAddInsumo,
            handleDelete,
            handleUpdateInsumo,
            tipoModal,
            setTipoModal,
        }}
    >
        {children}
    </InsumoContext.Provider>
);
}
