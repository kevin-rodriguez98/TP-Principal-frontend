import React, { useMemo, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, CircularProgress, Typography, } from "@mui/material";
import { InsumoContext, type Insumo } from "../../../Context/InsumoContext";
import { FaExclamationTriangle } from "react-icons/fa";
import SinResultados from "../../estaticos/SinResultados";

const InsumosBajoStock: React.FC = () => {
    const { insumos_bajo_stock, isLoading, error } = useContext(InsumoContext)!;

    const columns = useMemo<MRT_ColumnDef<Insumo>[]>(
        () => [
            {
                accessorKey: "codigo",
                header: "Código",
                size: 90,
                muiTableHeadCellProps: {style: { color: "#15a017ff" } },
            },
            {
                accessorKey: "nombre",
                header: "Nombre",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
            },
            {
                accessorKey: "categoria",
                header: "Categoría",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
            },
            {
                accessorKey: "marca",
                header: "Marca",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
            },
            {
                accessorKey: "unidad",
                header: "Unidad",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
            },
            {
                accessorKey: "stock",
                header: "Stock",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    type: "number",
                },
                Cell: ({ row }) => {
                    const stock = row.original.stock;
                    const umbral = row.original.umbralMinimoStock;
                    const isLow = stock < umbral;
                    return (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Typography sx={{ color: isLow ? "red" : "inherit" }}>{stock}</Typography>
                            {isLow && (
                                <FaExclamationTriangle color="red" title="debajo del umbral" />
                            )}
                        </Box>
                    );
                },
            },
            {
                accessorKey: "umbralMinimoStock",
                header: "Umbral mínimo",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    type: "number",
                },
            },
        ],
        []
    );



    const tabla = useMaterialReactTable({
        columns,
        data: insumos_bajo_stock,
        enableColumnResizing: true,
        columnResizeMode: 'onEnd',
        createDisplayMode: "modal",
        defaultColumn: {
            minSize: 80, //allow columns to get smaller than default
            maxSize: 900, //allow columns to get larger than default
            size: 110, //make columns wider by default
            grow: 1,
            enableResizing: true,
        },
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            },
            density: 'compact',
        },
        muiTableContainerProps: {
            className: "tabla-container",
        },
        muiTableBodyCellProps: {
            className: "tabla-body-cell",
        },
        muiTableHeadCellProps: {
            className: "tabla-head-cell",
        },
        muiTablePaperProps: {
            className: "tabla-paper",
        },
        muiTableProps: {
            className: "tabla",
        },

        getRowId: (row) => row.codigo,

        renderTopToolbarCustomActions: ({ }) => (
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    width: '100%',
                    gap: 2,
                }}
            >
                <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
                    <Typography variant="h5" color="primary" className="titulo-lista-insumos">
                        Insumos con bajo stock
                    </Typography>

                </Box>
            </Box>
        ),
        renderEmptyRowsFallback: () => {
            if (error) {
                return <SinResultados mensaje="El servidor no está disponible. Intenta más tarde." />;
            }
            return <SinResultados mensaje="No hay insumos disponibles para mostrar." />;
        },
        state: {
            isLoading,
        },
    },
    );

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MaterialReactTable table={tabla} />
    );
};

export default InsumosBajoStock;
