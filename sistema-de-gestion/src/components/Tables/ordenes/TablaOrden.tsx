import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography, } from "@mui/material";
import { OrdenesContext, type OrdenProduccion } from "../../../Context/OrdenesContext";
import SinResultados from "../../SinResultados";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const TablaInsumos: React.FC = () => {
    const { ordenes, isLoading, error, handleAddOrden, marcarEnProduccion, finalizarOrden, cancelarOrden, calcularTiempoEstimado } = useContext(OrdenesContext)!;
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const navigate = useNavigate();

    const columns = useMemo<MRT_ColumnDef<OrdenProduccion>[]>(
        () => [

            {
                accessorKey: "id",
                header: "ID",
                enableEditing: false,
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    error: !!validationErrors.id,
                    helperText: validationErrors.id ? (
                        <span style={{ color: "red" }}>{validationErrors.id}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, id: undefined }),
                },
            },
            {
                accessorKey: "codigoProducto",
                header: "Codigo",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.codigoProducto,
                    helperText: validationErrors.codigoProducto ? (
                        <span style={{ color: "red" }}>{validationErrors.codigoProducto}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, codigoProducto: undefined }),
                },
            },
            {
                accessorKey: "productoRequerido",
                header: "Producto",
                enableEditing: (row) => row.original.productoRequerido === "",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.productoRequerido,
                    helperText: validationErrors.productoRequerido ? (
                        <span style={{ color: "red" }}>{validationErrors.productoRequerido}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, productoRequerido: undefined }),
                },
            },
            {
                accessorKey: "marca",
                header: "Marca",
                enableEditing: (row) => row.original.marca === "",
                editVariant: "select",
                editSelectOptions: ["La Serenísima", "Sancor", "Milkaut", "La Paulina", "Yogurísimo", "Ilolay"],
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.marca,
                    helperText: validationErrors.marca ? (
                        <span style={{ color: "red" }}>{validationErrors.marca}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, marca: undefined }),
                },
            },
            {
                accessorKey: "estado",
                header: "Estado",
                // enableEditing: false,
                editVariant: "select",
                editSelectOptions: ["CANCELADA", "EN_PRODUCCION" , "FINALIZADA_ENTREGADA", "EVALUACION"],
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                Cell: ({ cell }) => {
                    const estado = String(cell.getValue() ?? "");
                    const bg =
                        estado === "CANCELADA"
                            ? "red"
                            : estado === "EN_PRODUCCION"
                                ? "gold"
                                : estado === "FINALIZADA_ENTREGADA"
                                    ? "green"
                                    : estado === "EVALUACION"
                                        ? "dodgerblue"
                                        : "gray";

                    return (
                        <span
                            style={{
                                backgroundColor: bg,
                                color: bg === "gold" ? "black" : "white", // texto oscuro para gold
                                borderRadius: 12,
                                padding: "4px 8px",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                textTransform: "uppercase",
                                display: "inline-block",
                            }}
                        >
                            {estado.replaceAll ? estado.replaceAll("_", " ") : estado.split("_").join(" ")}
                        </span>
                    );
                },
            },
            {
                accessorKey: "stockRequerido",
                header: "Stock requerido",
                muiEditTextFieldProps: {
                    type: "number",
                    required: true,
                    error: !!validationErrors.stockRequerido,
                    helperText: validationErrors.stockRequerido ? (
                        <span style={{ color: "red" }}>{validationErrors.stockRequerido}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, stockRequerido: undefined }),
                },
            },
            {
                accessorKey: "lote",
                header: "Lote",
                // enableEditing: false,
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
            },
            {
                accessorKey: "fechaEntrega",
                header: "Fecha de entrega",
                muiEditTextFieldProps: {
                    required: true,
                    type: "date",
                    InputLabelProps: { shrink: true },
                    error: !!validationErrors.fechaEntrega,
                    helperText: validationErrors.fechaEntrega ? (
                        <span style={{ color: "red" }}>{validationErrors.fechaEntrega}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, fechaEntrega: undefined }),
                },
            },
            {
                accessorKey: "tiempoEstimadoHoras",
                header: "Tiempo Estimado (hrs)",
                enableEditing: false,
                Cell: ({ cell }) => {
                    const value = cell.getValue<number>();
                    return value !== undefined ? value.toFixed(1) : "-";
                },
            },
        ],
        [validationErrors]
    );

    const validarCamposInsumo = (orden: Partial<OrdenProduccion>) => {
        const errores: Record<string, string> = {};

        if (!orden.codigoProducto?.trim()) errores.codigoProducto = "El código es requerido";
        if (!orden.productoRequerido?.trim()) errores.productoRequerido = "El producto es requerido";
        if (!orden.marca?.trim()) errores.marca = "La marca es requerida";
        if (!orden.stockRequerido && orden.stockRequerido !== 0)
            errores.stockRequerido = "El stock planeado es requerido";
        if (!orden.fechaEntrega?.trim())
            errores.fechaEntrega = "La fecha de entrega es requerida";
        return errores;
    };

    const handleCrearOrden: MRT_TableOptions<OrdenProduccion>["onCreatingRowSave"] = async ({ values, table }) => {
        const errores = validarCamposInsumo(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }
        setValidationErrors({});
        await handleAddOrden(values);
        table.setCreatingRow(null);
    };

    const tabla = useMaterialReactTable({
        columns,
        data: ordenes,
        // columnResizeMode: 'onEnd',
        createDisplayMode: "modal",
        enableRowActions: true,
        positionActionsColumn: 'last',
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        enableEditing: true,
        enableExpandAll: false,
        positionExpandColumn: 'last',
        defaultColumn: {
            // minSize: 80, //allow columns to get smaller than default
            // maxSize: 900, //allow columns to get larger than default
            // size: 110, //make columns wider by default
            // grow: 1,
            // enableResizing: true,
        },
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            },
            density: 'compact',
            columnVisibility: {
                stockRequerido: false,
                fechaEntrega: false,
                lote: false,
            },
        },
        displayColumnDefOptions: {
            'mrt-row-expand': {
                size: 0,
                header: '',
                Cell: () => null,
            },
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

        getRowId: (row) => String(row.id),
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCrearOrden,
        onEditingRowCancel: () => setValidationErrors({}),

        renderDetailPanel: ({ row }) => (
            <Box
                sx={{
                    display: "flex",
                    // gridTemplateColumns: "repeat(6, 1fr)",
                    // 
                    gap: 10,
                    padding: 2,
                    backgroundColor: "#2b2b2bff",
                    borderRadius: "10px",
                    color: "#fff",
                }}
            >

                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Cant. Planeada
                    </Typography>
                    <Typography>{row.original.stockRequerido}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Fecha Entrega
                    </Typography>
                    <Typography>{row.original.fechaEntrega}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Lote
                    </Typography>
                    <Typography>{row.original.lote}</Typography>
                </Box>

            </Box>
        ),

        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
                >
                    Nueva Orden
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        padding: 2,
                    }}
                >
                    {internalEditComponents}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <MRT_EditActionButtons table={table} row={row} color="primary" />
                </DialogActions>
            </>
        ),

        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
                >
                    Editar Orden
                </DialogTitle>

                <DialogContent
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        padding: 2,
                    }}
                >
                    {internalEditComponents}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <MRT_EditActionButtons
                        table={table}
                        row={row}
                        // variant="contained"
                        color="primary"
                    />
                </DialogActions>
            </>
        ),

        renderRowActions: ({ row }) => {

            return (
                <Box sx={{ display: "flex", gap: "0.5rem" }}>

                    <Tooltip title="En Producción">
                        <IconButton
                            color="warning"
                            onClick={() => marcarEnProduccion(Number(row.original.id), row.original.codigoProducto)}
                        >
                            ⚙️
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Calcular tiempo estimado">
                        <IconButton
                            color="info"
                            onClick={async () => {
                                try {
                                    const res = await calcularTiempoEstimado(
                                        row.original.codigoProducto,
                                        row.original.stockRequerido
                                    );
                                    toast.info(`⏱️ Tiempo estimado: ${res} horas`);
                                } catch {
                                    toast.error("Error al calcular el tiempo estimado");
                                }
                            }}
                        >
                            ⏱️
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Finalizar Orden">
                        <IconButton
                            color="success"
                            onClick={() => finalizarOrden(row.original.id, row.original.stockProducidoReal, "Deposito central")}
                        >
                            ✅
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Cancelar Orden">
                        <IconButton
                            color="error"
                            onClick={() => cancelarOrden(Number(row.original.id))}
                        >
                            ❌
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Detalles">
                        <IconButton color="info" onClick={() => row.toggleExpanded()}>
                            ℹ️
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        },

        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    width: '100%',
                    gap: 2,
                }}
            >
                <Button
                    onClick={() => navigate("/")}
                    className="btn-volver"
                    variant="contained"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "#2b2b2b",
                        color: "#fff",
                        borderRadius: "30px",
                        padding: "8px 16px",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: "#444",
                            transform: "scale(1.05)",
                        },
                    }}
                >
                    <IoArrowBackCircleSharp size={28} style={{ color: "#ff4b4b" }} />
                </Button>
                <Button
                    variant="contained"
                    onClick={() => table.setCreatingRow(true)}
                    className="boton-agregar-insumo"
                >
                    <span className="texto-boton">Nueva Orden</span>
                    <span className="icono-boton">➕</span>
                </Button>
                <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
                    <Typography variant="h5" color="primary" className="titulo-lista-insumos">
                        Órdenes de Producción
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

export default TablaInsumos;
