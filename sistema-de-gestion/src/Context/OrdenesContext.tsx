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

interface HistorialEtapa {
  id: number;
  etapa: string;
  fecha: string;
  nota?: string;
}

export interface OrdenProduccion {
  id: number,
  codigoProducto: string;
  productoRequerido: string;
  marca: string;
  stockRequerido: number;
  fechaEntrega: string;
  estado: "EVALUACIÓN" | "CANCELADA" | "EN_PRODUCCION" | "FINALIZADA_ENTREGADA";
  lote: string;

  envasado: string;
  presentacion: string;
  etapa: string;
  nota: string;

  creationUsername: string;
  fechaCreacion: string;
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
  notificarEtapa: (id: number, nuevaEtapa: string) => Promise<void>;
  agregarNota: (id: number, nota: string) => Promise<void>;
  obtenerHistorialEtapas: (id: number) => Promise<HistorialEtapa[]>
  historial: HistorialEtapa[];
  setHistorial: React.Dispatch<React.SetStateAction<HistorialEtapa[]>>;

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
  const [historial, setHistorial] = useState<HistorialEtapa[]>([]);
  let count = 0;

  useEffect(() => {
    obtenerOrdenes();
    count++;
    console.log(`Se ejecutó ${count} veces`, new Date().toISOString());
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
      console.log("ORDENES:", data);
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
        mensaje: "No se pudo crear la orden.",
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
      notificarEtapa(id, "Cocción");
      await obtenerOrdenes();
    } catch {
      setModal({
        tipo: "error",
        mensaje: "No se pudo marcar la orden en producción.",
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
        mensaje: "No se pudo finalizar la orden.",
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
        mensaje: "No se pudo cancelar la orden.",
      });
    }
  };

  // ===============================
  // 📨 Notificar nueva etapa
  // ===============================
  const notificarEtapa = async (id: number, nuevaEtapa: string) => {
    try {
      const response = await fetch(`${URL}/notificar-etapa/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: nuevaEtapa,
      });

      if (!response.ok) {
        await handleFetchError(response, "No se pudo notificar la nueva etapa.");
        return;
      }

      toast.info(`Etapa actualizada a ${nuevaEtapa}`);
      await obtenerOrdenes();
    } catch {
      setModal({
        tipo: "error",
        mensaje: "No se pudo actualizar la etapa de la orden.",
      });
    }
  };

  // ===============================
  // 📝 Agregar nota a la orden
  // ===============================
  const agregarNota = async (id: number, nota: string) => {
    try {
      const response = await fetch(`${URL}/agregar-nota/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: nota,
      });

      if (!response.ok) {
        await handleFetchError(response, "No se pudo agregar la nota.");
        return;
      }

      toast.success("Nota agregada correctamente.");
      await obtenerOrdenes();
    } catch {
      setModal({
        tipo: "error",
        mensaje: "No se pudo agregar la nota.",
      });
    }
  };

  // ===============================
  // 📜 Obtener historial de etapas
  // ===============================
  const obtenerHistorialEtapas = async (id: number): Promise<HistorialEtapa[]> => {
    try {
      const response = await fetch(`${URL}/${id}/historial-etapas`);
      if (!response.ok) {
        await handleFetchError(response, "No se pudo obtener el historial de etapas.");
        return [];
      }

      const data = await response.json();
      return data;
    } catch {
      setModal({
        tipo: "error",
        mensaje: "Error al obtener historial de etapas.",
      });
      return [];
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
        notificarEtapa,
        agregarNota,
        obtenerHistorialEtapas,
        historial,
        setHistorial

      }}
    >
      {children}
    </OrdenesContext.Provider>

  );
}