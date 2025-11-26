import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { InsumoContext } from "../../Context/InsumoContext";
import { ESTANTES, type Estante } from "./data"
import Marker from "./Marker";
import BusquedaInsumo from "./SearchInsumo";
import { EstantesRender } from "./MapaEstantes";
import { SectoresRender } from "./MapaSectores";
import ShelfModal from "./ShelfModal";

export type Props = {
    codigo: string;
    sector?: string;
    estante?: string;
    posicion?: string;
};

export default function MapaAlmacenPro({ codigo, estante, posicion, }: Props) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<any>(null);
    const [stageSize, setStageSize] = useState({ width: 600, height: 700 });
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hoverShelf, setHoverShelf] = useState<string | null>(null);
    const [selectedShelf, setSelectedShelf] = useState<Estante | null>(null);
    const { insumos } = useContext(InsumoContext)!;
    const [marker, setMarker] = useState<{ x: number; y: number; label: string } | null>(null);
    const mapWidth = 1100;
    const initialZoom = useMemo(() => stageSize.width / 1100, [stageSize.width]);


    const dragBound = useCallback((pos: { x: number; y: number; }) => {
        const stage = stageRef.current;
        if (!stage) return pos;
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
        }
    }, [scale]);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        // actualizar tamaño
        const updateSize = () => {
            if (!viewportRef.current) return;
            setStageSize({
                width: viewportRef.current.clientWidth,
                height: 600,
            });
        };

        updateSize();
        window.addEventListener("resize", updateSize);

        // inicializar escala
        const offsetX = 0;
        const offsetY = 0;
        stage.scale({ x: initialZoom, y: initialZoom });
        stage.position({ x: offsetX, y: offsetY });
        stage.batchDraw();
        setScale(initialZoom);
        setPosition({ x: offsetX, y: offsetY });

        return () => window.removeEventListener("resize", updateSize);
    }, [initialZoom]);

    useEffect(() => {
        if (!estante) return;          // si no vino desde la tabla → no hacer nada
        if (!codigo) return;
        const shelf = ESTANTES.find(s => s.id === estante);
        if (!shelf) return;
        let targetX = shelf.x + shelf.width / 2;
        let targetY = shelf.y + shelf.height / 2;
        setMarker({
            x: targetX,
            y: targetY,
            label: `${codigo} (${estante}-${posicion ?? ""})`
        });
    }, [codigo, estante, posicion]);

    return (
        <div
            ref={wrapperRef}
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
            <BusquedaInsumo
                insumos={insumos}
                estantes={ESTANTES}
                setMarker={setMarker}
            />
            <div
                ref={viewportRef}
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
                    dragBoundFunc={dragBound}
                    onDragEnd={(e) => {
                        setPosition({ x: e.target.x(), y: e.target.y() });
                    }}
                >
                    <Layer>
                        <SectoresRender stageRef={stageRef} />
                        <EstantesRender
                            hoverShelf={hoverShelf}
                            setHoverShelf={setHoverShelf}
                            stageRef={stageRef}
                            setMarker={setMarker}
                            setSelectedShelf={setSelectedShelf}
                            selectedShelf={selectedShelf}
                        />
                        {marker && <Marker marker={marker} />}
                    </Layer>
                </Stage>
            </div>
            <ShelfModal
                selectedShelf={selectedShelf}
                setSelectedShelf={setSelectedShelf}

            />
        </div>
    );
}
