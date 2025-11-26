import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import "../styles/Login.css";

const Login: React.FC = () => {
    const { handleSubmit, user,isAuthChecking  } = useContext(AuthContext)!;

    const [legajo, setLegajo] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [attemptedLogin, setAttemptedLogin] = useState(false); // ⭐ NUEVO

    const handleManualLogin = async () => {
        if (!legajo || !password) {
            setStatus("Ingrese legajo y contraseña");
            setSuccess(false);
            return;
        }
        setLoading(true);
        setAttemptedLogin(true); // ⭐ Activamos que ya intentó loguear
        await handleSubmit(legajo, password);
        setLoading(false);
    };

useEffect(() => {
    if (!attemptedLogin) return;

    // 🟡 Si está validando, no mostrar nada
    if (isAuthChecking) return;

    // 🟢 Login correcto
    if (user) {
        setStatus("✅ Credenciales correctas");
        setSuccess(true);
        return;
    }

    // 🔴 Login incorrecto
    setStatus("❌ Credenciales inválidas");
    setSuccess(false);

}, [user, attemptedLogin, isAuthChecking]);



    return (
        <div className="login-container">
            <div className="logo-box">
                <img src="/logo-blanco.png" alt="Logo" className="logo-img" />
                <h1 className="text-4xl font-extrabold text-white">
                    <span style={{ color: "var(--color-primary)", padding: "5px" }}>FROZEN</span>
                    Dashboard
                </h1>
            </div>

            <h2 className="login-title">Acceso al Sistema</h2>
            <p className="login-subtitle">Introduce tus credenciales para continuar.</p>

            <div className="manual-login">
                <input
                    type="text"
                    placeholder="Legajo"
                    value={legajo}
                    onChange={(e) => setLegajo(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="manual-buttons">
                    <button onClick={handleManualLogin} disabled={loading}>
                        {loading ? "Verificando..." : "Ingresar"}
                    </button>
                </div>
            </div>

            {attemptedLogin && status && (
                <p className={success ? "status-success" : "status-error"}>{status}</p>
            )}
        </div>
    );
};

export default Login;
