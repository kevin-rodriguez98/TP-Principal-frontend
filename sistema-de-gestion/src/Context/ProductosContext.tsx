import { createContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "react-toastify";

export interface Producto {
  codigo: string;
  nombre: string;
  categoria: string;
  marca: string;
  unidad: string;
  stock: number;
  lote: string;
}

interface ModalData {
  tipo: "confirm" | "success" | "error";
  mensaje: string;
  onConfirm?: () => void;
}

interface ProductoContextType {
  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
  productoSeleccionado: Producto | null;
  setProductoSeleccionado: React.Dispatch<React.SetStateAction<Producto | null>>;
  modal: ModalData | null;
  setModal: React.Dispatch<React.SetStateAction<ModalData | null>>;
  tipoModal: "alta" | "editar" | "detalles" | "eliminar" | null;
  setTipoModal: React.Dispatch<React.SetStateAction<"alta" | "editar" | "detalles" | "eliminar" | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  obtenerProductos: () => Promise<void>;
  handleAddProducto: (producto: Producto) => Promise<void>;
  handleEditProducto: (producto: Producto) => Promise<void>;
  handleDeleteProducto: (codigo: string) => void;
}

export const ProductosContext = createContext<ProductoContextType | undefined>(undefined);

interface ProductosProviderProps {
  children: ReactNode;
}

export function ProductosProvider({ children }: ProductosProviderProps) {
  const URL = "http://localhost:8080/productos";
  // const URL = "https://tp-principal-backend.onrender.com/productos";

  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modal, setModal] = useState<ModalData | null>(null);
  const [tipoModal, setTipoModal] = useState<"alta" | "editar" | "detalles" | "eliminar" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await fetch(`${URL}/obtener`);
      if (!response.ok) throw new Error("Error al obtener los productos");
      const data = await response.json();
      console.log(data)
      setProductos(data);
    } catch {
      setError("❌ No se pudo conectar con el servidor de productos.");
      setProductos([]);
      setModal({ tipo: "error", mensaje: "El servidor no está disponible. Intenta más tarde." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProducto = async (producto: Producto): Promise<void> => {
    setError(null);
    try {
      const response = await fetch(`${URL}/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.mensaje || "Error al agregar el producto");
      }

      const nuevoProducto = await response.json();
      setProductos(prev => [...prev, nuevoProducto]);
      toast.success(`¡Producto "${producto.nombre}" agregado con éxito!`);
    } catch (err: any) {
      setError(err.message || "❌ Error al agregar el producto.");
      toast.error("Algo salió mal...");
      throw err;
    }
  };

  const handleEditProducto = async (producto: Producto): Promise<void> => {
    setError(null);
    try {
      const response = await fetch(`${URL}/editar/${producto.codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.mensaje || "Error al editar el producto");
      }

      const productoActualizado = await response.json();
      setProductos(prev => prev.map(p => (p.codigo === producto.codigo ? productoActualizado : p)));
      toast.success(`¡Producto ${producto.nombre} actualizado correctamente!`);
    } catch (err: any) {
      setError(err.message || "❌ Error al editar el producto.");
      toast.error("Algo salió mal...");
    }
  };
  const handleDeleteProducto = async (codigo: string) => {
    setModal({
      tipo: "confirm",
      mensaje: "¿Seguro que deseas eliminar este insumo?",
      onConfirm: async () => {
        try {
          const response = await fetch(`${URL}/eliminar/${codigo}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error();

          setProductos(productos.filter((i) => i.codigo !== codigo));
          setModal(null);
          toast.success(`Se ha eliminado!`);
        } catch {
          setModal(null);
          toast.error("Algo salió mal...");
        }
        finally {
          setModal(null);
        }

      },
    });
  };

  return (
    <ProductosContext.Provider
      value={{
        productos,
        setProductos,
        productoSeleccionado,
        setProductoSeleccionado,
        modal,
        setModal,
        tipoModal,
        setTipoModal,
        isLoading,
        setIsLoading,
        error,
        setError,
        obtenerProductos,
        handleAddProducto,
        handleEditProducto,
        handleDeleteProducto,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
}