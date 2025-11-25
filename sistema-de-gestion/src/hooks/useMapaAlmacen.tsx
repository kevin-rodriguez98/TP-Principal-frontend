import { useCallback, useEffect, useRef, useState, useContext } from "react";
import Konva from "konva";
import { InsumoContext } from "../Context/InsumoContext";
import { ESTANTES } from "../components/mapa/data";

export function useMapaAlmacen({ codigo, estante, posicion }) {
    const containerRef = useRef(null);
    const stageRef = useRef(null);
    const pulseRef = useRef(null);

    const [stageSize, setStageSize] = useState({ width: 600, height: 700 });
    const [scale, setScale] = useState(1);
    const [positionStage, setPositionStage] = useState({ x: 0, y: 0 });
    const [hoverShelf, setHoverShelf] = useState(null);
    const [selectedShelf, setSelectedShelf] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [marker, setMarker] = useState(null);

    const { insumos } = useContext(InsumoContext)!;

 const containerRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<any>(null);
    const [stageSize, setStageSize] = useState({ width: 600, height: 700 });
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hoverShelf, setHoverShelf] = useState<string | null>(null);
    const [selectedShelf, setSelectedShelf] = useState<Estante | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
    const { insumos } = useContext(InsumoContext)!;
    const [searchError, setSearchError] = useState<string | null>(null);
    const [marker, setMarker] = useState<{ x: number; y: number; label: string } | null>(null);
    const pulseRef = useRef<Konva.Circle>(null);



    useEffect(() => {
        if (!pulseRef.current) return;
        const circle = pulseRef.current;
        const anim = new Konva.Animation((frame) => {
            if (!frame) return;
            const scale = 1 + Math.sin(frame.time / 300) * 0.4;
            const opacity = 0.6 - Math.sin(frame.time / 300) * 0.4;
            circle.scale({ x: scale, y: scale });
            circle.opacity(opacity);
        });
        anim.start();
        return () => {
            anim.stop();
        };
    }, []);

    // Ajustar zoom inicial para que el mapa arranque más grande y centrado
    useEffect(() => {
        if (!stageRef.current) return;
        const stage = stageRef.current;
        const containerW = stageSize.width;
        const mapWidth = 1100;
        const initialZoom = containerW / mapWidth;
        // Centrar verticalmente
        const offsetX = 0; // ya encaja horizontalmente
        const offsetY = 0;
        setScale(initialZoom);
        setPosition({ x: offsetX, y: offsetY });
        stage.scale({ x: initialZoom, y: initialZoom });
        stage.position({ x: offsetX, y: offsetY });
        stage.batchDraw();
    }, [stageSize]);

    useEffect(() => {
        if (!estante) return;          // si no vino desde la tabla → no hacer nada
        if (!codigo) return;
        const shelf = ESTANTES.find(s => s.id === estante);
        if (!shelf) return;
        let targetX = shelf.x + shelf.width / 2;
        let targetY = shelf.y + shelf.height / 2;
        if (posicion && shelf.posiciones?.[posicion]) {
            targetX = shelf.x + shelf.posiciones[posicion].x;
            targetY = shelf.y + shelf.posiciones[posicion].y;
        }
        // mover cámara
        centerOn(targetX, targetY, 2.5);

        // colocar marker
        setMarker({
            x: targetX,
            y: targetY,
            label: `${codigo} (${estante}-${posicion ?? ""})`
        });

    }, [codigo, estante, posicion]);

    useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;
            setStageSize({
                width: containerRef.current.clientWidth,
                height: 600, // altura fija cómoda pero ajustable
            });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

