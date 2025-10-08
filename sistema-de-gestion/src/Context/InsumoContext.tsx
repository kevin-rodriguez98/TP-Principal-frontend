import { createContext, useEffect, useState } from 'react';

export interface Insumo {
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string
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

    open:boolean;
    loading: boolean;
    openEditor: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenEditor: React.Dispatch<React.SetStateAction<boolean>>;

}

export const InsumoContext = createContext<InsumoContextType | undefined>(undefined);

interface InsumoProviderProps {
    children: React.ReactNode;
}


export function InsumoProvider({ children }: InsumoProviderProps) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [openEditor, setOpenEditor] = useState(false)

    const [insumos, setInsumos] = useState<Insumo[]>([]);

    // Obtener datos desde Spring Boot
    useEffect(() => {
    fetch("https://tp-principal-backend.onrender.com/productos/insumos/obtener")
        .then(response => response.json())
        .then(data => setInsumos(data))
        .catch(error => console.error("Error cargando insumos:", error));
}, []);

    const [nuevoInsumo, setNuevoInsumo] = useState<Insumo>({
    codigo: "",
    nombre: "",
    categoria: "",
    marca: "",
    unidad: "",
    stock: 1.0,
    lote: "",
    umbralMinimoStock: 1
    });

    const [insumoEditar, setInsumoEditar] = useState<Insumo | null>(null);

    const [modal, setModal] = useState<{
        tipo: "confirm" | "success" | "error";
        mensaje: string;
        onConfirm?: () => void;
    } | null>(null);


const handleAddInsumo = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (
        !nuevoInsumo.codigo.trim() ||
        !nuevoInsumo.nombre.trim() ||
        !nuevoInsumo.categoria.trim() ||
        !nuevoInsumo.marca.trim() ||
        !nuevoInsumo.unidad.trim() ||
        nuevoInsumo.stock === null ||
        nuevoInsumo.stock <= 0 ||
        !nuevoInsumo.lote.trim() ||
        nuevoInsumo.umbralMinimoStock === null
    ) {
        setModal({ tipo: "error", mensaje: "Todos los campos son obligatorios y deben tener datos válidos" });
        return;
    }

    if (insumos.some(i => i.codigo === nuevoInsumo.codigo)) {
        setModal({ tipo: "error", mensaje: "Ya existe un insumo con ese código" });
        return;
    }

    const insumoParaEnviar = {
        codigo: String(nuevoInsumo.codigo),
        nombre: String(nuevoInsumo.nombre),
        categoria: String(nuevoInsumo.categoria),
        marca: String(nuevoInsumo.marca),
        unidad: String(nuevoInsumo.unidad),
        stock: Number(nuevoInsumo.stock),
        lote: String(nuevoInsumo.lote),
        umbralMinimoStock: Number(nuevoInsumo.umbralMinimoStock)
    };

    fetch("https://tp-principal-backend.onrender.com/productos/insumos/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insumoParaEnviar),
    })
    .then(response => {
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
            stock: 1,
            lote: "",
            umbralMinimoStock: 1
        });
        setModal({ tipo: "success", mensaje: "Insumo agregado con éxito" });
    })
    .catch(error => {
        console.error("Error al agregar insumo:", error);
        setModal({ tipo: "error", mensaje: "Error al agregar insumo" });
    });
};




const handleDelete = (codigo: string) => {
    setModal({
        tipo: "confirm",
        mensaje: "¿Seguro que deseas eliminar este insumo?",
        onConfirm: () => {
            // Petición DELETE al backend
            fetch(`https://tp-principal-backend.onrender.com/productos/insumos/eliminar/${codigo}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error al eliminar insumo");
                    setInsumos(insumos.filter((i) => i.codigo !== codigo));
                    if (insumoEditar?.codigo === codigo) setInsumoEditar(null);
                    setModal({ tipo: "success", mensaje: "Insumo eliminado con éxito" });
                })
                .catch(error => {
                    console.error("Error al eliminar insumo:", error);
                    setModal({ tipo: "error", mensaje: "Error al eliminar insumo" });
                });
        }
    });
};

const handleUpdateInsumo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!insumoEditar) return;

    // Petición PUT al backend
    fetch(`https://tp-principal-backend.onrender.com/productos/insumos/editar/${insumoEditar.codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insumoEditar),
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al actualizar insumo");
            return response.json();
        })
        .then((actualizado: Insumo) => {
            setInsumos(insumos.map((i) => (i.codigo === actualizado.codigo ? actualizado : i)));
            setInsumoEditar(null);
            setModal({ tipo: "success", mensaje: "Insumo actualizado con éxito" });
        })
        .catch(error => {
            console.error("Error al actualizar insumo:", error);
            setModal({ tipo: "error", mensaje: "Error al actualizar insumo" });
        });
};



    return (
        <InsumoContext.Provider value={{
            insumos, setInsumos, nuevoInsumo, setNuevoInsumo, insumoEditar, setInsumoEditar, modal, setModal,
            handleAddInsumo, handleDelete, handleUpdateInsumo, open, setOpen, openEditor, setOpenEditor, loading,setLoading
        }}>
            {children}
        </InsumoContext.Provider>
    );
}

