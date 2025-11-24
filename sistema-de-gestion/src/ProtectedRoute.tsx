import { Navigate } from "react-router-dom";
import { useUsuarios } from "./Context/UsuarioContext";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { usuario } = useUsuarios();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
