import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

interface Props {
    children: JSX.Element;
    roles?: string[]; // opcional: si querés validar solo algunos roles
}

export default function ProtectedRoute({ children }: Props) {
    const { user } = useContext(AuthContext)!;

    if (user) {
        return children;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);

            // Si querés, podés validar campos:
            if (parsed?.legajo) {
                return children;
            }
        } catch (e) {
            console.error("Error leyendo usuario almacenado", e);
        }
    }

    console.log("🔴 No autenticado — redirigiendo a /login");
    return <Navigate to="/login" replace />;
}
