import React from "react";
import type { Estante } from "./data"; 

interface Props {
    selectedShelf: Estante | null;
    setSelectedShelf: (shelf: Estante | null) => void;
}

const ShelfModal: React.FC<Props> = ({ selectedShelf, setSelectedShelf, }) => {
    if (!selectedShelf) return null;

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0, 0, 0, 0.55)",
                    backdropFilter: "blur(4px)",
                    zIndex: 9998,
                }}
                onClick={() => setSelectedShelf(null)}
            />
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "380px",
                    background: "rgba(20, 22, 28, 0.92)",
                    color: "#e5e7eb",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
                    zIndex: 9999,
                    animation: "fadeIn 0.2s ease-out",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(8px)",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <button
                    onClick={() => setSelectedShelf(null)}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 12,
                        background: "transparent",
                        border: "none",
                        fontSize: "22px",
                        cursor: "pointer",
                        color: "#aaa",
                    }}
                >
                    ✕
                </button>
                {/* Título */}
                <h2 style={{ margin: 0, marginBottom: 12, fontSize: 22, fontWeight: 700, color: "#fff" }}>
                    Estante {selectedShelf.id}
                </h2>
                {/* Sector */}
                <p style={{ margin: "6px 0", fontSize: 15 }}>
                    Sector: <strong style={{ color: "#4fc3f7" }}>{selectedShelf.sectorId}</strong>
                </p>
                {/* ID */}
                <p style={{ margin: "4px 0", fontSize: 14, opacity: 0.75 }}>ID interno: {selectedShelf.id}</p>
                {/* Posiciones */}
                {selectedShelf.posiciones ? (
                    <div style={{ marginTop: 14 }}>
                        <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Posiciones:</h3>
                        <ul style={{ paddingLeft: 18, margin: 0, opacity: 0.9 }}>
                            {Object.keys(selectedShelf.posiciones).map((p) => (
                                <li key={p} style={{ fontSize: 14 }}>
                                    {p}
                                    {/* {p} → x:{selectedShelf.posiciones[p].x} / y:{selectedShelf.posiciones[p].y} */}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p style={{ opacity: 0.6, marginTop: 10 }}>Este estante no tiene posiciones definidas.</p>
                )}

                {/* Botones */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 26 }}>
                    <button
                        onClick={() => setSelectedShelf(null)}
                        style={{
                            padding: "8px 14px",
                            borderRadius: 8,
                            background: "#2a2e37",
                            border: "1px solid #3a3f4a",
                            cursor: "pointer",
                            color: "#ddd",
                            fontWeight: 500,
                        }}
                    >
                        Cerrar
                    </button>

                </div>
            </div>

            {/* Animación */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -46%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
        </>
    );
};

export default ShelfModal;
