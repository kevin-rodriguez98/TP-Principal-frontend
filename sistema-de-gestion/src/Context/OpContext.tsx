import { createContext, useContext, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

// ÍCONOS MODERNOS
import { Boxes, Factory, LineChart, UsersRound, } from "lucide-react";

const COLORS = ["#8c52ff", "#f1c40f", "#b13c7e", "#d88346", "#b062ce"];

interface OpContextType {
  modulos: Modulo[];
}

export const OpContext = createContext<OpContextType | undefined>(undefined);

interface OpProviderProps {
  children: React.ReactNode;
}

interface Accion {
  label: string;
  onClick: () => void;
}

export interface Modulo {
  label: string;
  subtitle: string;
  icon: JSX.Element;
  color: string;
  acciones: Accion[];
  rolesPermitidos?: string[];
}

const ROLES_PERMISOS: Record<string, string[]> = {
  GERENTE: [
    "Gestión de Stock",
    "Gestión de Producción",
    "Seguimiento de Producción",
    "Reportes",
    "Alta de Usuarios",
  ],
  ADMINISTRADOR: [
    "Gestión de Stock",
    "Gestión de Producción",
    "Reportes",
    "Alta de Usuarios",
  ],
  SUPERVISOR: ["Gestión de Stock", "Gestión de Producción", "Seguimiento de Producción"],
  OPERARIO: ["Gestión de Stock", "Seguimiento de Producción"],
};

export function OpProvider({ children }: OpProviderProps) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)!;

  const rolUsuario =
    (user?.rol || localStorage.getItem("rol") || "GERENTE").toUpperCase();

  const todosLosModulos: Modulo[] = [
    {
      label: "Gestión de Stock",
      subtitle: "Inventario y movimientos",   // ⭐ NUEVO
      color: COLORS[0],
      icon: <Boxes size={40} color={COLORS[0]} />,
      acciones: [
        { label: "Gestionar insumos", onClick: () => navigate("/PanelGestion/0") },
        { label: "Gestionar registros", onClick: () => navigate("/PanelGestion/1") },
      ],
    },
    {
      label: "Gestión de Producción",
      subtitle: "Control de procesos",        // ⭐ NUEVO
      color: COLORS[1],
      icon: <Factory size={40} color={COLORS[1]} />,
      acciones: [
        { label: "Gestionar Productos", onClick: () => navigate("/PanelGestion/2") },
        { label: "Gestionar Ordenes", onClick: () => navigate("/PanelGestion/3") },
      ],
    },
    {
      label: "Reportes",
      subtitle: "Análisis y estadísticas",    // ⭐ NUEVO
      color: COLORS[2],
      icon: <LineChart size={40} color={COLORS[2]} />,
      acciones: [
        { label: "Reportes de insumos", onClick: () => navigate("/reportes/insumos") },
        { label: "Reportes de producción", onClick: () => navigate("/reportes/ordenes") },
      ],
    },
    {
      label: "Alta de Usuarios",
      subtitle: "Administración de cuentas",  // ⭐ NUEVO
      color: COLORS[3],
      icon: <UsersRound size={40} color={COLORS[3]} />,
      rolesPermitidos: ["GERENTE", "ADMINISTRADOR"],
      acciones: [{ label: "Panel de usuarios", onClick: () => navigate("/usuarios") }],
    },
  ];

  const modulosFiltrados = todosLosModulos.filter((mod) => {
    if (rolUsuario === "GERENTE") return true;

    const permisosRol = ROLES_PERMISOS[rolUsuario];
    if (!permisosRol) {
      return !!mod.rolesPermitidos && mod.rolesPermitidos.includes(rolUsuario);
    }

    const permitidoPorModulo = mod.rolesPermitidos
      ? mod.rolesPermitidos.includes(rolUsuario)
      : false;
    const permitidoPorMapping = permisosRol.includes(mod.label);

    return permitidoPorModulo || permitidoPorMapping;
  });

  return (
    <OpContext.Provider value={{ modulos: modulosFiltrados }}>
      {children}
    </OpContext.Provider>
  );
}

export const useOpContext = () => {
  const ctx = useContext(OpContext);
  if (!ctx) throw new Error("useOpContext debe usarse dentro de un OpProvider");
  return ctx;
};
