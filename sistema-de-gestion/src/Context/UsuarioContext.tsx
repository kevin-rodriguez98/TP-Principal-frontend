import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
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
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider = ({ children }: { children: ReactNode }) => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [cargando, setCargando] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        cargarEmpleados();
    }, []);

    /** ----------------------------------------------------------
     * CARGAR EMPLEADOS
     * -----------------------------------------------------------*/
    const cargarEmpleados = async () => {
        try {
            setCargando(true);
            const res = await fetch(`${URL}`);
            if (!res.ok) throw new Error("Error al cargar empleados");

            const data = await res.json();
            setEmpleados(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    /** ----------------------------------------------------------
     * AGREGAR EMPLEADO
     * -----------------------------------------------------------*/
    const agregarEmpleado = async (nuevo: Empleado) => {
        try {
            setIsLoading(true);

            const res = await fetch(
                `${URL}/agregar-empleado`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(nuevo),
                }
            );

            if (!res.ok) throw new Error("Error al crear empleado");

            const empleadoGuardado: Empleado = await res.json();

            // lo agregamos a la lista
            setEmpleados((prev) => [...prev, empleadoGuardado]);

            toast.success("Empleado agregado correctamente");
        } catch (err: any) {
            toast.error(err.message);
            setError(err.message);
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
            }}
        >
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuarios = () => {
    const context = useContext(UsuarioContext);

    if (!context) {
        throw new Error("useUsuarios debe usarse dentro de un UsuarioProvider");
    }

    return context;
};
