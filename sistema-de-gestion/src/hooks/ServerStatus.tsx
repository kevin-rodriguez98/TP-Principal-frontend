import { useEffect, useState, useContext } from "react";
import { ModalContext } from "../components/modal/ModalContext";

interface UseServerStatusReturn {
    isServerUp: boolean;
    secureFetch: (url: string, options?: RequestInit, defaultMessage?: string) => Promise<Response>;
}

export function useServerStatus(pingUrl: string): UseServerStatusReturn {
    const { setModal } = useContext(ModalContext)!;

    const [isServerUp, setIsServerUp] = useState(true);

    // ===============================
    // Ping al backend cada 10s
    // ===============================
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(pingUrl, { method: "GET" });

                if (!res.ok) throw new Error();

                if (!isServerUp) setIsServerUp(true);

            } catch {
                if (isServerUp) {
                    setIsServerUp(false);
                    setModal({
                        tipo: "error",
                        mensaje: "No hay conexión con el servidor. Intenta nuevamente.",
                    });
                }
            }
        }, 10000); // cada 10 segundos

        return () => clearInterval(interval);
    }, [pingUrl, isServerUp, setModal]);



    // =================================================
    // 🧤 secureFetch → El reemplazo moderno de fetch
    // =================================================
    const secureFetch = async (
        url: string,
        options?: RequestInit,
        defaultMessage = "No se pudo completar la operación."
    ): Promise<Response> => {
        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                let errorData = null;

                try {
                    errorData = await response.json();
                } catch { }

                const message = errorData?.message || defaultMessage;

                setModal({
                    tipo: "error",
                    mensaje: message,
                });

                throw new Error(message);
            }

            return response;

        } catch (err) {
            setModal({
                tipo: "error",
                mensaje: "El servidor no está disponible.",
            });
            throw err;
        }
    };

    return { isServerUp, secureFetch };
}
