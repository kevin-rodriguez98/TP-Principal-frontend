import { createContext, useEffect, useState, type ReactNode } from "react";

export interface Insumo {
  codigo: string;
  nombre: string;
  unidad: string;
  cantidad: string;
}

export interface OrdenProduccion {
  unidad: ReactNode;
  codigo: string;
  producto: string;
  responsable: string;
  estado: "PENDIENTE" | "EN PROGRESO" | "FINALIZADO";
  cantidadPlaneada: number;
  cantidadFinal: number;
  fechaInicio: string;
  fechaFin: string;
  fechaCreacion: string;
  insumos: Insumo[];
}

interface ModalData {
  tipo: "confirm" | "success" | "error";
  mensaje: string;
  onConfirm?: () => void;
}

interface Filtro {
  estado: string;
  codigo: string;
  producto: string;
  responsable: string;
}

interface OrdenContextType {
  ordenes: OrdenProduccion[];
  ordenFiltradas: OrdenProduccion[];
  ordenSeleccionada: OrdenProduccion | null;
  setOrdenSeleccionada: React.Dispatch<React.SetStateAction<OrdenProduccion | null>>;
  filtros: Filtro;
  setFiltros: React.Dispatch<React.SetStateAction<Filtro>>;
  filtrarOrdenes: (filtro: Filtro) => void;
  modal: ModalData | null;
  setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
  handleAddOrden: (orden: OrdenProduccion) => Promise<void>;
  handleDeleteOrden: (codigo: string) => void;
  obtenerOrdenes: () => Promise<void>;
  obtenerOrdenPorCodigo: (codigo: string) => Promise<void>;
  tipoModal: "alta" | "editar" | "detalles" |  "eliminar" | null;
  setTipoModal: React.Dispatch<React.SetStateAction<"alta" | "editar" | "detalles" | "eliminar" | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const OrdenProduccionContext = createContext<OrdenContextType | undefined>(undefined);

interface OrdenProviderProps {
  children: ReactNode;
}

export function OrdenProduccionProvider({ children }: OrdenProviderProps) {
  const URL = "https://tp-principal-backend.onrender.com/productos/ordenes";

  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
  const [ordenFiltradas, setOrdenFiltradas] = useState<OrdenProduccion[]>([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenProduccion | null>(null);
  const [filtros, setFiltros] = useState<Filtro>({
    estado: "TODOS",
    codigo: "",
    producto: "",
    responsable: "",
  });
  const [modal, setModal] = useState<ModalData | null>(null);
  const [tipoModal, setTipoModal] = useState<"alta" | "editar" | "detalles" | "eliminar" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const obtenerOrdenes = async () => {
  setIsLoading(true); // inicio carga
  try {
    setError(null);
    const response = await fetch(`${URL}/obtener`);
    if (!response.ok) throw new Error("Error al obtener las órdenes");
    const data = await response.json();
    setOrdenes(data);
    setOrdenFiltradas(data);
  } catch {
    setError("❌ No se pudo conectar con el servidor de órdenes.");
    setOrdenes([]);
    setOrdenFiltradas([]);
    setModal({ tipo: "error", mensaje: "El servidor no está disponible. Intenta más tarde." });
  } finally {
    setIsLoading(false);
  }
};

const obtenerOrdenPorCodigo = async (codigo: string) => {
  setIsLoading(true);
  try {
    setError(null);
    const response = await fetch(`${URL}/obtener/${codigo}`);
    if (!response.ok) throw new Error("Orden no encontrada");
    const data = await response.json();
    setOrdenSeleccionada(data);
  } catch {
    setError("❌ No se pudo obtener la orden solicitada.");
    setModal({ tipo: "error", mensaje: "No se pudo obtener la orden solicitada." });
  } finally {
    setIsLoading(false);
  }
};

const handleAddOrden = async (orden: OrdenProduccion): Promise<void> => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(`${URL}/crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orden),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.mensaje || "Error al crear la orden");
    }

    const nuevaOrden = await response.json();
    setOrdenes(prev => [...prev, nuevaOrden]);
  } catch (err: any) {
    setError(err.message || "❌ Error al crear la orden.");
    throw err;
    setIsLoading(false);
  }
};

const handleDeleteOrden = (codigo: string) => {
  setModal({
    tipo: "confirm",
    mensaje: "¿Estás seguro que deseas eliminar esta orden?",
    onConfirm: async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${URL}/eliminarorden/${codigo}`, { method: "DELETE" });
        if (!response.ok) throw new Error();
        setOrdenes((prev) => prev.filter((o) => o.codigo !== codigo));
        setOrdenFiltradas((prev) => prev.filter((o) => o.codigo !== codigo));
        setModal({ tipo: "success", mensaje: "Orden eliminada con éxito" });
      } catch {
        setError("❌ Error al eliminar la orden.");
        setModal({ tipo: "error", mensaje: "Error al eliminar la orden" });
      } finally {
        setIsLoading(false);
      }
    },
  });
};

  const filtrarOrdenes = (filtros: Filtro) => {
    let filtradas = [...ordenes];
    if (filtros.estado !== "TODOS") filtradas = filtradas.filter((o) => o.estado === filtros.estado);
    if (filtros.codigo) filtradas = filtradas.filter((o) => o.codigo.toLowerCase().includes(filtros.codigo.toLowerCase()));
    if (filtros.producto) filtradas = filtradas.filter((o) => o.producto.toLowerCase().includes(filtros.producto.toLowerCase()));
    if (filtros.responsable) filtradas = filtradas.filter((o) => o.responsable.toLowerCase().includes(filtros.responsable.toLowerCase()));
   setIsLoading(true);
    setTimeout(() => {
        setOrdenFiltradas(filtradas);
        setIsLoading(false); 
    }, 500);
  };

  useEffect(() => {
    obtenerOrdenes();
  }, []);

  useEffect(() => {
    filtrarOrdenes(filtros);
  }, [filtros, ordenes]);

  return (
    <OrdenProduccionContext.Provider
      value={{
        ordenes,
        ordenFiltradas,
        ordenSeleccionada,
        setOrdenSeleccionada,
        filtros,
        setFiltros,
        filtrarOrdenes,
        modal,
        setModal,
        handleAddOrden,
        handleDeleteOrden,
        obtenerOrdenes,
        obtenerOrdenPorCodigo,
        tipoModal,
        setTipoModal,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </OrdenProduccionContext.Provider>
  );
}