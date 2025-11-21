import React, { useMemo, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, CircularProgress, Typography, } from "@mui/material";
import SinResultados from "../../estaticos/SinResultados";
import { TiempoProduccionContext, type TiempoProduccionGeneral } from "../../../Context/TiempoProduccionContext";

const ESTILOS_CABECERA = { style: { color: "#15a017ff" } };

const TiempoProduccion: React.FC = () => {
    const { tiempos, error, isLoading } = useContext(TiempoProduccionContext)!;

    const columns = useMemo<MRT_ColumnDef<TiempoProduccionGeneral>[]>(
        () => [
            {
                accessorKey: "codigo",
                header: "Código",
                size: 90,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                Cell: ({ row }) => row.original.codigo || "—",
            },
            {
                accessorKey: "tiempoPreparacion",
                header: "Tiempo Preparacion",
                muiTableHeadCellProps: ESTILOS_CABECERA,
                Cell: ({ row }) => row.original.tiempoPreparacion || "—",
            },
            {
                accessorKey: "tiempoCiclo",
                header: "Ciclo",
                muiTableHeadCellProps: ESTILOS_CABECERA,
                Cell: ({ row }) => row.original.tiempoCiclo || "—",
            },
            {
                accessorKey: "cantidaTanda",
                header: "Máxima tanda",
                muiTableHeadCellProps: ESTILOS_CABECERA,
                Cell: ({ row }) => row.original.cantidaTanda || "—",
            },
        ],
        []
    );



    const tabla = useMaterialReactTable({
        columns,
        data: tiempos,
        enableColumnResizing: true,
        columnResizeMode: 'onEnd',
        createDisplayMode: "modal",
        defaultColumn: {
            minSize: 80,
            maxSize: 900,
            size: 110,
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
                        Tiempos de producción
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

export default TiempoProduccion;
