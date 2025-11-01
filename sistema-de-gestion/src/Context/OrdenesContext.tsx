import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from 'react-toastify';
import { URL_ordenes as URL } from "../App";
import { ModalContext } from "../components/modal/ModalContext";


export interface Insumo {
  codigo: string;
  nombre: string;
  unidad: string;
  cantidad: string;
}

export interface OrdenProduccion {
  codigoProducto: string;
  productoRequerido: string;
  marca: string;
  stockRequerido: number;
  fechaEntrega: string;
  estado: "CANCELADA" | "EN_PRODUCCION" | "FINALIZADA_ENTREGADA" | "EVALUACION";
  lote: string;
  envasado: string;
  presentacion: string;

  id: number,
  stockProducidoReal: number;
  tiempoEstimado?: number;

}

interface OrdenContextType {
  ordenes: OrdenProduccion[];
  setOrdenes: React.Dispatch<React.SetStateAction<OrdenProduccion[]>>;
  handleAddOrden: (orden: OrdenProduccion) => Promise<void>;
  obtenerOrdenes: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;

  marcarEnProduccion: (id: number, codigoProducto: string) => Promise<void>;
  finalizarOrden: (id: number, stockProducidoReal?: number, destino?: string) => Promise<void>;
  cancelarOrden: (id: number) => Promise<void>;

}

export const OrdenesContext = createContext<OrdenContextType | undefined>(undefined);

interface OrdenProviderProps {
  children: ReactNode;
}

export function OrdenProduccionProvider({ children }: OrdenProviderProps) {
  const { setModal, modal } = useContext(ModalContext)!;
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    obtenerOrdenes();
  }, []);


// ====================================================
  // 🔧 Helper: Manejo centralizado de errores del backend
  // ====================================================
  const handleFetchError = async (response: Response, defaultMessage: string) => {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || defaultMessage;

    if (response.status === 500) {
      setModal({
        tipo: "error",
        mensaje: message || "Error interno del servidor.",
      });
    } else {
      setModal({
        tipo: "error",
        mensaje: message,
      });
    }

    throw new Error(message);
  };

  // ===============================
  // 📦 Obtener todas las órdenes
  // ===============================
  const obtenerOrdenes = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await fetch(`${URL}/obtener`);
      if (!response.ok) {
        await handleFetchError(response, "No se pudo obtener la lista de órdenes.");
      }
      const data = await response.json();
      setOrdenes(data);
    } catch (err: any) {
      setError(err.message);
      if (!modal) {
        setModal({
          tipo: "error",
          mensaje: "El servidor no está disponible. Intenta más tarde.",
        });
      }
      setOrdenes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================
  // ➕ Agregar una nueva orden
  // ===============================
  const handleAddOrden = async (orden: OrdenProduccion): Promise<void> => {
    setError(null);
    try {
      const response = await fetch(`${URL}/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orden),
      });

      if (!response.ok) {
        await handleFetchError(response, "No se pudo crear la orden.");
        return;
      }

      const nuevaOrden = await response.json();
      setOrdenes(prev => [...prev, nuevaOrden]);
      toast.success(`¡Se ha creado la orden para ${orden.productoRequerido}!`);
    } catch {
      setModal({
        tipo: "error",
        mensaje: "No se pudo conectar con el servidor. Intenta más tarde.",
      });
    }
  };

  // ===============================
  // ⚙️ Marcar como EN PRODUCCIÓN
  // ===============================
  const marcarEnProduccion = async (id: number, codigoProducto: string) => {
    try {
      const response = await fetch(
        `${URL}/marcar-en-produccion/${id}?codigoProducto=${codigoProducto}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        await handleFetchError(response, "No se pudo marcar la orden en producción.");
        return;
      }

      toast.success(`Orden ${id} marcada como EN PRODUCCIÓN`);
      await obtenerOrdenes();
    } catch {
      setModal({
        tipo: "error",
        mensaje: "No se pudo conectar con el servidor.",
      });
    }
  };

  // ===============================
  // ✅ Finalizar orden
  // ===============================
  const finalizarOrden = async (id: number, stockProducidoReal?: number, destino?: string) => {
    if (!destino) return;

    try {
      const response = await fetch(
        `${URL}/finalizar/${id}?cantidadProducida=${stockProducidoReal}&destino=${encodeURIComponent(destino)}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        await handleFetchError(response, "No se pudo finalizar la orden.");
        return;
      }

      setModal({
        tipo: "success",
        mensaje: "Orden finalizada correctamente.",
      });
      await obtenerOrdenes();
    } catch {
      setModal({
        tipo: "error",
        mensaje: "No se pudo conectar con el servidor.",
      });
    }
  };

  // ===============================
  // ❌ Cancelar orden
  // ===============================
  const cancelarOrden = async (id: number) => {
    try {
      const response = await fetch(`${URL}/cancelar/${id}`, { method: "PUT" });

      if (!response.ok) {
        await handleFetchError(response, "No se pudo cancelar la orden.");
        return;
      }

      toast.success(`Orden ${id} cancelada correctamente`);
      await obtenerOrdenes();
    } catch {
      setModal({
        tipo: "error",
        mensaje: "No se pudo conectar con el servidor.",
      });
    }
  };

  

  return (
    <OrdenesContext.Provider
      value={{
        ordenes,
        setOrdenes,
        handleAddOrden,
        obtenerOrdenes,
        isLoading,
        setIsLoading,
        error,
        setError,
        marcarEnProduccion,
        finalizarOrden,
        cancelarOrden,
      }}
    >
      {children}
    </OrdenesContext.Provider>

  );
}