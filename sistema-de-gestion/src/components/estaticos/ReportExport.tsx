import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from "framer-motion";

import {
    PictureAsPdf,
    Image,
    TableChart,
    Download,
    ArrowBack,   // <-- AGREGADO
} from "@mui/icons-material";

interface Props {
    filename: string;
    exportId: string;
    csvData?: any[];
}

const ReportExport = ({ filename, exportId, csvData }: Props) => {
    const [hover, setHover] = useState<string | null>(null);

    const exportPDF = async () => {
        const element = document.getElementById(exportId);
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`${filename}.pdf`);
    };

    const exportPNG = async () => {
        const element = document.getElementById(exportId);
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const data = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = data;
        link.download = `${filename}.png`;
        link.click();
    };

    const exportCSV = () => {
        if (!csvData || csvData.length === 0) return;

        const keys = Object.keys(csvData[0]);
        const csvRows = [
            keys.join(","),
            ...csvData.map((row) =>
                keys.map((k) => JSON.stringify(row[k] ?? "")).join(",")
            ),
        ];

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
    };

    const NavButton = ({
        onClick,
        children,
        label,
    }: {
        onClick: () => void;
        children: React.ReactNode;
        label: string;
    }) => (
        <motion.button
            onClick={onClick}
            onMouseEnter={() => setHover(label)}
            onMouseLeave={() => setHover(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "10px 15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#fff",
            }}
        >
            {children}

            {hover === label && (
                <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{
                        fontSize: "12px",
                        marginTop: "4px",
                    }}
                >
                    {label}
                </motion.span>
            )}
        </motion.button>
    );

    return (
        <>
            <div style={{ paddingTop: "80px" }}>
                <nav
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "40px",
                        background: "#1f1f1f",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                        zIndex: 9999,
                        paddingInline: "20px",
                    }}
                >
                    {/* ------------------------ */}
                    {/* 🚀 BOTÓN ATRÁS AGREGADO */}
                    {/* ------------------------ */}
                    <div style={{ position: "absolute", left: "20px" }}>
                        <NavButton
                            onClick={() => window.history.back()}
                            label="Volver"
                        >
                            <ArrowBack style={{ color: "#fff", fontSize: "28px" }} />
                        </NavButton>
                    </div>

                    {/* Botones centrales */}
                    <NavButton onClick={exportPDF} label="Exportar PDF">
                        <PictureAsPdf style={{ color: "#e74c3c", fontSize: "28px" }} />
                    </NavButton>

                    <NavButton onClick={exportPNG} label="Exportar PNG">
                        <Image style={{ color: "#2ecc71", fontSize: "28px" }} />
                    </NavButton>

                    {csvData && (
                        <NavButton onClick={exportCSV} label="Exportar CSV">
                            <TableChart style={{ color: "#f1c40f", fontSize: "28px" }} />
                        </NavButton>
                    )}

                    <Download
                        style={{
                            position: "absolute",
                            right: "25px",
                            color: "#3498db",
                            fontSize: "30px",
                        }}
                        titleAccess="Opciones de exportación"
                    />
                </nav>
            </div>
        </>
    );
};

export default ReportExport;
