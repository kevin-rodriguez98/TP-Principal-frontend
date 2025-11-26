import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

interface Props {
    children: JSX.Element;
    roles?: string[]; // opcional: si querés validar solo algunos roles
}

export default function ProtectedRoute({ children}: Props) {
    const { user } = useContext(AuthContext)!;

    const isLogged = user || localStorage.getItem("user") !== null;

    if (!isLogged) {
        console.log("🔴 No autenticado — redirigiendo a /login");
        return <Navigate to="/login" replace />;
    }

    // Si la ruta requiere roles específicos
    // if (roles && (!user || !roles.includes(user.rol))) {
    //     return <Navigate to="/not-found" replace />;
    // }

    return children;
}
