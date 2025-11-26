import { createContext, useContext, useState, useEffect, type ReactNode, } from "react";
import { toast } from "react-toastify";
import { URL_empleados as URL } from "../App";

export interface Empleado {
  legajo: string;
  nombre: string;
  apellido: string;
  area: string;
  rol: string;
}
interface UsuarioContextType {
  empleados: Empleado[];
  cargando: boolean;
  isLoading: boolean;
  error: string | null;
  agregarEmpleado: (empleado: Empleado) => Promise<void>;
  eliminarEmpleado: (legajo: string) => Promise<void>;
  modificarEmpleado: (empleado: Empleado) => Promise<void>;
  modificarPassword: (legajo: string, password: string) => Promise<void>;
  cargarEmpleados: () => Promise<void>;
}

export const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider = ({ children }: { children: ReactNode }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuario del storage y lista
  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setCargando(true);

      const res = await fetch(`${URL}/obtener-empleados`);
      if (!res.ok) throw new Error("Error al cargar empleados");

      const data = await res.json();
      setEmpleados(data);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setCargando(false);
    }
  };

  const agregarEmpleado = async (nuevo: Empleado) => {
    try {
      setIsLoading(true);

      const res = await fetch(`${URL}/agregar-empleado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });

      if (!res.ok) throw new Error("Error al crear empleado");

      const guardado = await res.json();
      setEmpleados((prev) => [...prev, guardado]);

      toast.success("Empleado agregado correctamente");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarEmpleado = async (legajo: string) => {
    try {
      setIsLoading(true);

      const res = await fetch(`${URL}/eliminar-empleado/${legajo}`, {
        method: "POST",
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error al eliminar empleado");
      }

      setEmpleados((prev) => prev.filter((e) => e.legajo !== legajo));
      toast.success("Empleado eliminado");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const modificarEmpleado = async (emp: Empleado) => {
    try {
      setIsLoading(true);

      const res = await fetch(`${URL}/modificar-empleado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emp),
      });

      if (!res.ok) throw new Error("Error al modificar empleado");

      setEmpleados((prev) =>
        prev.map((e) => (e.legajo === emp.legajo ? emp : e))
      );

      toast.success("Empleado modificado");
    } finally {
      setIsLoading(false);
    }
  };

  const modificarPassword = async (legajo: string, password: string) => {
    try {
      setIsLoading(true);

      const res = await fetch(`${URL}/modificar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legajo, password }),
      });

      if (!res.ok) throw new Error("No se pudo cambiar la contraseña");

      toast.success("Contraseña actualizada");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UsuarioContext.Provider
      value={{
        empleados,
        cargando,
        isLoading,
        error,
        agregarEmpleado,
        eliminarEmpleado,
        modificarEmpleado,
        modificarPassword,
        cargarEmpleados,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuarios = () => {
  const ctx = useContext(UsuarioContext);
  if (!ctx) throw new Error("useUsuarios debe usarse dentro de UsuarioProvider");
  return ctx;
};