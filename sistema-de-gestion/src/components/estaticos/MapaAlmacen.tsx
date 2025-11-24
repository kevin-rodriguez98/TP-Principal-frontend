import { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Group, Label, Tag, Circle, } from "react-konva";
import { InsumoContext } from "../../Context/InsumoContext";
import { Autocomplete, TextField } from "@mui/material";


type Props = {
    codigo: string;
    sector?: string;
    estante?: string;
    posicion?: string;
};

export interface Posiciones {
    [key: string]: { x: number; y: number };
}
export interface Estante {
    id: string;
    sectorId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    posiciones: Posiciones;
}

type Sector = {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
};

export const SECTORES: Sector[] = [
    { id: "recepcion", name: "Recepción", x: 20, y: 20, width: 350, height: 150, color: "#FFE9C6" },
    { id: "camara-mp", name: "Cámara Insumos (Frío)", x: 400, y: 20, width: 300, height: 150, color: "#CFEFFF" },
    { id: "camara-pt", name: "Cámara Prod. Terminados", x: 740, y: 20, width: 300, height: 150, color: "#D8F5D8" },
    { id: "packaging", name: "Depósito Packaging", x: 20, y: 200, width: 350, height: 220, color: "#F3DCFF" },
    { id: "insumos-secos", name: "Depósito Insumos Secos", x: 400, y: 200, width: 640, height: 220, color: "#FFF9CC" },
    { id: "despacho", name: "Área Despacho", x: 20, y: 440, width: 1020, height: 150, color: "#FFD6D6" },
];

