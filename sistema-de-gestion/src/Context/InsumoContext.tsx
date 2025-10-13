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

interface Filtro {
    codigo: string;
    nombre: string;
    marca: string;
    categoria: string;
    // lote: string;
}

interface InsumoContextType {
    insumos: Insumo[];
    setInsumos: React.Dispatch<React.SetStateAction<Insumo[]>>;
    insumos_bajo_stock: Insumo[];
    setInsumos_bajo_stock: React.Dispatch<React.SetStateAction<Insumo[]>>;
    nuevoInsumo: Insumo;
    setNuevoInsumo: React.Dispatch<React.SetStateAction<Insumo>>;
    insumoEditar: Insumo | null;
    setInsumoEditar: React.Dispatch<React.SetStateAction<Insumo | null>>;
    modal: ModalData | null;
    setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
    handleAddInsumo: (e: React.FormEvent) => void;
    handleDelete: (codigo: string) => void;
    filtrarInsumos: (filtro: Filtro) => void;
    handleUpdateInsumo: (e: React.FormEvent) => void;
    tipoModal: "alta" | "editar" | "movimiento" | null;
    setTipoModal: React.Dispatch<React.SetStateAction<"alta" | "editar" | "movimiento" | null>>;
    error: string | null;
    filtros: Filtro
    setFiltros: React.Dispatch<React.SetStateAction<Filtro>>;
    insumosFiltrados: Insumo[];
    setInsumosFiltrados: React.Dispatch<React.SetStateAction<Insumo[]>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InsumoContext = createContext<InsumoContextType | undefined>(undefined);

interface InsumoProviderProps {
    children: React.ReactNode;
}

export function InsumoProvider({ children }: InsumoProviderProps) {
    const URL = "http://localhost:8080/productos/insumos";
    // const URL = "https://tp-principal-backend.onrender.com/productos/insumos";
    const [isLoading, setIsLoading] = useState(true);
    const [tipoModal, setTipoModal] = useState<"alta" | "editar" | "movimiento" | null>(null);
    const [modal, setModal] = useState<ModalData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [insumos_bajo_stock, setInsumos_bajo_stock] = useState<Insumo[]>([]);
    const [insumoEditar, setInsumoEditar] = useState<Insumo | null>(null);
    const [nuevoInsumo, setNuevoInsumo] = useState<Insumo>({
        codigo: "",
        nombre: "",
        categoria: "",
        marca: "",
        unidad: "",
        stock: 0,
        lote: "",
        umbralMinimoStock: 0
    });
    const [insumosFiltrados, setInsumosFiltrados] = useState<Insumo[]>([]);
    const [filtros, setFiltros] = useState<Filtro>({
        codigo: "",
        nombre: "",
        marca: "",
        categoria: "",
        // lote: "",
    });


    useEffect(() => {
        obtenerInsumos();
    }, []);


    useEffect(() => {
        filtrarInsumos(filtros);
    }, [filtros, insumos]);


    const filtrarInsumos = (filtros: Filtro) => {
        if (!insumos) return;
        const resultado = insumos.filter((item) =>
            (filtros.codigo === "" || item.codigo.toLowerCase().startsWith(filtros.codigo.toLowerCase())) &&
            (filtros.nombre === "" || item.nombre.toLowerCase().startsWith(filtros.nombre.toLowerCase())) &&
            (filtros.marca === "" || item.marca.toLowerCase().startsWith(filtros.marca.toLowerCase())) &&
            (filtros.categoria === "" || item.categoria.toLowerCase().startsWith(filtros.categoria.toLowerCase()))
            // (filtros.lote === "" || item.lote.toLowerCase().startsWith(filtros.lote.toLowerCase()))
        );

        setIsLoading(true)
        setInsumosFiltrados(resultado);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000 / 2);
    };


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
                mensaje: "El servidor no está disponible. Intenta más tarde.",
            });
            setInsumos([]); // limpia listado
        }
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
                mensaje: "El servidor no está disponible. Intenta más tarde.",
            });
            setInsumos_bajo_stock([]); // limpia listado
        }
    };

    const handleAddInsumo = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !nuevoInsumo.codigo.trim() ||
            !nuevoInsumo.nombre.trim() ||
            !nuevoInsumo.categoria.trim() ||
            !nuevoInsumo.marca.trim() ||
            !nuevoInsumo.unidad.trim() ||
            nuevoInsumo.stock <= 0 ||
            nuevoInsumo.umbralMinimoStock <=0
            // !nuevoInsumo.lote.trim()
        ) {
            setModal({
                tipo: "error",
                mensaje: "Todos los campos son obligatorios y deben ser válidos",
            });
            return;
        }

        if (insumos.some((i) => i.codigo === nuevoInsumo.codigo)) {
            setModal({ tipo: "error", mensaje: "Ya existe un insumo con ese código" });
            return;
        }

        try {
            const response = await fetch(`${URL}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoInsumo),
            });
            if (!response.ok) throw new Error();

            const nuevo = await response.json();
            setInsumos([...insumos, nuevo]);
            setNuevoInsumo({
                codigo: "",
                nombre: "",
                categoria: "",
                marca: "",
                unidad: "",
                stock: 0,
                lote: "",
                umbralMinimoStock: 0
            });
            setTipoModal(null);
            setModal({ tipo: "success", mensaje: "Insumo agregado con éxito" });
        } catch {
            setModal({ tipo: "error", mensaje: "No se pudo agregar el insumo."+ {error} });
        }
    };

    const handleDelete = (codigo: string) => {
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
                    if (insumoEditar?.codigo === codigo) setInsumoEditar(null);
                    setModal({ tipo: "success", mensaje: "Insumo eliminado con éxito" });
                } catch {
                    setModal({ tipo: "error", mensaje: "Error al eliminar insumo" });
                }
            },
        });
    };




    const handleUpdateInsumo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!insumoEditar) return;

        // Verificar si ya existe otro insumo con el mismo nombre y categoría
        const nombreCategoriaExistente = insumos.some(
            (i) =>
                (i.nombre.toLowerCase() === insumoEditar.nombre.toLowerCase() &&
                    i.categoria.toLowerCase() === insumoEditar.categoria.toLowerCase() && i.marca.toLowerCase() === insumoEditar.marca.toLowerCase() )
        );

        if (nombreCategoriaExistente) {
            setModal({
                tipo: "error",
                mensaje: "Ya existe un insumo con el mismo nombre, categoría y marca.",
            });
            return;
        }

        // Si pasa las validaciones, enviamos al backend
        try {
            const response = await fetch(`${URL}/editar/${insumoEditar.codigo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(insumoEditar),
            });

            if (!response.ok) throw new Error();

            const actualizado = await response.json();
            setInsumos(insumos.map((i) => (i.codigo === actualizado.codigo ? actualizado : i)));
            setInsumoEditar(null);
            setTipoModal(null);
            setModal({ tipo: "success", mensaje: "Insumo actualizado con éxito" });
        } catch {
            setModal({ tipo: "error", mensaje: "Error al actualizar insumo" });
        }
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
                error,
                filtros,
                setFiltros,
                insumosFiltrados,
                setInsumosFiltrados,
                isLoading,
                setIsLoading, 
                filtrarInsumos,
                insumos_bajo_stock,setInsumos_bajo_stock

            }}
        >
            {children}
        </InsumoContext.Provider>
    );
}
