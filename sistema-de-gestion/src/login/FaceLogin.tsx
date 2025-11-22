import React, { useRef, useState, useEffect } from "react";
import { useUsuarios } from "../Context/UsuarioContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useFaceAuth } from "../Context/FaceAuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { login } = useUsuarios();
  const {loginFacial} = useFaceAuth();

  const [status, setStatus] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [manualMode, setManualMode] = useState<boolean>(true);

  const [legajo, setLegajo] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [cameraOn, setCameraOn] = useState<boolean>(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [errorRetryTimeout, setErrorRetryTimeout] = useState<number | null>(null);

  /** ------------------------------------------------------
   * Encender cámara
   * ------------------------------------------------------*/
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      setCameraOn(true);
      setCaptured(null);
      setStatus("");
      setSuccess(false);

    } catch (err) {
      setStatus("No se pudo acceder a la cámara");
      setCameraOn(false);
      retryAfterError();
    }
  };

  /** ------------------------------------------------------
   * Apagar cámara
   * ------------------------------------------------------*/
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

  /** ------------------------------------------------------
   * Reintentar si falla la cámara
   * ------------------------------------------------------*/
  const retryAfterError = () => {
    setStatus("Intentá de nuevo...");
    setErrorRetryTimeout(
      window.setTimeout(() => {
        startCamera();
      }, 3000)
    );
  };

  /** ------------------------------------------------------
   * Detección facial
   * ------------------------------------------------------*/
  const handleDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setLoading(true);
    setStatus("Detectando rostro...");

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
      /**
       * ⚡ Aquí se supone que el backend facial responde con un legajo detectado.
       * Cuando lo tengas, reemplazas "" por legajoDetectado.
       */
      const legajoDetectado = ""; // ← cambiar cuando tengas backend

      if (!legajoDetectado) throw new Error("No se detectó ningún usuario");

      // SI el facial detecta legajo pero no password → password vacío
      await loginFacial(legajoDetectado, legajoDetectado);

      stopCamera();
      setStatus("✅ Ingreso facial exitoso");
      setSuccess(true);

      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setStatus("❌ Usuario no encontrado o no autorizado");
      setSuccess(false);
      retryAfterError();
    } finally {
      setLoading(false);
    }
  };

  /** ------------------------------------------------------
   * Login manual con validación real
   * ------------------------------------------------------*/
  const handleManualLogin = async () => {
    if (!legajo || !password) {
      setStatus("Ingrese legajo y contraseña");
      setSuccess(false);
      return;
    }

    setLoading(true);

    try {
      await login(legajo, password);

      stopCamera();
      setStatus("✅ Credenciales correctas");
      setSuccess(true);

      setTimeout(() => navigate("/"), 1500);

    } catch {
      setStatus("❌ Credenciales inválidas");
      setSuccess(false);

    } finally {
      setLoading(false);
    }
  };

  /** ------------------------------------------------------
   * Cleanup
   * ------------------------------------------------------*/
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