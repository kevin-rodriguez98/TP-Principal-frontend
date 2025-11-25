import { Group, Rect, Text } from "react-konva";
import { ESTANTES, } from "./data";
import { useMemo, } from "react";


export function EstantesRender({ hoverShelf, setHoverShelf, stageRef, selectedShelf,setSelectedShelf }: any) {

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
                        }}
                        onMouseLeave={() => {
                            setHoverShelf(null);
                            const container = stageRef.current?.container();
                            if (container) container.style.cursor = "default";
                        }}
                        onClick={() => {
                            // Mostrar modal al hacer click
                            setSelectedShelf(sh);
                        }}
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
    }, [hoverShelf, selectedShelf]);

    return <>{estantesRender}</>;
}
