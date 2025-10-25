import React, { useState } from "react";
import "../styles/AccordionRecetas.css";

interface Ingrediente {
    nombre: string;
    cantidad: string;
}

interface Receta {
    id: number;
    nombre: string;
    descripcion: string;
    ingredientes: Ingrediente[];
}

const recetasEjemplo: Receta[] = [
    {
        id: 1,
        nombre: "🍰 Bizcochuelo de vainilla",
        descripcion: "Un clásico esponjoso ideal para tortas y postres.",
        ingredientes: [
            { nombre: "Harina 0000", cantidad: "250 g" },
            { nombre: "Huevos", cantidad: "3 unidades" },
            { nombre: "Azúcar", cantidad: "200 g" },
            { nombre: "Leche", cantidad: "150 ml" },
            { nombre: "Esencia de vainilla", cantidad: "1 cda" }
        ]
    },
    {
        id: 2,
        nombre: "🍫 Brownie clásico",
        descripcion: "Con mucho chocolate y una textura húmeda irresistible.",
        ingredientes: [
            { nombre: "Chocolate", cantidad: "200 g" },
            { nombre: "Manteca", cantidad: "150 g" },
            { nombre: "Huevos", cantidad: "3 unidades" },
            { nombre: "Azúcar", cantidad: "250 g" },
            { nombre: "Harina 0000", cantidad: "80 g" }
        ]
    },
    {
        id: 3,
        nombre: "🍓 Tarta de frutilla",
        descripcion: "Fresca, liviana y perfecta para el verano.",
        ingredientes: [
            { nombre: "Masa sable", cantidad: "1 disco" },
            { nombre: "Crema pastelera", cantidad: "300 g" },
            { nombre: "Frutillas frescas", cantidad: "250 g" }
        ]
    }
];

const AccordionRecetas: React.FC = () => {
    const [activo, setActivo] = useState<number | null>(null);

    const toggle = (id: number) => {
        setActivo(activo === id ? null : id);
    };

    return (
        <div className="accordion-container">
            <h2 className="accordion-title">📖 Recetario de Insumos</h2>
            {recetasEjemplo.map((receta) => (
                <div key={receta.id} className={`accordion-item ${activo === receta.id ? "activo" : ""}`}>
                    <button className="accordion-header" onClick={() => toggle(receta.id)}>
                        <span>{receta.nombre}</span>
                        <span className="arrow">{activo === receta.id ? "▲" : "▼"}</span>
                    </button>

                    <div className={`accordion-body ${activo === receta.id ? "activo" : ""}`}>
                        <p className="descripcion">{receta.descripcion}</p>
                        <table className="tabla-ingredientes">
                            <thead>
                                <tr>
                                    <th>Ingrediente</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receta.ingredientes.map((ing, i) => (
                                    <tr key={i}>
                                        <td>🍪 {ing.nombre}</td>
                                        <td>{ing.cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AccordionRecetas;
