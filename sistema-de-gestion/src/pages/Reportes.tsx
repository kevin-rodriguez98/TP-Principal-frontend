
import { useContext } from 'react';
import { OrdenesContext } from '../Context/OrdenesContext';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Reportes = () => {


    const {ordenes } = useContext(OrdenesContext)!;
    return (
        <div>
            <div style={{ width: "100%", height: 300, background: "#1e1e1e", borderRadius: 10, padding: 10 }}>
                <h3 style={{ color: "#15a017ff" }}>Producción Mensual</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={ordenes}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="mes" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Legend />
                        <Line type="monotone" dataKey="produccion" stroke="#15a017ff" strokeWidth={2} />
                        <Line type="monotone" dataKey="errores" stroke="#f44336" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Reportes
