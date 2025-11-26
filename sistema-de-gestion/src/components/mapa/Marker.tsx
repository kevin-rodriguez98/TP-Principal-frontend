import { Circle, Group, Rect, Text } from "react-konva";
import { useEffect, useRef } from "react";
import Konva from "konva";

export default function Marker({ marker, small }: any) {
    const pulseRef = useRef(null);
    const markerCircleRef = useRef<Konva.Circle>(null);

useEffect(() => {
    const node = markerCircleRef.current;
    if (!node) return;

    const layer = node.getLayer();
    if (!layer) return;

    const anim = new Konva.Animation((frame) => {
        if (!frame) return;

        const scale = 1 + Math.sin(frame.time / 300) * 0.25; // suave pulso
        node.scale({ x: scale, y: scale });
    }, layer);

    anim.start();

    return () => {
        anim.stop();     // cleanup válido
        node.scale({ x: 1, y: 1 }); // vuelve al tamaño normal
    };
}, [marker]);



    return (
        <Group>
            {/* pulso */}
            <Circle
                ref={pulseRef}
                x={marker.x}
                y={marker.y}
                radius={small ? 10 : 20}
                stroke="#ff5555"
                strokeWidth={2}
                opacity={0.4}
            />

            {/* punto central */}
<Circle
    ref={markerCircleRef}
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

            {/* etiqueta */}
            {marker.label && (
                <Group x={marker.x + 15} y={marker.y - 18}>
                    <Rect
                        width={marker.label.length * 7.5}
                        height={22}
                        fill="#222"
                        stroke="#555"
                        cornerRadius={6}
                        shadowBlur={6}
                    />
                    <Text
                        text={marker.label}
                        fontSize={14}
                        padding={4}
                        fill="white"
                    />
                </Group>
            )}
        </Group>
    );
}
