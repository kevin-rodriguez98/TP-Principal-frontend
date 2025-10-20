import { createContext, useEffect, useState, type ReactNode } from "react";
import { toast } from 'react-toastify';

export interface Insumo {
  codigo: string;
  nombre: string;
  unidad: string;
  cantidad: string;
}

export interface OrdenProduccion {
  unidad: string;
  codigo: string;
  producto: string;
  creationUsername: string;
  estado: "PENDIENTE" | "EN PROGRESO" | "FINALIZADO";
  stock_requerido: number;
  stock_real: number;
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

interface OrdenContextType {
  ordenes: OrdenProduccion[];
  setOrdenes: React.Dispatch<React.SetStateAction<OrdenProduccion[]>>;
  ordenFiltradas: OrdenProduccion[];
  ordenSeleccionada: OrdenProduccion | null;
  setOrdenSeleccionada: React.Dispatch<React.SetStateAction<OrdenProduccion | null>>;
  modal: ModalData | null;
  setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
  handleAddOrden: (orden: OrdenProduccion) => Promise<void>;
  handleDeleteOrden: (codigo: string) => void;
  obtenerOrdenes: () => Promise<void>;
  obtenerOrdenPorCodigo: (codigo: string) => Promise<void>;
  tipoModal: "alta" | "editar" | "detalles" | "eliminar" | null;
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
  // const URL = "http://localhost:8080/productos/ordenes";
  const URL = "https://tp-principal-backend.onrender.com/orden-produccion";
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
  const [ordenFiltradas, setOrdenFiltradas] = useState<OrdenProduccion[]>([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenProduccion | null>(null);
  const [modal, setModal] = useState<ModalData | null>(null);
  const [tipoModal, setTipoModal] = useState<"alta" | "editar" | "detalles" | "eliminar" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    obtenerOrdenes();
  }, []);

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
    }
  };

  const handleAddOrden = async (orden: OrdenProduccion): Promise<void> => {
    setError(null);
    try {
      const response = await fetch(`${URL}/agregar`, {
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
      toast.success(`¡Se ha creado la orden para ${orden.producto}!`);
    } catch (err: any) {
      setError(err.message || "❌ Error al crear la orden.");
      toast.error("Algo salió mal...");
      throw err;
    }
  };

  const handleDeleteOrden = (codigo: string) => {
    setModal({
      tipo: "confirm",
      mensaje: "¿Estás seguro que deseas eliminar esta orden?",
      onConfirm: async () => {
        try {
          const response = await fetch(`${URL}/eliminarorden/${codigo}`, { method: "DELETE" });
          if (!response.ok) throw new Error();
          setOrdenes((prev) => prev.filter((o) => o.codigo !== codigo));
          toast.success(`¡Se ha eliminado la orden!`);
        } catch {
          setError("❌ Error al eliminar la orden.");
          toast.error("Algo salió mal...");
          // setModal({ tipo: "error", mensaje: "Error al eliminar la orden" });
        } 
      },
    });
  };




  return (
    <OrdenProduccionContext.Provider
      value={{
        ordenes,
        setOrdenes,
        ordenFiltradas,
        ordenSeleccionada,
        setOrdenSeleccionada,
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