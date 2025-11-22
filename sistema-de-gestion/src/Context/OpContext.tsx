import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarios } from "./UsuarioContext";

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
  icon: string;
  acciones: Accion[];
  rolesPermitidos?: string[];
}

const ROLES_PERMISOS: Record<string, string[]> = {
  GERENTE: [
    "Gestión de Stock",
    "Planificación de Producción",
    "Seguimiento de Producción",
    "Reportes",
    "Alta de Usuarios",
  ],
  ADMINISTRADOR: [
    "Gestión de Stock",
    "Planificación de Producción",
    "Reportes",
    "Alta de Usuarios",
  ],
  SUPERVISOR: [
    "Gestión de Stock",
    "Gestión de Producción",
    "Seguimiento de Producción",
  ],
  OPERARIO: [
    "Gestión de Stock",
    "Seguimiento de Producción",
  ],
};

export function OpProvider({ children }: OpProviderProps) {
  const navigate = useNavigate();
  const { usuario } = useUsuarios();

  const rolUsuario = (usuario?.rol || localStorage.getItem("rol") || "GERENTE").toUpperCase();

  const todosLosModulos: Modulo[] = [
    {
      label: "Gestión de Stock",
      icon: "./stock.png",
      acciones: [
        { label: "Gestionar insumos", onClick: () => navigate("/PanelGestion/0") },
        { label: "Gestionar registros", onClick: () => navigate("/PanelGestion/1") },
      ],
    },
    {
      label: "Gestión de Producción",
      icon: './produccion.png',
      acciones: [
        { label: "Gestionar Productos", onClick: () => navigate("/PanelGestion/2") },
        { label: "Gestionar Ordenes", onClick: () => navigate("/PanelGestion/3") },
      ]
    },

    {
      label: "Reportes",
      icon: './reportes.png',
      acciones: [
        { label: "Reportes de insumos", onClick: () => navigate("/reportes/insumos") },
        { label: "Reportes de producción", onClick: () => navigate("/reportes/ordenes") },
      ]
    },
    {
      label: "Alta de Usuarios",
      icon: "./usuarios.png",
      rolesPermitidos: ["GERENTE", "ADMINISTRADOR"],
      acciones: [
        { label: "Panel de usuarios", onClick: () => navigate("/usuarios") },
      ],
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

// Hook auxiliar
export const useOpContext = () => {
  const ctx = useContext(OpContext);
  if (!ctx) throw new Error("useOpContext debe usarse dentro de un OpProvider");
  return ctx;
};