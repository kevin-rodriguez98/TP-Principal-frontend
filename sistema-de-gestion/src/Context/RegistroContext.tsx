import { createContext, useEffect, useState } from 'react';

export interface Registro {
    codigo: string;
    nombre: string;
    categoria: string;
    marca: string
    unidad: string;
    stock: number;
    lote: string;
    proveedor: string;
    tipo: string;
    venta:string | "";
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
    nuevoRegistro:Registro;
    setNuevoRegistro: React.Dispatch<React.SetStateAction<Registro>>;
    open: "movimiento" | null;
    setOpen: React.Dispatch<React.SetStateAction<"movimiento" | null>>;
    // open:boolean;
    // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // loading: boolean;
    // setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    // openEditor: boolean;
    // setOpenEditor: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RegistroContext = createContext<RegistroContextType | undefined>(undefined);

interface RegistroProviderProps {
    children: React.ReactNode;
}

export function RegistroProvider({ children }: RegistroProviderProps) {
    const URL = "http://localhost:8080/movimiento-insumo"
    const [open, setOpen] = useState<"movimiento" | null >(null);
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [nuevoRegistro, setNuevoRegistro] = useState<Registro>({
        codigo: "",
        nombre: "",
        categoria: "",
        marca: "",
        unidad: "",
        stock: 1,
        lote: "",
        tipo:"" ,
        proveedor:"",
        venta:""
    });
    
    const [modal, setModal] = useState<{
        tipo: "confirm" | "success" | "error";
        mensaje: string;
        onConfirm?: () => void;
    } | null> (null);
    
    // Obtener datos desde Spring Boot
    useEffect(() => {
        fetch(`${URL}/obtener`)
        .then(response => response.json())
        .then(data => setRegistros(data))
        .catch(error => console.error("Error cargando registro:", error));
}, []);
    
    const handleAddRegistro = (e: React.FormEvent) => {
        e.preventDefault();

    if (registros.some(i => i.codigo === nuevoRegistro.codigo)) {
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
        tipo: String(nuevoRegistro.tipo)
    };

        fetch(`${URL}/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registroParaEnviar),
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al agregar registro");
        return response.json();
    })
    .then((nuevo: Registro) => {
        setRegistros([...registros, nuevo]);
        setNuevoRegistro({
            codigo: "",
            nombre: "",
            categoria: "",
            marca: "",
            unidad: "",
            stock: 1,
            lote: "",
            tipo:"",
            proveedor:"",
            venta:""
        });
        setModal({ tipo: "success", mensaje: "Registro agregado con éxito" });
    })
    .catch(error => {
        console.error("Error al agregar registro:", error);
        setModal({ tipo: "error", mensaje: "Error al agregar registro" });
    });
};



    return (
        <RegistroContext.Provider value={{
            setNuevoRegistro, setRegistros, registros, nuevoRegistro ,modal, setModal, handleAddRegistro, open, setOpen
        }}>
            {children}
        </RegistroContext.Provider>
    );
}