export const ESTANTES: Estante[] = [
    // ===================== RECEPCIÓN MP =====================
    {
        id: "rec-1",
        sectorId: "recepcion",
        x: 40,
        y: 60,
        width: 140,
        height: 60,
        posiciones: {
            A1: { x: 20, y: 20 },
            A2: { x: 60, y: 20 },
            A3: { x: 100, y: 20 },
        },
    },
    {
        id: "rec-2",
        sectorId: "recepcion",
        x: 200,
        y: 60,
        width: 140,
        height: 60,
        posiciones: {
            A1: { x: 20, y: 20 },
            A2: { x: 60, y: 20 },
            A3: { x: 100, y: 20 },
        },
    },

    // ===================== CÁMARA MP (FRÍO) =====================
    {
        id: "cm-1",
        sectorId: "camara-mp",
        x: 420,
        y: 70,
        width: 120,
        height: 60,
        posiciones: {
            B1: { x: 20, y: 20 },
            B2: { x: 60, y: 20 },
        },
    },
    {
        id: "cm-2",
        sectorId: "camara-mp",
        x: 560,
        y: 70,
        width: 120,
        height: 60,
        posiciones: {
            B1: { x: 20, y: 20 },
            B2: { x: 60, y: 20 },
        },
    },

    // ===================== CÁMARA PRODUCTOS TERMINADOS =====================
    {
        id: "p-1",
        sectorId: "camara-pt",
        x: 760,
        y: 70,
        width: 120,
        height: 60,
        posiciones: {
            C1: { x: 20, y: 20 },
            C2: { x: 60, y: 20 },
        },
    },
    {
        id: "p-2",
        sectorId: "camara-pt",
        x: 900,
        y: 70,
        width: 120,
        height: 60,
        posiciones: {
            C1: { x: 20, y: 20 },
            C2: { x: 60, y: 20 },
        },
    },

    // ===================== DEPÓSITO PACKAGING =====================
    {
        id: "pack-1",
        sectorId: "packaging",
        x: 40,
        y: 240,
        width: 140,
        height: 70,
        posiciones: {
            D1: { x: 20, y: 20 },
            D2: { x: 60, y: 20 },
            D3: { x: 100, y: 20 },
        },
    },
    {
        id: "pack-2",
        sectorId: "packaging",
        x: 200,
        y: 240,
        width: 140,
        height: 70,
        posiciones: {
            D1: { x: 20, y: 20 },
            D2: { x: 60, y: 20 },
            D3: { x: 100, y: 20 },
        },
    },
    {
        id: "pack-3",
        sectorId: "packaging",
        x: 40,
        y: 330,
        width: 140,
        height: 70,
        posiciones: {
            D4: { x: 20, y: 20 },
            D5: { x: 60, y: 20 },
            D6: { x: 100, y: 20 },
        },
    },
    {
        id: "pack-4",
        sectorId: "packaging",
        x: 200,
        y: 330,
        width: 140,
        height: 70,
        posiciones: {
            D4: { x: 20, y: 20 },
            D5: { x: 60, y: 20 },
            D6: { x: 100, y: 20 },
        },
    },

    // ===================== INSUMOS SECOS =====================
    {
        id: "ins-1",
        sectorId: "insumos-secos",
        x: 420,
        y: 240,
        width: 160,
        height: 70,
        posiciones: {
            E1: { x: 20, y: 20 },
            E2: { x: 60, y: 20 },
            E3: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-2",
        sectorId: "insumos-secos",
        x: 600,
        y: 240,
        width: 160,
        height: 70,
        posiciones: {
            E1: { x: 20, y: 20 },
            E2: { x: 60, y: 20 },
            E3: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-3",
        sectorId: "insumos-secos",
        x: 780,
        y: 240,
        width: 160,
        height: 70,
        posiciones: {
            E1: { x: 20, y: 20 },
            E2: { x: 60, y: 20 },
            E3: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-4",
        sectorId: "insumos-secos",
        x: 420,
        y: 330,
        width: 160,
        height: 70,
        posiciones: {
            E4: { x: 20, y: 20 },
            E5: { x: 60, y: 20 },
            E6: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-5",
        sectorId: "insumos-secos",
        x: 600,
        y: 330,
        width: 160,
        height: 70,
        posiciones: {
            E4: { x: 20, y: 20 },
            E5: { x: 60, y: 20 },
            E6: { x: 100, y: 20 },
        },
    },
    {
        id: "ins-6",
        sectorId: "insumos-secos",
        x: 780,
        y: 330,
        width: 160,
        height: 70,
        posiciones: {
            E4: { x: 20, y: 20 },
            E5: { x: 60, y: 20 },
            E6: { x: 100, y: 20 },
        },
    },

    // ===================== DESPACHO =====================
    {
        id: "desp-1",
        sectorId: "despacho",
        x: 40,
        y: 480,
        width: 200,
        height: 90,
        posiciones: {
            F1: { x: 30, y: 30 },
            F2: { x: 90, y: 30 },
            F3: { x: 150, y: 30 },
        },
    },
    {
        id: "desp-2",
        sectorId: "despacho",
        x: 260,
        y: 480,
        width: 200,
        height: 90,
        posiciones: {
            F1: { x: 30, y: 30 },
            F2: { x: 90, y: 30 },
            F3: { x: 150, y: 30 },
        },
    },
    {
        id: "desp-3",
        sectorId: "despacho",
        x: 480,
        y: 480,
        width: 200,
        height: 90,
        posiciones: {
            F1: { x: 30, y: 30 },
            F2: { x: 90, y: 30 },
            F3: { x: 150, y: 30 },
        },
    },
    {
        id: "desp-4",
        sectorId: "despacho",
        x: 700,
        y: 480,
        width: 200,
        height: 90,
        posiciones: {
            F1: { x: 30, y: 30 },
            F2: { x: 90, y: 30 },
            F3: { x: 150, y: 30 },
        },
    },
];


export default function MapaAlmacenPro({ codigo, estante, posicion, }: Props) {
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
    // const searchRef = useRef<HTMLInputElement | null>(null);


    // Ajustar zoom inicial para mostrar todo el mapa dentro del Stage
    useEffect(() => {
        if (!stageRef.current) return;

        const stage = stageRef.current;

        const containerW = stageSize.width;
        const containerH = stageSize.height;

        // Tamaño real del mapa (rectángulo externo que dibujaste)
        const mapWidth = 1100;
        const mapHeight = 680;

        // Escala mínima para que el mapa completo entre
        const scaleFit = Math.min(containerW / mapWidth, containerH / mapHeight);

        // Centrar el mapa
        const offsetX = (containerW - mapWidth * scaleFit) / 2;
        const offsetY = 0;

        setScale(scaleFit);
        setPosition({ x: offsetX, y: offsetY });

        // Aplicar a Konva stage
        stage.scale({ x: scaleFit, y: scaleFit });
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
        centerOn(targetX, targetY, 2.2);

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

    const centerOn = (x: number, y: number, zoom = 1.8) => {
        const stage = stageRef.current;
        if (!stage) return;

        const containerW = stage.width();
        const containerH = stage.height();

        const newScale = zoom;
        // calcular nueva posición para que (x,y) quede en el centro del contenedor
        const newX = -x * newScale + containerW / 2;
        const newY = -y * newScale + containerH / 2;

        setScale(newScale);
        setPosition({ x: newX, y: newY });

        // aplicar directamente al stage
        stage.scale({ x: newScale, y: newScale });
        stage.position({ x: newX, y: newY });
        stage.batchDraw();
    };

    // Manejo de rueda (zoom centrado en el puntero)
    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const scaleBy = 1.05;

        // Calcular nuevo scale
        let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        // 🔒 límites del zoom
        const MIN_SCALE = 0.8;   // no permite achicar más que esto
        const MAX_SCALE = 3;     // opcional

        if (newScale < MIN_SCALE) newScale = MIN_SCALE;
        if (newScale > MAX_SCALE) newScale = MAX_SCALE;

        // zoom centrado en el puntero
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        stage.scale({ x: newScale, y: newScale });
        stage.position(newPos);
        stage.batchDraw();

        setScale(newScale);
        setPosition(newPos);
    };


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
    const handleShelfClick = (shelf: Estante) => {
        // position del mouse para tooltip (convertir a stage coords)
        const stage = stageRef.current;
        if (!stage) return;

        const pointer = stage.getPointerPosition();
        setSelectedShelf(shelf);
        setTooltip({ x: pointer ? pointer.x : shelf.x, y: pointer ? pointer.y : shelf.y, text: shelf.id });
    };

    // render del popup/modal simple
    const renderModal = () => {
        if (!selectedShelf) return null;
        return (
            <div
                style={{
                    position: "fixed",
                    top: "18%",
                    left: "50%",
                    transform: "translate(-50%, 0)",
                    width: 340,
                    background: "#fff",
                    borderRadius: 10,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                    padding: 16,
                    zIndex: 9999,
                }}
            >
                <h3 style={{ margin: 0 }}>{`Estante ${selectedShelf.id}`}</h3>
                <p style={{ marginTop: 8 }}>
                    Sector: <strong>{selectedShelf.sectorId}</strong>
                </p>
                <p style={{ marginTop: 8 }}>ID interno: {selectedShelf.id}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={() => setSelectedShelf(null)} style={{ padding: "8px 12px" }}>
                        Cerrar
                    </button>
                    <button
                        onClick={() => {
                            // ejemplo: marcar producto simulado
                            setMarker({
                                x: selectedShelf.x + selectedShelf.width / 2,
                                y: selectedShelf.y + selectedShelf.height / 2,
                                label: selectedShelf.id,
                            });
                            setSelectedShelf(null);
                        }}
                        style={{ padding: "8px 12px" }}
                    >
                        Marcar estante
                    </button>
                </div>
            </div>
        );
    };

    // dibujar pasillos (aisles) - ejemplo simple: líneas o rects entre racks
    // const renderAisles = () => {
    //     // para este ejemplo, colocamos 3 pasillos verticales dentro del área de insumos secos
    //     const aX = [SECTORES[4].x + 150, SECTORES[4].x + 350, SECTORES[4].x + 550];
    //     return aX.map((ax, i) => (
    //         <Rect
    //             key={`aisle-${i}`}
    //             x={ax}
    //             y={SECTORES[4].y + 10}
    //             width={20}
    //             height={SECTORES[4].height - 20}
    //             fill={"#ffffff"}
    //             opacity={0.6}
    //             stroke={"#e0e0e0"}
    //         />
    //     ));
    // };

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                overflow: "hidden",
                padding: "10px",
            }}
        >
            {/* Controls: buscador simple */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginBottom: 10,
                }}
            >
                <div style={{ display: "flex", gap: 8 }}>
                    <Autocomplete
                        options={insumos}
                        getOptionLabel={(option) => `${option.codigo} - ${option.nombre} - ${option.marca} - ${option.categoria}`}
                        onChange={(_event, value) => {
                            if (!value) return;
                            handleSearch(value.codigo);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar insumo"
                                placeholder="Código, nombre, marca..."
                                size="small"
                                sx={{
                                    mb: 1.5,
                                    borderRadius: 2,

                                    // fondo campo
                                    "& .MuiInputBase-root": {
                                        backgroundColor: "#0e1217",
                                        color: "white",
                                    },

                                    // label
                                    "& .MuiInputLabel-root": {
                                        color: "#bbbbbb",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#ffffff",
                                    },

                                    // placeholder
                                    "& .MuiInputBase-input::placeholder": {
                                        color: "#cccccc",
                                        opacity: 1,
                                    },

                                    // borde
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#555",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#888",
                                    },
                                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#00bcd4",
                                    },
                                }}
                            />
                        )}
                        sx={{
                            width: "100%",

                            // estilo del dropdown
                            "& .MuiAutocomplete-paper": {
                                backgroundColor: "#0e1217 ",
                                color: "white",
                            },

                            // estilo de cada ítem
                            "& .MuiAutocomplete-option": {
                                backgroundColor: "#0e1217 ",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "#111827",
                                },
                                "&.Mui-focused": {
                                    backgroundColor: "#1a2131ff",
                                },
                                "&.Mui-selected": {
                                    backgroundColor: "#0a070eff",
                                },
                                "&.Mui-selected:hover": {
                                    backgroundColor: "#0f0227ff ",
                                },
                            },
                        }}
                    />



                </div>

                {searchError && (
                    <div style={{ color: "red", fontSize: "14px" }}>
                        {searchError}
                    </div>
                )}
            </div>

            <Stage
                ref={stageRef}
                width={stageSize.width}
                height={stageSize.height}
                draggable
                x={position.x}
                y={position.y}
                scaleX={scale}
                scaleY={scale}
                onWheel={handleWheel}
                dragBoundFunc={(pos) => {
                    const stage = stageRef.current;
                    if (!stage) return pos;

                    const mapWidth = 1100;  // tu tamaño de mapa real
                    const mapHeight = 680;

                    const scaledW = mapWidth * stage.scaleX();
                    const scaledH = mapHeight * stage.scaleY();

                    const containerW = stage.width();
                    const containerH = stage.height();

                    // límites para que no "escape"
                    const minX = containerW - scaledW;
                    const minY = containerH - scaledH;
                    const maxX = 0;
                    const maxY = 0;

                    return {
                        x: Math.min(maxX, Math.max(minX, pos.x)),
                        y: Math.min(maxY, Math.max(minY, pos.y)),
                    };
                }}
                onDragEnd={(e) => {
                    setPosition({ x: e.target.x(), y: e.target.y() });
                }}
            // style={{ border: "1px solid #ddd", borderRadius: 8, background: "transparent" }}
            >
                <Layer>
                    {/* Outer wall */}
                    {/* <Rect x={10} y={10} width={1100} height={680} stroke="#222" strokeWidth={6} cornerRadius={6} /> */}

                    {/* Dibujar sectores */}
                    {SECTORES.map((s) => (
                        <Group key={s.id}>
                            <Rect
                                x={s.x}
                                y={s.y}
                                width={s.width}
                                height={s.height}
                                fill={s.color}
                                stroke="#999"
                                strokeWidth={2}
                                cornerRadius={8}
                                shadowColor="#000"
                                shadowBlur={8}
                                onMouseEnter={() => {
                                    // opcional: cambiar cursor
                                    const container = stageRef.current?.container();
                                    if (container) container.style.cursor = "pointer";
                                }}
                                onMouseLeave={() => {
                                    const container = stageRef.current?.container();
                                    if (container) container.style.cursor = "default";
                                }}
                                onClick={() => {
                                    // centrar en sector
                                    const centerX = s.x + s.width / 2;
                                    const centerY = s.y + s.height / 2;
                                    centerOn(centerX, centerY, 1.6);
                                }}
                            />
                            <Text x={s.x + 10} y={s.y + 8} text={s.name} fontSize={16} fontStyle="bold" />
                            <Text x={s.x + 10} y={s.y + 30} text={s.id.includes("camara") ? "Requiere frio si aplica" : ""} fontSize={12} />
                        </Group>
                    ))}

                    {/* Aisles */}
                    {/* {renderAisles()} */}

                    {/* Dibujar estantes (shelves) - clickeables */}
                    {ESTANTES.map((sh) => {
                        const isHover = hoverShelf === sh.id;
                        const isSelected = selectedShelf?.id === sh.id;
                        return (
                            <Group key={sh.id}>
                                <Rect
                                    x={sh.x}
                                    y={sh.y}
                                    width={sh.width}
                                    height={sh.height}
                                    fill={isSelected ? "#ffeb3b" : isHover ? "#90caf9" : "#e0e0e0"}
                                    stroke={isSelected ? "#f57f17" : "#666"}
                                    strokeWidth={isHover ? 3 : 2}
                                    cornerRadius={4}
                                    shadowBlur={isHover ? 10 : 4}
                                    onMouseEnter={() => {
                                        setHoverShelf(sh.id);
                                        const stage = stageRef.current;
                                        const container = stage?.container();
                                        if (container) container.style.cursor = "pointer";
                                        // tooltip near shelf (stage coordinates)
                                        setTooltip({ x: sh.x + sh.width / 2, y: sh.y - 8, text: sh.id });
                                    }}
                                    onMouseLeave={() => {
                                        setHoverShelf(null);
                                        setTooltip(null);
                                        const stage = stageRef.current;
                                        const container = stage?.container();
                                        if (container) container.style.cursor = "default";
                                    }}
                                    onClick={() => handleShelfClick(sh)}
                                />

                                {/* etiqueta con número de estante */}
                                <Text x={sh.x + 6} y={sh.y + 4} text={sh.id} fontSize={12} fill="#333" fontStyle="bold" />
                            </Group>
                        );
                    })}

                    {/* Marker del insumo buscado */}
                    {marker && (
                        <Group>

                            {/* 🔵 Círculo principal */}
                            <Circle
                                x={marker.x}
                                y={marker.y}
                                radius={12}
                                fill="#ff4444"
                                stroke="#b30000"
                                strokeWidth={3}
                                shadowColor="black"
                                shadowBlur={10}
                                shadowOpacity={0.4}
                            />

                            {/* ✨ Círculo de "pulso" */}
                            <Circle
                                x={marker.x}
                                y={marker.y}
                                radius={20}
                                fill="transparent"
                                stroke="#ff4444"
                                strokeWidth={2}
                                opacity={0.5}
                                listening={false}
                            />

                            {/* 🏷️ Label con fondo */}
                            <Group x={marker.x + 15} y={marker.y - 18}>
                                <Rect
                                    width={marker.label.length * 7.5}
                                    height={22}
                                    fill="white"
                                    cornerRadius={6}
                                    shadowColor="black"
                                    shadowBlur={5}
                                    shadowOpacity={0.3}
                                />
                                <Text
                                    text={marker.label}
                                    fontSize={14}
                                    fontStyle="bold"
                                    padding={4}
                                    fill="#333"
                                />
                            </Group>

                        </Group>
                    )}




                    {/* Tooltip simple */}
                    {tooltip && (
                        <Group x={tooltip.x} y={tooltip.y - 20}>
                            <Label>
                                <Tag fill="black" opacity={0.8} cornerRadius={6} />
                                <Text text={tooltip.text} fill="white" padding={6} />
                            </Label>
                        </Group>
                    )}
                </Layer>
            </Stage>

            {/* Modal simple para estante */}
            {renderModal()}
        </div>
    );
}