const centerOn = useCallback((x: number, y: number, zoom = 1.8) => {
    const stage = stageRef.current;
    if (!stage) return;

    const containerW = stage.width();
    const containerH = stage.height();
    const newScale = zoom;

    const newX = -x * newScale + containerW / 2;
    const newY = -y * newScale + containerH / 2;

    stage.scale({ x: newScale, y: newScale });
    stage.position({ x: newX, y: newY });
    stage.batchDraw();

    setScale(newScale);
    setPosition({ x: newX, y: newY });
}, []);


    // Manejo de rueda (zoom centrado en el puntero)
    // const handleWheel = (e: any) => {
    //     e.evt.preventDefault();
    //     const stage = stageRef.current;
    //     if (!stage) return;

    //     const oldScale = stage.scaleX();
    //     const pointer = stage.getPointerPosition();
    //     if (!pointer) return;

    //     const scaleBy = 1.05;

    //     // Calcular nuevo scale
    //     let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    //     // 🔒 límites del zoom
    //     const MIN_SCALE = 0.8;   // no permite achicar más que esto
    //     const MAX_SCALE = 3;     // opcional

    //     if (newScale < MIN_SCALE) newScale = MIN_SCALE;
    //     if (newScale > MAX_SCALE) newScale = MAX_SCALE;

    //     // zoom centrado en el puntero
    //     const mousePointTo = {
    //         x: (pointer.x - stage.x()) / oldScale,
    //         y: (pointer.y - stage.y()) / oldScale,
    //     };

    //     const newPos = {
    //         x: pointer.x - mousePointTo.x * newScale,
    //         y: pointer.y - mousePointTo.y * newScale,
    //     };

    //     stage.scale({ x: newScale, y: newScale });
    //     stage.position(newPos);
    //     stage.batchDraw();

    //     setScale(newScale);
    //     setPosition(newPos);
    // };

    // buscar producto y centrar en su estante
    const handleSearch = (codigoBuscado: string) => {
        const insumo = insumos.find(i => i.codigo === codigoBuscado);

        if (!insumo) {
            setSearchError("Producto no encontrado.");
            return;
        }

        const shelfId = insumo.locacion?.estante;
        const posId = insumo.locacion?.posicion;

        if (!shelfId) {
            setSearchError("El producto no tiene estante asignado.");
            setMarker(null)
            return;
        }

        const shelf = ESTANTES.find(s => s.id === shelfId);

        if (!shelf) {
            setSearchError("Estante no encontrado.");
            setMarker(null)
            return;
        }

        // borrar errores
        setSearchError(null);
        setMarker(null);

        // calcular coordenadas
        let targetX = shelf.x + shelf.width / 2;
        let targetY = shelf.y + shelf.height / 2;

        if (posId && shelf.posiciones?.[posId]) {
            targetX = shelf.x + shelf.posiciones[posId].x;
            targetY = shelf.y + shelf.posiciones[posId].y;
        }

        // colocar marcador
        setMarker({
            x: targetX,
            y: targetY,
            label: `${insumo.codigo} (${shelfId}-${posId ?? ""})`,
        });

        setSelectedShelf(null);
    };

    // click en estante: abrir modal (aquí simple panel)
    // const handleShelfClick = (shelf: Estante) => {
    //     // position del mouse para tooltip (convertir a stage coords)
    //     const stage = stageRef.current;
    //     if (!stage) return;

    //     const pointer = stage.getPointerPosition();
    //     setSelectedShelf(shelf);
    //     setTooltip({ x: pointer ? pointer.x : shelf.x, y: pointer ? pointer.y : shelf.y, text: shelf.id });
    // };

    // render del popup/modal simple
    const renderModal = () => {
        if (!selectedShelf) return null;

        return (
            <>
                {/* Overlay oscuro */}
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0, 0, 0, 0.45)",
                        backdropFilter: "blur(3px)",
                        zIndex: 9998,
                    }}
                    onClick={() => setSelectedShelf(null)}
                />

                {/* Modal */}
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "360px",
                        background: "#ffffff",
                        borderRadius: "16px",
                        padding: "22px",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                        zIndex: 9999,
                        animation: "fadeIn 0.2s ease-out",
                        fontFamily: "Inter, sans-serif",
                    }}
                >
                    {/* Botón cerrar */}
                    <button
                        onClick={() => setSelectedShelf(null)}
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 12,
                            background: "transparent",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer",
                            opacity: 0.6,
                        }}
                    >
                        ✕
                    </button>

                    <h2
                        style={{
                            margin: 0,
                            marginBottom: 10,
                            fontSize: "20px",
                            fontWeight: 700,
                        }}
                    >
                        Estante {selectedShelf.id}
                    </h2>

                    <p style={{ margin: "4px 0", fontSize: "15px" }}>
                        Sector:{" "}
                        <strong style={{ fontWeight: 600 }}>
                            {selectedShelf.sectorId}
                        </strong>
                    </p>

                    <p style={{ margin: "4px 0", fontSize: "14px", opacity: 0.8 }}>
                        ID interno: {selectedShelf.id}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px",
                            marginTop: "20px",
                        }}
                    >
                        <button
                            onClick={() => setSelectedShelf(null)}
                            style={{
                                padding: "8px 14px",
                                borderRadius: "8px",
                                background: "#e5e5e5",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 500,
                            }}
                        >
                            Cerrar
                        </button>

                        <button
                            onClick={() => {
                                setMarker({
                                    x:
                                        selectedShelf.x +
                                        selectedShelf.width / 2,
                                    y:
                                        selectedShelf.y +
                                        selectedShelf.height / 2,
                                    label: selectedShelf.id,
                                });
                                setSelectedShelf(null);
                            }}
                            style={{
                                padding: "8px 14px",
                                borderRadius: "8px",
                                background: "#1976d2",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >
                            Marcar estante
                        </button>
                    </div>
                </div>

                {/* Animación */}
                <style>
                    {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translate(-50%, -45%); }
                        to { opacity: 1; transform: translate(-50%, -50%); }
                    }
                `}
                </style>
            </>
        );
    };



    return {
        containerRef,
        stageRef,
        pulseRef,
        stageSize,
        scale,
        positionStage,
        hoverShelf,
        selectedShelf,
        searchError,
        marker,
        setHoverShelf,
        setSelectedShelf,
        centerOn,
        handleSearch,
        setMarker,
    };
}
