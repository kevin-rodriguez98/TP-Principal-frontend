import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { URL_empleados } from "../App";
import { toast } from "react-toastify";

export interface Empleado {
    legajo: string;
    nombre: string;
    apellido: string;
    area: string;
    rol: string;
    isPrimerIngreso: boolean;
}

interface AuthContextType {
    user: Empleado | null;
    role: string | null;
    errors: Record<string, string>;
    isLoading: boolean;

    handleSubmit: (legajo: string, password: string) => Promise<void>;
    modificarPassword: (legajo: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Empleado | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setRole(parsed.rol);
        }
    }, []);

    const handleSubmit = async (legajo: string, password: string) => {
        try {
            const res = await fetch(`${URL_empleados}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ legajo, password }),
            });
            if (!res.ok) {
                setErrors({ login: "Credenciales inválidas" });
                return;
            }
            const data = await res.json();
            setUser(data);
            setRole(data.rol);
            localStorage.setItem("user", JSON.stringify(data));


            console.log("USER LOGUEADO →", data);
            navigate("/menu");
        } catch (error) {
            console.error("Error en login:", error);
            setErrors({ login: "Error en el servidor" });
        }
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem("user");
        navigate("/login");
        toast.info("Sesión cerrada");
        console.log(user)
    };

    const modificarPassword = async (legajo: string, password: string) => {
        try {
            setIsLoading(true);
            const res = await fetch(`${URL_empleados}/modificar-password`, {
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
        <AuthContext.Provider
            value={{
                user,
                role,
                errors,
                isLoading,
                handleSubmit,
                modificarPassword,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useUsuarios = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useUsuarios debe usarse dentro de AuthProvider");
    return ctx;
};
