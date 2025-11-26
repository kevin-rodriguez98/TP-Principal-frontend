import { Group, Rect, Text } from "react-konva";
import { SECTORES } from  "./data"; 
import { useMemo } from "react";

export function SectoresRender({ stageRef }: any) {
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
    }, []);

    return <>{sectoresRender}</>;
}
