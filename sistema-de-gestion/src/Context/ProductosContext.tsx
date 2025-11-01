import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import { ModalContext } from "../components/modal/ModalContext";
import { URL_productos as URL } from "../App";

export interface Producto {
  codigo: string;
  nombre: string;
  categoria: string;
  marca: string;
  unidad: string;
  stock: number;
}

interface ProductoContextType {
  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
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
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setModal } = useContext(ModalContext)!;

  // ✅ Función centralizada para manejar errores HTTP
  const handleFetchError = async (response: Response, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    try {
      const data = await response.json();
      if (data?.message) errorMessage = data.message;
    } catch { /* no-op */ }

    if (response.status === 500) {
      setModal({
        tipo: "error",
        mensaje: errorMessage,
      });
    } else {
      toast.error(errorMessage);
    }

    throw new Error(errorMessage);
  };

  // 🔄 Carga inicial de productos
  useEffect(() => {
    obtenerProductos();
  }, []);

  // 📦 Obtener todos los productos
  const obtenerProductos = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await fetch(`${URL}/obtener`);
      if (!response.ok) await handleFetchError(response, "Error al obtener los productos");

      const data = await response.json();
      setProductos(data);
    } catch {
      setError("❌ No se pudo conectar con el servidor de productos.");
      setProductos([]);

      setModal({
        tipo: "error",
        mensaje: "El servidor no está disponible. Intenta más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ➕ Agregar producto
  const handleAddProducto = async (producto: Producto): Promise<void> => {
    setError(null);
    try {
      const response = await fetch(`${URL}/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (!response.ok)
        await handleFetchError(response, "Error al agregar el producto");

      const nuevoProducto = await response.json();
      setProductos((prev) => [...prev, nuevoProducto]);
      toast.success(`¡Producto "${producto.nombre}" agregado con éxito!`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✏️ Editar producto
  const handleEditProducto = async (producto: Producto): Promise<void> => {
    setError(null);
    try {
      const response = await fetch(`${URL}/editar/${producto.codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (!response.ok)
        await handleFetchError(response, "Error al editar el producto");

      const productoActualizado = await response.json();
      setProductos((prev) =>
        prev.map((p) => (p.codigo === producto.codigo ? productoActualizado : p))
      );

      toast.success(`¡Producto ${producto.nombre} actualizado correctamente!`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 🗑️ Eliminar producto con modal global
  const handleDeleteProducto = (codigo: string) => {
    const producto = productos.find((p) => p.codigo === codigo);

    setModal({
      tipo: "confirm",
      mensaje: `¿Seguro que deseas eliminar el producto "${producto?.nombre || codigo}"?`,
      onConfirm: async () => {
        try {
          const response = await fetch(`${URL}/eliminar/${codigo}`, {
            method: "DELETE",
          });

          if (!response.ok)
            await handleFetchError(response, "Error al eliminar el producto");

          setProductos((prev) => prev.filter((p) => p.codigo !== codigo));
          toast.success("Producto eliminado correctamente.");
        } catch {
          toast.error("❌ No se pudo eliminar el producto.");
        } finally {
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
