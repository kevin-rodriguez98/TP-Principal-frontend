import { createContext, useEffect, useState, type ReactNode } from "react";
import { toast } from 'react-toastify';


export interface Insumo {
  codigo: string;
  nombre: string;
  unidad: string;
  cantidad: string;
}

export interface OrdenProduccion {
  id: number,
  ordenId: number,
  codigoProducto: string;
  productoRequerido: string;
  marca: string;
  estado: "CANCELADA" | "EN_PRODUCCION" | "FINALIZADA_ENTREGADA" | "EVALUACION";
  stockRequerido: number;
  stockProducidoReal: number;
  fechaEntrega: string;
  lote: string;
  destino: string;
}

interface ModalData {
  tipo: "confirm" | "success" | "error";
  mensaje: string;
  onConfirm?: () => void;
}

interface OrdenContextType {
  ordenes: OrdenProduccion[];
  setOrdenes: React.Dispatch<React.SetStateAction<OrdenProduccion[]>>;
  modal: ModalData | null;
  setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
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
  // const URL = "http://localhost:8080/orden-produccion";
  const URL = "https://tp-principal-backend.onrender.com/orden-produccion";
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([]);
  const [modal, setModal] = useState<ModalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    obtenerOrdenes();
  }, []);


  const obtenerOrdenes = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await fetch(`${URL}/obtener`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 500) {
          setModal({
            tipo: "error",
            mensaje: errorData?.message || "Error interno del servidor.",
          });
        } else {
          setModal({
            tipo: "error",
            mensaje: "No se pudo obtener la lista de órdenes.",
          });
        }
        throw new Error(errorData?.message || "Error al obtener las órdenes");
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

  const handleAddOrden = async (orden: OrdenProduccion): Promise<void> => {
    setError(null);
    try {
      const response = await fetch(`${URL}/agregarautomatizado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orden),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 500) {
          setModal({
            tipo: "error",
            mensaje: errorData?.message || "Error interno al crear la orden.",
          });
        } else {
          setModal({
            tipo: "error",
            mensaje: "No se pudo crear la orden.",
          });
        }

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

  const marcarEnProduccion = async (id: number, codigoProducto: string) => {
    try {
      const response = await fetch(
        `${URL}/marcar-en-produccion/${id}?codigoProducto=${codigoProducto}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 500) {
          setModal({
            tipo: "error",
            mensaje: errorData?.message || "Error interno al marcar la orden en producción.",
          });
        } else {
          setModal({
            tipo: "error",
            mensaje: "No se pudo marcar la orden en producción.",
          });
        }

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

  const finalizarOrden = async (id: number, stockProducidoReal?: number, destino?: string) => {
    if (!destino) return;

    try {
      const response = await fetch(
        `${URL}/finalizar/${id}?cantidadProducida=${stockProducidoReal}&destino=${encodeURIComponent(destino)}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 500) {
          setModal({
            tipo: "error",
            mensaje: errorData?.message || "Error interno al finalizar la orden.",
          });
        } else {
          setModal({
            tipo: "error",
            mensaje: "No se pudo finalizar la orden.",
          });
        }

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

  const cancelarOrden = async (id: number) => {
    try {
      const response = await fetch(`${URL}/cancelar/${id}`, { method: "PUT" });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 500) {
          setModal({
            tipo: "error",
            mensaje: errorData?.message || "Error interno al cancelar la orden.",
          });
        } else {
          setModal({
            tipo: "error",
            mensaje: "No se pudo cancelar la orden.",
          });
        }

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


  // const obtenerOrdenes = async () => {
  //   setIsLoading(true); // inicio carga
  //   try {
  //     setError(null);
  //     const response = await fetch(`${URL}/obtener`);
  //     if (!response.ok) throw new Error("Error al obtener las órdenes");
  //     const data = await response.json();
  //     console.log(data)
  //     setOrdenes(data);
  //   } catch {
  //     setError("❌ No se pudo conectar con el servidor de órdenes.");
  //     setOrdenes([]);
  //     setModal({ tipo: "error", mensaje: "El servidor no está disponible. Intenta más tarde." });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleAddOrden = async (orden: OrdenProduccion): Promise<void> => {
  //   setError(null);
  //   try {
  //     const response = await fetch(`${URL}/agregarautomatizado`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(orden),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => null);
  //       throw new Error(errorData?.mensaje || "Error al crear la orden");
  //     }

  //     const nuevaOrden = await response.json();
  //     setOrdenes(prev => [...prev, nuevaOrden]);
  //     toast.success(`¡Se ha creado la orden para ${orden.productoRequerido}!`);
  //   } catch (err: any) {
  //     setError(err.message || "❌ Error al crear la orden.");
  //     toast.error("Algo salió mal...");
  //     throw err;
  //   }
  // };

  // const marcarEnProduccion = async (id: number, codigoProducto: string) => {
  //   try {
  //     const response = await fetch(`${URL}/marcar-en-produccion/${id}?codigoProducto=${codigoProducto}`, {
  //       method: "PUT",
  //     });
  //     if (!response.ok) throw new Error("No se pudo marcar la orden en producción");
  //     toast.success(`Orden ${id} marcada como EN PRODUCCIÓN`);
  //     await obtenerOrdenes(); // actualiza la lista
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Error al marcar la orden en producción");
  //   }
  // };

  // const finalizarOrden = async (id: number, stockProducidoReal: number | undefined, destino: string | undefined) => {

  //   if (destino) {

  //     try {
  //       const response = await fetch(
  //         `${URL}/finalizar/${id}?cantidadProducida=${stockProducidoReal}&destino=${encodeURIComponent(destino)}`,
  //         { method: "PUT" }
  //       );

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         setModal({
  //           tipo: "error",
  //           mensaje: errorData.message || "Error al finalizar la orden.",
  //         });
  //         return;
  //       }

  //       setModal({
  //         tipo: "success",
  //         mensaje: "Orden finalizada correctamente.",
  //       });
  //     } catch (error) {
  //       setModal({
  //         tipo: "error",
  //         mensaje: "No se pudo conectar con el servidor.",
  //       });
  //     }
  //   }
  // };

  // const cancelarOrden = async (id: number) => {
  //   try {
  //     const response = await fetch(`${URL}/cancelar/${id}`, {
  //       method: "PUT",
  //     });
  //     if (!response.ok) throw new Error("No se pudo cancelar la orden");
  //     toast.success(`Orden ${id} cancelada correctamente`);
  //     await obtenerOrdenes();
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Error al cancelar la orden");
  //   }
  // };



  return (
    <OrdenesContext.Provider
      value={{
        ordenes,
        setOrdenes,
        modal,
        setModal,
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