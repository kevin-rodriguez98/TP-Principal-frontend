import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Group, Label, Tag, Circle, } from "react-konva";
import { InsumoContext } from "../../Context/InsumoContext";
import { Autocomplete, TextField } from "@mui/material";
import Konva from "konva";
import { SECTORES, ESTANTES, type Estante } from "../../data/data"

export type Props = {
    codigo: string;
    sector?: string;
    estante?: string;
    posicion?: string;
};


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
    }, [marker]);

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


    const sectoresRender = useMemo(() => {
        return SECTORES.map((s) => (
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
                        const container = stageRef.current?.container();
                        if (container) container.style.cursor = "pointer";
                    }}
                    onMouseLeave={() => {
                        const container = stageRef.current?.container();
                        if (container) container.style.cursor = "default";
                    }}
                    onClick={() => {
                        const centerX = s.x + s.width / 2;
                        const centerY = s.y + s.height / 2;
                        centerOn(centerX, centerY, 1.6);
                    }}
                />
                <Text x={s.x + 10} y={s.y + 8} text={s.name} fontSize={16} fontStyle="bold" />
                <Text
                    x={s.x + 10}
                    y={s.y + 30}
                    text={s.id.includes("camara") ? "Requiere frío si aplica" : ""}
                    fontSize={12}
                />
            </Group>
        ));
    }, [centerOn]);


    const estantesRender = useMemo(() => {
        return ESTANTES.map((sh) => {
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
                            const container = stageRef.current?.container();
                            if (container) container.style.cursor = "pointer";

                            setTooltip({
                                x: sh.x + sh.width / 2,
                                y: sh.y - 8,
                                text: sh.id,
                            });
                        }}
                        onMouseLeave={() => {
                            setHoverShelf(null);
                            setTooltip(null);
                            const container = stageRef.current?.container();
                            if (container) container.style.cursor = "default";
                        }}
                        // onClick={() => handleShelfClick(sh)}
                    />

                    <Text
                        x={sh.x + 6}
                        y={sh.y + 4}
                        text={sh.id}
                        fontSize={12}
                        fill="#333"
                        fontStyle="bold"
                    />
                </Group>
            );
        });
    }, [hoverShelf, selectedShelf, {/*handleShelfClick*/}]);




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

            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "600px",
                    overflow: "auto",
                    border: "1px solid #ccc",
                    position: "relative",
                }}
            >

                <Stage
                    ref={stageRef}
                    width={stageSize.width}
                    height={stageSize.height}
                    draggable
                    x={position.x}
                    y={position.y}
                    scaleX={scale}
                    scaleY={scale}
                    // onWheel={handleWheel}
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
                        {sectoresRender}
                        {estantesRender}
                        {/* Dibujar sectores */}
                        {/* {SECTORES.map((s) => (
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
                        ))} */}

                        {/* Dibujar estantes (shelves) - clickeables */}
                        {/* {ESTANTES.map((sh) => {
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

                                    <Text x={sh.x + 6} y={sh.y + 4} text={sh.id} fontSize={12} fill="#333" fontStyle="bold" />
                                </Group>
                            );
                        })} */}


                        {marker && (
                            <Group>
                                {/* 🌟 Círculo principal */}
                                <Circle
                                    x={marker.x}
                                    y={marker.y}
                                    radius={10}
                                    fill="#ff3b3b"
                                    stroke="#ff9e9e"
                                    strokeWidth={3}
                                    shadowBlur={15}
                                    shadowColor="#ff4d4d"
                                    shadowOpacity={0.8}
                                />

                                {/* 🔵 Círculo animado tipo pulso */}
                                <Circle
                                    ref={pulseRef}
                                    x={marker.x}
                                    y={marker.y}
                                    radius={14}
                                    stroke="#ff3b3b"
                                    strokeWidth={2}
                                    opacity={0.6}
                                />

                                {/* 🏷 Label dark */}
                                <Group x={marker.x + 15} y={marker.y - 18}>
                                    <Rect
                                        width={marker.label.length * 8}
                                        height={24}
                                        fill="#1e1e1e"
                                        cornerRadius={6}
                                        shadowColor="black"
                                        shadowBlur={8}
                                        shadowOpacity={0.4}
                                    />
                                    <Text
                                        text={marker.label}
                                        fontSize={14}
                                        fontStyle="bold"
                                        padding={4}
                                        fill="#ffffff"
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
            </div>
            {/* Modal simple para estante */}
            {renderModal()}
        </div>
    );
}
