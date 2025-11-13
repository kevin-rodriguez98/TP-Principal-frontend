import type { ModalContextType } from "../modal/ModalContext";

let servidorCaido = false; // 🔒 bandera global

export const isServidorCaido = () => servidorCaido;

export const ServerResponse = (setModal: ModalContextType["setModal"]) => {
    return async (url: string, options?: RequestInit) => {
        try {
            const response = await fetch(url, options);

            // ✅ Si vuelve a responder, reiniciamos la bandera
            if (servidorCaido && response.ok) {
                servidorCaido = false;
            }

            return response;
        } catch (error) {
            console.error("Error de conexión con el servidor:", error);

            // ⚠️ Solo mostramos el modal una vez
            if (!servidorCaido) {
                servidorCaido = true;
                setModal({
                    tipo: "error",
                    mensaje: "El servidor no está disponible.\nIntenta más tarde.",
                });
            }

            throw error;
        }
    };
};
