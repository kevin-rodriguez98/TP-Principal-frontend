import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
  legajo: string;
  nombre: string;
  apellido: string;
  email: string;
  event: "FACIAL" | "MANUAL";
  rol: string;
}

interface FaceAuthContextProps {
  user: User | null;
  users: User[];
  setUser: (user: User | null) => void;
  login: (
    legajo: string,
    nombre?: string,
    apellido?: string,
    email?: string,
    rol?: string,
    event?: "FACIAL" | "MANUAL"
  ) => Promise<void>;
  logout: () => void;
  reloadUsers: () => Promise<void>;
}

const FaceAuthContext = createContext<FaceAuthContextProps | undefined>(undefined);

const API_BASE = "https://reconocimiento-facial-opxl.onrender.com";

// Usuarios mock locales
const MOCK_USERS: User[] = [
  {
    legajo: "103",
    nombre: "Ana",
    apellido: "Pérez",
    email: "ana.perez@empresa.com",
    rol: "GERENTE",
    event: "MANUAL",
  },
  {
    legajo: "200",
    nombre: "Carlos",
    apellido: "Gómez",
    email: "carlos.gomez@empresa.com",
    rol: "ADMINISTRADOR",
    event: "MANUAL",
  },
  {
    legajo: "300",
    nombre: "Laura",
    apellido: "Díaz",
    email: "laura.diaz@empresa.com",
    rol: "SUPERVISOR",
    event: "MANUAL",
  },
  {
    legajo: "400",
    nombre: "Martín",
    apellido: "Ruiz",
    email: "martin.ruiz@empresa.com",
    rol: "OPERARIO",
    event: "MANUAL",
  },
];

export const FaceAuthProvider = ({ children }: { children: ReactNode }) => {
  // Usuario logueado
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Lista de usuarios
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // 🔵 Función que recarga usuarios y DEVUELVE los datos (clave para el login)
  const recargarUsuariosConRetorno = async (): Promise<User[]> => {
    try {
      const res = await fetch(`${API_BASE}/usuarios`);
      if (!res.ok) throw new Error("Error al obtener usuarios remotos");

      const data = await res.json();
      const remotos = Array.isArray(data) ? data : data.usuarios || [];

      const parsed = remotos.map((u: any) => ({
        legajo: String(u.legajo),
        nombre: u.nombre || "",
        apellido: u.apellido || "",
        email: u.email || "",
        rol: u.rol || "OPERARIO",
        event: "MANUAL" as const,
      }));

      const combinados = [
        ...MOCK_USERS,
        ...parsed.filter(
          (r: any) => !MOCK_USERS.some((m) => m.legajo === String(r.legajo))
        ),
      ];

      setUsers(combinados);

      return combinados; // 🔥 Esta es la clave
    } catch (err) {
      console.error("❌ Error al obtener usuarios remotos:", err);
      setUsers(MOCK_USERS);
      return MOCK_USERS;
    }
  };

  // Recargar al iniciar
  const reloadUsers = async () => {
    await recargarUsuariosConRetorno();
  };

  useEffect(() => {
    reloadUsers();
  }, []);

  // Persistencia de usuario
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("rol", user.rol);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("rol");
    }
  }, [user]);

  // 🔵 LOGIN 100% FIXEADO
  const login = async (
    legajo: string,
    nombre?: string,
    apellido?: string,
    email?: string,
    rol?: string,
    event: "FACIAL" | "MANUAL" = "MANUAL"
  ) => {
    // 1) Buscar en usuarios actuales
    let usuario = users.find((u) => u.legajo === legajo);

    // 2) Si no está, recargar lista y buscar de nuevo
    if (!usuario) {
      const nuevosUsuarios = await recargarUsuariosConRetorno();
      usuario = nuevosUsuarios.find((u) => u.legajo === legajo);
    }

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const userData: User = {
      legajo: usuario.legajo,
      nombre: usuario.nombre || nombre || "",
      apellido: usuario.apellido || apellido || "",
      email: usuario.email || email || "",
      rol: usuario.rol || rol || "OPERARIO",
      event,
    };

    setUser(userData);
    localStorage.setItem("rol", userData.rol);
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("rol");
  };

  return (
    <FaceAuthContext.Provider
      value={{ user, users, setUser, login, logout, reloadUsers }}
    >
      {children}
    </FaceAuthContext.Provider>
  );
};

export const useFaceAuth = () => {
  const context = useContext(FaceAuthContext);
  if (!context)
    throw new Error("useFaceAuth must be used within FaceAuthProvider");
  return context;
};

