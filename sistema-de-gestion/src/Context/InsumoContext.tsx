import { createContext, useState } from 'react';

export interface Insumo {
    codigo: number;
    nombre: string;
    categoria: string;
    marca: string;
    cantidad: number;
    lote: string;
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
    handleDelete: (codigo: number) => void;
    handleUpdateInsumo: (e: React.FormEvent) => void;
}

export const InsumoContext = createContext<InsumoContextType | undefined>(undefined);

interface InsumoProviderProps {
    children: React.ReactNode;
}

export interface Insumo {
    codigo: number;
    nombre: string;
    categoria: string;
    marca: string;
    cantidad: number;
    lote: string;
}


export function InsumoProvider({ children }: InsumoProviderProps) {

    const [insumos, setInsumos] = useState<Insumo[]>([
        { codigo: 101, nombre: "Leche", categoria: "Lácteos", marca: "La Serenísima", cantidad: 100, lote: "L001" },
        { codigo: 102, nombre: "Leche", categoria: "Lácteos", marca: "Sancor", cantidad: 80, lote: "L002" },
        { codigo: 103, nombre: "Queso", categoria: "Lácteos", marca: "Milkaut", cantidad: 50, lote: "L003" },
        { codigo: 104, nombre: "Harina", categoria: "Alimentos", marca: "Molinos", cantidad: 30, lote: "L004" },
    ]);

    const [nuevoInsumo, setNuevoInsumo] = useState<Omit<Insumo, "lote"> & { lote: string }>({
        codigo: 0,
        nombre: "",
        categoria: "",
        marca: "",
        cantidad: 0,
        lote: "",
    });

    const [insumoEditar, setInsumoEditar] = useState<Insumo | null>(null);

    const [modal, setModal] = useState<{
        tipo: "confirm" | "success" | "error";
        mensaje: string;
        onConfirm?: () => void;
    } | null>(null);

    const handleAddInsumo = (e: React.FormEvent) => {
        e.preventDefault();
        if (insumos.some((i) => i.codigo === nuevoInsumo.codigo)) {
            setModal({ tipo: "error", mensaje: "Ya existe un insumo con ese código" });
            return;
        }
        setInsumos([...insumos, { ...nuevoInsumo, codigo: Number(nuevoInsumo.codigo) } as Insumo]);
        setNuevoInsumo({ codigo: 0, nombre: "", categoria: "", marca: "", cantidad: 0, lote: "" });
        setModal({ tipo: "success", mensaje: "Insumo agregado con éxito" });
    };

    const handleDelete = (codigo: number) => {
        setModal({
            tipo: "confirm",
            mensaje: "¿Seguro que deseas eliminar este insumo?",
            onConfirm: () => {
                setInsumos(insumos.filter((i) => i.codigo !== codigo));
                if (insumoEditar?.codigo === codigo) setInsumoEditar(null);
                setModal({ tipo: "success", mensaje: "Insumo eliminado con éxito" });
            },
        });
    };

    const handleUpdateInsumo = (e: React.FormEvent) => {
        e.preventDefault();
        if (insumoEditar) {
            setInsumos(insumos.map((i) => (i.codigo === insumoEditar.codigo ? insumoEditar : i)));
            setInsumoEditar(null);
            setModal({ tipo: "success", mensaje: "Insumo actualizado con éxito" });
        }
    };




    return (
        <InsumoContext.Provider value={{
            insumos, setInsumos, nuevoInsumo, setNuevoInsumo, insumoEditar, setInsumoEditar, modal, setModal,
            handleAddInsumo, handleDelete, handleUpdateInsumo
        }}>
            {children}
        </InsumoContext.Provider>
    );
}
