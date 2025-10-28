import React, { useRef, useState, useEffect } from "react";
import { useFaceAuth } from "../Context/FaceAuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const API_BASE = "https://reconocimiento-facial-opxl.onrender.com";

interface LoginProps {
  onCancel?: () => void;
}

const Login: React.FC<LoginProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setUser } = useFaceAuth();

  const [status, setStatus] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [manualMode, setManualMode] = useState<boolean>(true);
  const [legajo, setLegajo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraOn, setCameraOn] = useState<boolean>(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [errorRetryTimeout, setErrorRetryTimeout] = useState<number | null>(null);

  /** Encender cámara */
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
      setSuccess(false);
      setCameraOn(false);
      retryAfterError();
    }
  };

  /** Apagar cámara */
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setCaptured(null);
    if (errorRetryTimeout) clearTimeout(errorRetryTimeout);
  };

  /** Reiniciar cámara tras error */
  const retryAfterError = () => {
    setCaptured(null);
    setStatus("Intentá de nuevo...");
    setSuccess(true); // mensaje verde
    setErrorRetryTimeout(
      window.setTimeout(() => {
        startCamera();
      }, 3000)
    );
  };

  /** Detección facial */
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

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setLoading(false);
        retryAfterError();
        return;
      }
      const form = new FormData();
      form.append("file", blob, "frame.jpg");

      try {
        const res = await fetch(`${API_BASE}/detect`, { method: "POST", body: form });
        const data = await res.json();

        if (!data.faces || data.faces.length === 0 || !data.faces[0].saved) {
          setStatus("Intentá de nuevo...");
          setSuccess(true); // verde
          setLoading(false);
          retryAfterError();
        } else {
          const face = data.faces[0];

          stopCamera(); // apagar cámara antes de cambiar estados
          setStatus(`✅ Bienvenido ${face.nombre}`);
          setSuccess(true);

          const userData = { legajo: face.nombre, nombre: face.nombre, event: face.event };
          setUser(userData);

          setTimeout(() => navigate("/"), 1500);
        }
      } catch (err) {
        console.error(err);
        setStatus("Intentá de nuevo...");
        setSuccess(true); // verde
        setLoading(false);
        retryAfterError();
      } finally {
        setLoading(false);
      }
    }, "image/jpeg", 0.9);
  };

  /** Login manual */
  const handleManualLogin = () => {
    if (!legajo || !password) {
      setStatus("Ingrese legajo y contraseña");
      setSuccess(false);
      return;
    }

    stopCamera(); // apagar cámara si estaba encendida
    setStatus(`✅ Bienvenido ${legajo} (login manual)`);
    setSuccess(true);
    const userData = { legajo, nombre: legajo, event: "MANUAL" };
    setUser(userData);

    setTimeout(() => navigate("/"), 1500);
  };

  /** Limpiar timers al desmontar */
  useEffect(() => {
    return () => {
      if (errorRetryTimeout) clearTimeout(errorRetryTimeout);
      stopCamera();
    };
  }, []);

  return (
    <div className="login-container">
      <h2>Login</h2>

      {manualMode ? (
        <div className="manual-login">
          <input
            type="text"
            placeholder="Legajo / Usuario"
            value={legajo}
            onChange={e => setLegajo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="manual-buttons">
            <button onClick={handleManualLogin}>Ingresar</button>
            <button
              onClick={() => { setManualMode(false); startCamera(); }}
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
            <button
              onClick={handleDetect}
              disabled={!cameraOn || loading}
            >
              {loading ? "Procesando..." : captured ? "Volver a intentar" : "Detectar rostro"}
            </button>
            <button
              onClick={() => { stopCamera(); setManualMode(true); }}
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