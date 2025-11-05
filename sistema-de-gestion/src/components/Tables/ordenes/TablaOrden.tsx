import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography, } from "@mui/material";
import { OrdenesContext, type OrdenProduccion } from "../../../Context/OrdenesContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { TiempoProduccionContext } from "../../../Context/TiempoProduccionContext";
import { ProductosContext } from "../../../Context/ProductosContext";
import SinResultados from "../../SinResultados";
import HistorialEtapas from "./HistorialEtapas";

const TablaOrden: React.FC = () => {
    const { ordenes, isLoading, handleAddOrden, marcarEnProduccion, finalizarOrden, cancelarOrden, error } = useContext(OrdenesContext)!;
    const { productos } = useContext(ProductosContext)!;
    const { calcularTiempoEstimado } = useContext(TiempoProduccionContext)!;
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
                header: "Código",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                editVariant: "select",
                editSelectOptions: productos.map((p) => ({ value: p.codigo, label: p.codigo })),
                muiEditTextFieldProps: ({ row }) => ({
                    required: true,
                    onChange: (e) => {
                        const codigo = e.target.value;
                        const producto = productos.find((p) => p.codigo === codigo);
                        row.original.codigoProducto = codigo;
                        row.original.productoRequerido = producto ? producto.nombre : "";
                        row.original.marca = producto ? producto.marca : "";
                        // row.original.categoria = producto ? producto.categoria : "";
                    },
                    error: !!validationErrors.codigoProducto,
                    helperText: validationErrors.codigoProducto,
                    onFocus: () => setValidationErrors({ ...validationErrors, codigoProducto: undefined }),
                }),
            },
            {
                accessorKey: "productoRequerido",
                header: "Producto",
                enableEditing: false, // solo lectura
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: ({ row }) => ({
                    value: row.original.productoRequerido,
                    error: !!validationErrors.productoRequerido,
                    helperText: validationErrors.productoRequerido ? (
                        <span style={{ color: "red" }}>{validationErrors.productoRequerido}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, productoRequerido: undefined }),
                }),
            },
            {
                accessorKey: "marca",
                header: "Marca",
                enableEditing: false, // solo lectura
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: ({ row }) => ({
                    value: row.original.marca,
                    error: !!validationErrors.marca,
                    helperText: validationErrors.marca ? (
                        <span style={{ color: "red" }}>{validationErrors.marca}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, marca: undefined }),
                }),
            },
            {
                accessorKey: "estado",
                header: "Estado",
                editVariant: "select",
                editSelectOptions: ["EVALUACIÓN"],
                defaultValue: "EVALUACIÓN",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    error: !!validationErrors.estado,
                    helperText: validationErrors.estado ? (
                        <span style={{ color: "red" }}>{validationErrors.estado}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, estado: undefined }),
                },
                Cell: ({ cell }) => {
                    const estado = String(cell.getValue() ?? "");
                    const bg =
                        estado === "CANCELADA"
                            ? "red"
                            : estado === "EN_PRODUCCION"
                                ? "gold"
                                : estado === "FINALIZADA_ENTREGADA"
                                    ? "green"
                                    : estado === "EVALUACIÓN"
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
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.lote,
                    helperText: validationErrors.lote ? (
                        <span style={{ color: "red" }}>{validationErrors.lote}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, lote: undefined }),
                },

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
        ],
        [validationErrors]
    );

    const validarCamposInsumo = (orden: Partial<OrdenProduccion>) => {
        const errores: Record<string, string> = {};

        if (!orden.codigoProducto?.trim()) errores.codigoProducto = "El código es requerido";
        if (!orden.lote?.trim()) errores.lote = "El lote es requerido";
        // if (!orden.productoRequerido?.trim()) errores.productoRequerido = "El lote es requerido";
        // if (!orden.marca?.trim()) errores.marca = "La marca es requerida";
        // if (!orden.estado?.trim()) errores.estado = "El estado es requerido";
        if (!orden.stockRequerido && orden.stockRequerido !== 0)
            errores.stockRequerido = "El stock planeado es requerido";
        if (!orden.fechaEntrega?.trim())
            errores.fechaEntrega = "La fecha de entrega es requerida";
        return errores;
    };

    const handleCrearOrden: MRT_TableOptions<OrdenProduccion>["onCreatingRowSave"] = async ({ values, table }) => {
        setValidationErrors({});
        const errores = validarCamposInsumo(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }
        // 🔹 Forzar valor por defecto
        const nuevaOrden = {
            ...values,
            estado: values.estado ?? "EVALUACIÓN",
        };

        setValidationErrors({});
        await handleAddOrden(nuevaOrden);
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
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            },
            sorting: [{ id: "id", desc: true }],
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
                    flexDirection: "column",
                    gap: 3,
                    p: 2,
                    backgroundColor: "#2b2b2bff",
                    borderRadius: "10px",
                    color: "#fff",
                }}
            >
                <Box sx={{ display: "flex", gap: 6 }}>
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

                    <Box>
                        <Typography variant="subtitle2" color="primary">
                            Tiempo estimado de Producción
                        </Typography>

                        {row.original.tiempoEstimado ? (
                            <Typography>{row.original.tiempoEstimado}</Typography>
                        ) : (
                            <IconButton title="Calcular tiempo"
                                color="info"
                                onClick={async () => {
                                    await calcularTiempoEstimado(
                                        row.original.codigoProducto,
                                        row.original.stockRequerido
                                    );
                                }}
                            >
                                ⏱️
                            </IconButton>
                        )}
                    </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <HistorialEtapas ordenId={row.original.id} />
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
            const estado = row.original.estado; // suponiendo que la orden tiene un campo 'estado'
            const enProduccion = estado === "EN_PRODUCCION"
            const finalizada = estado === "FINALIZADA_ENTREGADA";
            const cancelada = estado === "CANCELADA";
            const evaluacion = estado === "EVALUACIÓN";

            return (
                <Box sx={{ display: "flex", gap: "0.5rem" }}>
                    <Tooltip title="En Producción">
                        <span> {/* Necesario para tooltips en botones deshabilitados */}
                            <IconButton
                                color="warning"
                                onClick={() => marcarEnProduccion(Number(row.original.id), row.original.codigoProducto)}
                                disabled={enProduccion || finalizada || cancelada} // deshabilita si ya está en producción o terminada/cancelada
                            >
                                ⚙️
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Finalizar Orden">
                        <span>
                            <IconButton
                                color="success"
                                onClick={() => finalizarOrden(row.original.id, row.original.stockProducidoReal, "Deposito central")}
                                disabled={finalizada || cancelada || evaluacion} // no permite finalizar si ya está finalizada o cancelada
                            >
                                ✅
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Cancelar Orden">
                        <span>
                            <IconButton
                                color="error"
                                onClick={() => cancelarOrden(Number(row.original.id))}
                                disabled={finalizada || cancelada || enProduccion} // no permite cancelar si ya está finalizada o cancelada
                            >
                                ❌
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Detalles">
                        <IconButton
                            color="info"
                            onClick={async () => {
                                row.toggleExpanded();
                            }}
                        >
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

export default TablaOrden;


