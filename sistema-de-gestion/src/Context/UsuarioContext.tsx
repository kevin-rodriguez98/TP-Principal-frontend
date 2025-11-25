import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import { URL_empleados as URL } from "../App";

// -------------------------------------------
// MODELO EMPLEADO
// -------------------------------------------
export interface Empleado {
  legajo: string;
  nombre: string;
  apellido: string;
  area: string;
  rol: string;
  isPrimerIngreso?: boolean;
}

// -------------------------------------------
// INTERFAZ DEL CONTEXT
// -------------------------------------------
interface UsuarioContextType {
  empleados: Empleado[];
  usuario: Empleado | null;
  cargando: boolean;
  isLoading: boolean;
  error: string | null;

  // Login y sesión
  login: (legajo: string, password: string) => Promise<Empleado>;
  logout: () => void;

  // ABM empleados
  agregarEmpleado: (empleado: Empleado) => Promise<void>;
  eliminarEmpleado: (legajo: string) => Promise<void>;
  modificarEmpleado: (empleado: Empleado) => Promise<void>;
  modificarPassword: (legajo: string, password: string) => Promise<void>;

  // Getters
  //obtenerEmpleado: (legajo: string) => Promise<Empleado | null>;

  // Recargas
  cargarEmpleados: () => Promise<void>;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

// -------------------------------------------
// PROVIDER
// -------------------------------------------
export const UsuarioProvider = ({ children }: { children: ReactNode }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuario, setUsuario] = useState<Empleado | null>(null);
  const [cargando, setCargando] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuario del storage y lista
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) setUsuario(JSON.parse(stored));
    cargarEmpleados();
  }, []);

  // -------------------------------------------
  // RECARGAR EMPLEADOS
  // -------------------------------------------
  const cargarEmpleados = async () => {
    try {
      setCargando(true);

      const res = await fetch(`${URL}/obtener-empleados`);
      if (!res.ok) throw new Error("Error al cargar empleados");

      const data = await res.json();
      console.log(data)
      setEmpleados(data);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setCargando(false);
    }
  };

  // -------------------------------------------
  // RECARGA CON RETORNO (para FaceAuth/login)
  // -------------------------------------------
  // const recargarEmpleadosConRetorno = async (): Promise<Empleado[]> => {
  //   try {
  //     const res = await fetch(`${URL}/obtener-empleados`);
  //     if (!res.ok) throw new Error("Error al obtener empleados");

  //     const data = await res.json();
  //     setEmpleados(data);
  //     return data;
  //   } catch {
  //     toast.error("No se pudieron obtener los empleados");
  //     return [];
  //   }
  // };

  // -------------------------------------------
  // LOGIN — POST body (nuevo)
  // -------------------------------------------
const login = async (legajo: string, password: string) => {
  setIsLoading(true);

  try {
    const res = await fetch(`${URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ legajo, password })
    });

    if (!res.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const empleado: Empleado = await res.json();

    setUsuario(empleado);
    localStorage.setItem("usuario", JSON.stringify(empleado));

    return empleado; // 👈 IMPORTANTE: DEVOLVER EL EMPLEADO

  } finally {
    setIsLoading(false);
  }
};

  // -------------------------------------------
  // LOGOUT
  // -------------------------------------------
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    toast.info("Sesión cerrada");
  };

  // -------------------------------------------
  // ABM: AGREGAR EMPLEADO
  // -------------------------------------------
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

  // -------------------------------------------
  // ABM: ELIMINAR EMPLEADO
  // -------------------------------------------
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

  // -------------------------------------------
  // ABM: MODIFICAR EMPLEADO
  // -------------------------------------------
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

  // -------------------------------------------
  // ABM: MODIFICAR PASSWORD
  // -------------------------------------------
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

  // -------------------------------------------
  // EXPOSICIÓN DEL CONTEXTO
  // -------------------------------------------
  return (
    <UsuarioContext.Provider
      value={{
        empleados,
        usuario,
        cargando,
        isLoading,
        error,
        login,
        logout,
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