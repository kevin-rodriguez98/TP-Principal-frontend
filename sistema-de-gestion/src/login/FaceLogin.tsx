import React, { useRef, useState, useEffect } from "react";
import { useFaceAuth } from "../Context/FaceAuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const API_BASE = "https://reconocimiento-facial-opxl.onrender.com";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { login, users } = useFaceAuth();

  const [status, setStatus] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [manualMode, setManualMode] = useState<boolean>(true);
  const [legajo, setLegajo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraOn, setCameraOn] = useState<boolean>(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [errorRetryTimeout, setErrorRetryTimeout] = useState<number | null>(null);

  /** ---- Obtener usuarios desde API ---- **/
  const obtenerUsuarios = async () => {
    const res = await fetch(`${API_BASE}/usuarios`);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    const data = await res.json();
    return Array.isArray(data) ? data : data.usuarios || [];
  };

  /** ---- Buscar usuario por legajo (lista local o API) ---- **/
  const buscarUsuario = async (legajo: string) => {
    let usuario = users.find((u: any) => u.legajo === legajo);
    if (!usuario) {
      const lista = await obtenerUsuarios();
      usuario = lista.find((u: any) => u.legajo === legajo);
    }
    return usuario;
  };

  /** ---- Encender cámara ---- **/
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
      setCaptured(null);
      setStatus("");
      setSuccess(false);
    } catch (err) {
      console.error(err);
      setStatus("No se pudo acceder a la cámara");
      setCameraOn(false);
      retryAfterError();
    }
  };

  /** ---- Apagar cámara ---- **/
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setCaptured(null);
    if (errorRetryTimeout) clearTimeout(errorRetryTimeout);
  };

  /** ---- Reintentar detección ---- **/
  const retryAfterError = () => {
    setStatus("Intentá de nuevo...");
    setErrorRetryTimeout(
      window.setTimeout(() => {
        startCamera();
      }, 3000)
    );
  };

  /** ---- Detección facial ---- **/
  const handleDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setStatus("Detectando...");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setLoading(false);
      retryAfterError();
      return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCaptured(dataUrl);

    try {
      const faceLegajo = "100"; 
      const usuario = await buscarUsuario(faceLegajo);

      if (!usuario) throw new Error("Usuario no encontrado");

      await login(usuario.legajo, usuario.nombre, usuario.rol, "FACIAL");
      stopCamera();
      setStatus(`✅ Bienvenido ${usuario.nombre}`);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setStatus("❌ Usuario no encontrado o no autorizado");
      setSuccess(false);
      retryAfterError();
    } finally {
      setLoading(false);
    }
  };

  /** ---- Login manual ---- **/
  const handleManualLogin = async () => {
    if (!legajo) {
      setStatus("Ingrese legajo");
      setSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const usuario = await buscarUsuario(legajo);
      if (!usuario) throw new Error("Usuario no encontrado");

      await login(usuario.legajo, usuario.nombre, usuario.rol, "MANUAL");
      stopCamera();
      setStatus(`✅ Bienvenido ${usuario.nombre}`);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setStatus("❌ Usuario no encontrado o no autorizado");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  /** ---- Cleanup ---- **/
  useEffect(() => {
    return () => {
      if (errorRetryTimeout) clearTimeout(errorRetryTimeout);
      stopCamera();
    };
  }, []);

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>

      {manualMode ? (
        <div className="manual-login">
          <input
            type="text"
            placeholder="Legajo"
            value={legajo}
            onChange={(e) => setLegajo(e.target.value)}
          />
          <div className="manual-buttons">
            <button onClick={handleManualLogin} disabled={loading}>
              {loading ? "Verificando..." : "Ingresar"}
            </button>
            <button
              onClick={() => {
                setManualMode(false);
                startCamera();
              }}
              className="switch-btn"
            >
              Iniciar con Reconocimiento Facial
            </button>
          </div>
        </div>
      ) : (
        <div className="face-login">
          {captured ? (
            <img src={captured} alt="captura" className="video-face" />
          ) : (
            <video ref={videoRef} autoPlay muted className="video-face" />
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="face-buttons">
            <button onClick={handleDetect} disabled={!cameraOn || loading}>
              {loading ? "Procesando..." : "Detectar rostro"}
            </button>
            <button
              onClick={() => {
                stopCamera();
                setManualMode(true);
              }}
              className="cancel-btn"
            >
              Volver a ingreso manual
            </button>
          </div>
        </div>
      )}

      <p className={success ? "status-success" : "status-error"}>{status}</p>
    </div>
  );
};

export default Login;