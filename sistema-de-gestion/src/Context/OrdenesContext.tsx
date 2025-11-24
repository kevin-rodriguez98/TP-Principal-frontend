import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from 'react-toastify';
import { URL_ordenes as URL } from "../App";
import { ModalContext } from "../components/modal/ModalContext";

export interface Etapa {
  idOrden: number;
  legajo: string;
  estado: string;
  isEstado: boolean;
}

export const estados = {
  cancelada: "CANCELADA",
  enProduccion: "EN_PRODUCCION",
  finalizada: "FINALIZADA",
  evaluacion: "EVALUACION",
} as const;

export const etapas_produccion = {
  coccion: "Cocción",
  pasteurizacion: "Pasteurización",
  enfriado: "Enfriado",
  envasado: "Envasado",
  almacenamiento: "Almacenamiento",
} as const;


export type Estado = typeof estados[keyof typeof estados];


export interface OrdenProduccion {
  id: number,
  codigoProducto: string;
  productoRequerido: string;
  marca: string;
  stockRequerido: number;
  fechaEntrega: string;
  estado: Estado;
  lote: string;
  presentacion: string;


  legajo: string;
  responsableNombre: string;
  responsableApellido: string;


  etapa: string;
  nota: string;
  fechaCreacion: string;
  stockProducidoReal: number;
  tiempoProduccion: number;
}

export interface OrdenProduccionAgregarRequest {
  productoRequerido: string;
  marca: string;
  stockRequerido: number;
  codigoProducto: string;
  fechaEntrega: Date;
  estado?: string;
  lote: string;
  presentacion: string;
  legajo: string;
}


export interface ordenFinalizadaRequest {
  ordenId: number;
  stockProducidoReal: number;
  destino: string;
  legajo: string;
}


export interface HistorialItem {
  etapa: string;
  fechaCambio: string;
  empleado: {
    id: number;
    legajo: string;
    nombre: string;
    apellido: string;
    area: string;
    rol: string;
  };
}


interface OrdenContextType {
  ordenes: OrdenProduccion[];
  setOrdenes: React.Dispatch<React.SetStateAction<OrdenProduccion[]>>;
  handleAddOrden: (orden: OrdenProduccionAgregarRequest) => Promise<void>;
  obtenerOrdenes: () => Promise<void>;
  filtrarOrdenes: (fecha?: string, ultimosXDias?: number) => Promise<void>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  finalizarOrden: (orden: ordenFinalizadaRequest) => Promise<void>;
  notificarEtapa: (data: Etapa) => Promise<void>;
  agregarNota: (id: number, nota: string) => Promise<void>;
  obtenerHistorialEtapas: (id: number) => Promise<HistorialItem[]>
  historial: Etapa[];
  setHistorial: React.Dispatch<React.SetStateAction<Etapa[]>>;
  generarCodigoLote: (codigoProducto: string) => string;

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
  const [historial, setHistorial] = useState<Etapa[]>([]);

  let count = 0;

  useEffect(() => {
    obtenerOrdenes();
    count++;
    console.log(`Se ejecutó ${count} veces`, new Date().toISOString());
  }, []);

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

  const obtenerOrdenes = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await fetch(`${URL}/obtener`);
      if (!response.ok) {
        await handleFetchError(response, "No se pudo obtener la lista de órdenes.");
      }
      const data = await response.json();
      // console.log(data)

      const ordenesConEmpleado = data.map((orden: any) => ({
        ...orden,
        responsableNombre: orden.empleado?.nombre || "",
        responsableApellido: orden.empleado?.apellido || "",
      }));
      setOrdenes(ordenesConEmpleado);
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
  // 📊 Filtrar órdenes (fecha o últimos X días)
  // ===============================
  const filtrarOrdenes = async (fecha?: string, ultimosXDias?: number) => {
    setIsLoading(true);
    try {
      setError(null);

      let url = "";
      if (fecha) {
        url = `${URL}/obtener-ordenes-dia?fecha=${fecha}`;
      } else if (ultimosXDias) {
        url = `${URL}/obtener-ultimas-orden/${ultimosXDias}`;
      } else {
        await obtenerOrdenes(); // Si no hay filtros, traemos todas
        return;
      }

      const response = await fetch(url);
      if (!response.ok) await handleFetchError(response, "No se pudieron obtener las órdenes filtradas.");

      const data = await response.json();

      const ordenesBase = data.map((orden: any) => ({
        ...orden,
        responsableNombre: orden.empleado?.nombre || "",
        responsableApellido: orden.empleado?.apellido || "",
      }));

      // const ordenesConTiempo = await Promise.all(
      //   ordenesBase.map(async (orden: any) => ({
      //     ...orden,
      //     tiempoEstimado: await calcularTiempoEstimado(orden.codigoProducto, orden.stockRequerido) ?? 0,
      //   }))
      // );
      // setOrdenes(ordenesConTiempo);
      
      setOrdenes(ordenesBase);
    } catch (err: any) {
      setError(err.message);
      if (!modal) setModal({ tipo: "error", mensaje: "No se pudo filtrar las órdenes." });
      setOrdenes([]);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleAddOrden = async (orden: OrdenProduccionAgregarRequest): Promise<void> => {
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

  const finalizarOrden = async (orden: ordenFinalizadaRequest) => {
    try {
      const response = await fetch(`${URL}/finalizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orden),
      });

      if (!response.ok) {
        await handleFetchError(response, "No se pudo finalizar la orden.");
        return;
      }

      setModal({
        tipo: "success",
        mensaje: "Orden finalizada correctamente.",
      });

      await obtenerOrdenes();
    } catch (error) {
      setModal({
        tipo: "error",
        mensaje: "No se pudo finalizar la orden.",
      });
    }
  };

  const notificarEtapa = async (data: Etapa) => {
    try {
      const response = await fetch(`${URL}/notificar-etapa`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log(response)
      if (!response.ok) {
        await handleFetchError(response, "No se pudo notificar la nueva etapa.");
        return;
      }
      (data.isEstado) ? toast.success(`¡Se ha cambiado el estado a ${data.estado}!`) :
        toast.success(`¡Se ha cambiado la etapa a ${data.estado}!`);

      await obtenerOrdenes();

    } catch (err) {
      console.error("notificar-etapa - error catch:", err);
      setModal({
        tipo: "error",
        mensaje: "No se pudo actualizar la etapa de la orden.",
      });
    }
  };

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

  const obtenerHistorialEtapas = async (id: number): Promise<HistorialItem[]> => {
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


  const generarCodigoLote = (codigoProducto: string): string => {
    // Filtramos todas las órdenes del mismo producto
    const ordenesProducto = ordenes.filter(
      (o) => o.codigoProducto === codigoProducto
    );

    // Contamos cuántas son
    const cantidad = ordenesProducto.length;

    // El siguiente número es cantidad + 1
    const siguiente = cantidad + 1;

    // Retornamos formato "L{numero}"
    return `L0${siguiente}`;
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
        finalizarOrden,
        filtrarOrdenes,
        notificarEtapa,
        agregarNota,
        obtenerHistorialEtapas,
        historial,
        setHistorial,
        generarCodigoLote
      }}
    >
      {children}
    </OrdenesContext.Provider>

  );
}