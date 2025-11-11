import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Dialog, TextField, IconButton, Tooltip, Typography, FormControl, MenuItem, Select, } from "@mui/material";
import { OrdenesContext, type OrdenProduccion } from "../../../Context/OrdenesContext";
import { TiempoProduccionContext } from "../../../Context/TiempoProduccionContext";
import { ProductosContext } from "../../../Context/ProductosContext";
import SinResultados from "../../estaticos/SinResultados";
import HistorialEtapas from "./HistorialEtapas";

import NoteAddIcon from "@mui/icons-material/NoteAdd";

const ESTILOS_CABECERA = { style: { color: "#15a017ff" } };
const ESTADOS_COLORES: Record<string, string> = {
    CANCELADA: "red",
    EN_PRODUCCION: "gold",
    FINALIZADA_ENTREGADA: "green",
    EVALUACIÓN: "dodgerblue",
};

const TablaOrden: React.FC = () => {
    const { ordenes, isLoading, handleAddOrden, marcarEnProduccion, finalizarOrden, cancelarOrden, error, notificarEtapa, agregarNota } = useContext(OrdenesContext)!;
    const { productos } = useContext(ProductosContext)!;
    const { calcularTiempoEstimado } = useContext(TiempoProduccionContext)!;
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

    const limpiarError = (campo: string) =>
        setValidationErrors((prev) => ({ ...prev, [campo]: undefined }));

    const baseTextFieldProps = (campo: string, extraProps = {}) => ({
        required: true,
        error: !!validationErrors[campo],
        helperText: validationErrors[campo] ? (
            <span style={{ color: "red" }}>{validationErrors[campo]}</span>
        ) : null,
        onFocus: () => limpiarError(campo),
        ...extraProps,
    });

    const columns = useMemo<MRT_ColumnDef<OrdenProduccion>[]>(
        () => [
            {
                accessorKey: "id",
                header: "ID",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
            },
            {
                accessorKey: "codigoProducto",
                header: "Producto",
                muiTableHeadCellProps: ESTILOS_CABECERA,
                editVariant: "select",
                editSelectOptions: productos.map((p) => ({
                    value: p.codigo,
                    label: p.codigo + " - " + p.nombre + " - " + p.marca,
                })),
                muiEditTextFieldProps: ({ row, table }) => ({
                    onChange: (e) => {
                        const codigo = e.target.value;
                        const producto = productos.find((p) => p.codigo === codigo);
                        row._valuesCache.codigoProducto = codigo;
                        row._valuesCache.productoRequerido = producto?.nombre || "";
                        row._valuesCache.marca = producto?.marca || "";
                        // row._valuesCache.categoria = insumo?.categoria || "";

                        table.setCreatingRow({
                            ...row,
                            _valuesCache: { ...row._valuesCache },
                            original: { ...row.original, ...row._valuesCache },
                        });

                    },
                    ...baseTextFieldProps("codigoProducto"),
                }),
                Cell: ({ row }) => row.original.codigoProducto || "—",
            },
            {
                accessorKey: "productoRequerido",
                header: "Producto",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ row }) => ({
                    value: row._valuesCache.productoRequerido
                }),
                Cell: ({ row }) => row.original.productoRequerido || "—",
            },
            {
                accessorKey: "marca",
                header: "Marca",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ row }) => ({
                    value: row._valuesCache.marca
                }),
                Cell: ({ row }) => row.original.marca || "—",
            },
            {
                accessorKey: "estado",
                header: "Estado",
                muiTableHeadCellProps: ESTILOS_CABECERA,
                enableEditing: false,
                muiEditTextFieldProps: { value: "EVALUACIÓN" },
                Cell: ({ cell }) => {
                    const estado = String(cell.getValue() ?? "");
                    const bg = ESTADOS_COLORES[estado] || "gray";
                    return (
                        <span
                            style={{
                                backgroundColor: bg,
                                color: bg === "gold" ? "black" : "white",
                                borderRadius: 12,
                                padding: "4px 8px",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                textTransform: "uppercase",
                                display: "inline-block",
                            }}
                        >
                            {estado.replaceAll("_", " ")}
                        </span>
                    );
                },
            },
            {
                accessorKey: "etapa",
                header: "Etapa",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                Cell: ({ row }) => {
                    const [etapa, setEtapa] = useState(row.original.etapa || "ETAPA1");
                    const [open, setOpen] = useState(false);
                    const [nota, setNota] = useState(row.original.nota || "");
                    const [loading, setLoading] = useState(false);

                    const handleCambiarEtapa = async (nuevaEtapa: string) => {
                        setEtapa(nuevaEtapa);
                            await notificarEtapa(row.original.id, nuevaEtapa);
                    };

                    const handleGuardarNota = async () => {
                        if (!nota.trim()) return;
                        setLoading(true);
                        try {
                            await agregarNota(row.original.id, nota);
                            setOpen(false);
                        } finally {
                            setLoading(false);
                        }
                    };

                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <FormControl
                                variant="standard"
                                sx={{
                                    minWidth: 100,
                                    background: "#2b2b2b",
                                    borderRadius: "6px",
                                    px: 1,
                                }}
                            >
                                <Select
                                    value={etapa}
                                    onChange={(e) => handleCambiarEtapa(e.target.value)}
                                    sx={{
                                        color: "#fff",
                                        "& .MuiSelect-icon": { color: "#15a017ff" },
                                    }}
                                >
                                    <MenuItem value="ETAPA1">ETAPA1</MenuItem>
                                    <MenuItem value="ETAPA2">ETAPA2</MenuItem>
                                    <MenuItem value="ETAPA3">ETAPA3</MenuItem>
                                </Select>
                            </FormControl>

                            <Tooltip title="Agregar nota">
                                <IconButton
                                    size="small"
                                    onClick={() => setOpen(true)}
                                    sx={{ color: "#15a017ff" }}
                                >
                                    <NoteAddIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            {/* Modal oscuro */}
                            <Dialog
                                open={open}
                                onClose={() => setOpen(false)}
                                PaperProps={{
                                    sx: {
                                        backgroundColor: "#1e1e1e",
                                        color: "#f1f1f1",
                                        width: "420px",
                                        borderRadius: 3,
                                        p: 2,
                                    },
                                }}
                            >
                                <DialogTitle sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                                    Nota de la etapa {etapa}
                                </DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        variant="filled"
                                        value={nota}
                                        onChange={(e) => setNota(e.target.value)}
                                        label="Escribe una nota"
                                        InputProps={{
                                            style: {
                                                color: "#fff",
                                                background: "#2b2b2b",
                                            },
                                        }}
                                        InputLabelProps={{
                                            style: { color: "#bbb" },
                                        }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() => setOpen(false)}
                                        sx={{ color: "#ccc", textTransform: "none" }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleGuardarNota}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#15a017ff",
                                            textTransform: "none",
                                            "&:hover": { backgroundColor: "#178c15" },
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? "Guardando..." : "Guardar"}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    );
                },
            },


            {
                accessorKey: "stockRequerido",
                header: "Stock requerido",
                muiEditTextFieldProps: baseTextFieldProps("stockRequerido", { type: "number" }),
            },
            {
                accessorKey: "lote",
                header: "Lote",
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("lote"),
                Cell: ({ row }) => row.original.lote || "—",
            },
            {
                accessorKey: "fechaEntrega",
                header: "Fecha de entrega",
                muiEditTextFieldProps: baseTextFieldProps("fechaEntrega", {
                    type: "date",
                    InputLabelProps: { shrink: true },
                }),
                Cell: ({ row }) => row.original.fechaEntrega || "—",
            },

            // 🟢 Nuevas columnas agregadas
            {
                accessorKey: "envasado",
                header: "Envasado",
                enableEditing: true,
                editVariant: "select",
                editSelectOptions: ["Plástico", "Vidrio", "Sachet", "Cartón"],
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("envasado"),
                Cell: ({ row }) => row.original.envasado || "—",
            },
            {
                accessorKey: "presentacion",
                header: "Presentación",
                enableEditing: true,
                editVariant: "select",
                editSelectOptions: ["Gramos", "Litros", "Kilos"],
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("presentacion"),
                Cell: ({ row }) => row.original.presentacion || "—",
            },
            {
                accessorKey: "creationUsername",
                header: "Responsable",
                enableEditing: false,
                muiEditTextFieldProps: { value: "admin" },
                Cell: ({ row }) =>
                    row.original.fechaCreacion
                        ? new Date(row.original.fechaCreacion).toLocaleString()
                        : "—",
            },
            {
                accessorKey: "fechaCreacion",
                header: "Fecha creación",
                enableEditing: false,
                muiEditTextFieldProps: { value: new Date().toLocaleString() },
                Cell: ({ row }) =>
                    row.original.fechaCreacion
                        ? new Date(row.original.fechaCreacion).toLocaleString()
                        : "—",
            },
            {
                accessorKey: "tiempoEstimado",
                header: "Tiempo estimado",
                enableEditing: false,
                Cell: ({ row }) => row.original.tiempoEstimado ?? "—",
            },
        ],
        [validationErrors]
    );

    //     const errores: Record<string, string> = {};
    //     if (!orden.codigoProducto?.trim()) errores.codigoProducto = "El código es requerido";
    //     if (!orden.lote?.trim()) errores.lote = "El lote es requerido";
    //     if (!orden.presentacion?.trim()) errores.presentacion = "La presentación es requerida";
    //     if (!orden.envasado?.trim()) errores.envasado = "El tipo de envasado es requerido";
    //     if (!orden.stockRequerido && orden.stockRequerido !== 0)
    //         errores.stockRequerido = "El stock planeado es requerido";
    //     if (!orden.fechaEntrega?.trim())
    //         errores.fechaEntrega = "La fecha de entrega es requerida";
    //     return errores;
    // };

    const validar = (o: Partial<OrdenProduccion>) => {
        const err: Record<string, string> = {};
        if (!o.codigoProducto?.trim()) err.codigoProducto = "El código es requerido";
        if (!o.lote?.trim()) err.lote = "El lote es requerido";
        if (!o.presentacion?.trim()) err.presentacion = "La presentación es requerida";
        if (!o.envasado?.trim()) err.envasado = "El tipo de envasado es requerido";
        if (!o.stockRequerido && o.stockRequerido !== 0)
            err.stockRequerido = "El stock planeado es requerido";
        if (!o.fechaEntrega?.trim()) err.fechaEntrega = "La fecha de entrega es requerida";
        return err;
    };

    const handleCrearOrden: MRT_TableOptions<OrdenProduccion>["onCreatingRowSave"] = async ({ values, table }) => {
        setValidationErrors({});
        const errores = validar(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }
        // 🔹 Forzar valor por defecto
        const nuevaOrden = {
            ...values,
            estado: values.estado && values.estado.trim() !== "" ? values.estado : "EVALUACIÓN",
            etapa: values.etapa && values.etapa.trim() !== "" ? values.etapa : "ETAPA1",
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
        editDisplayMode: "row",
        enableRowActions: true,
        positionActionsColumn: 'last',
        enableGlobalFilter: true,
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
                creationUsername: false,
                fechaCreacion: false,
                tiempoEstimado: false,
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
                    {[
                        ["Stock Requerido", row.original.stockRequerido],
                        ["Stock producido", row.original.stockProducidoReal],
                        ["Fecha creación", row.original.fechaCreacion],
                        ["Fecha entrega", row.original.fechaEntrega],
                        ["Lote", row.original.lote],
                    ].map(([label, value]) => (
                        <Box key={label}>
                            <Typography variant="subtitle2" color="primary">
                                {label}
                            </Typography>
                            <Typography>{value || "—"}</Typography>
                        </Box>
                    ))}

                    <Box>
                        <Typography variant="subtitle2" color="primary">
                            Tiempo estimado de Producción
                        </Typography>
                        {row.original.tiempoEstimado ? (
                            <Typography>{row.original.tiempoEstimado}</Typography>
                        ) : (
                            <IconButton
                                title="Calcular tiempo"
                                color="info"
                                onClick={() =>
                                    calcularTiempoEstimado(row.original.codigoProducto, row.original.stockRequerido)
                                }
                            >
                                ⏱️
                            </IconButton>
                        )}
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="primary">
                            Responsable
                        </Typography>
                        <Typography>{row.original.creationUsername}</Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <HistorialEtapas ordenId={row.original.id} />
                </Box>
            </Box>
        ),

        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
            const camposRequeridos = [
                "codigoProducto",
                "stockRequerido",
                "lote",
                "fechaEntrega",
                "envasado",
                "presentacion"
            ];

            const obtenerNombreCampo = (comp: React.ReactNode) => {
                if (!React.isValidElement(comp)) return "";
                const props = comp.props as {
                    column?: { accessorKey?: string; id?: string };
                    name?: string;
                };
                const raw =
                    props.column?.accessorKey ||
                    props.column?.id ||
                    props.name ||
                    (comp.key ? comp.key.toString() : "");
                return raw.replace("mrt-row-create_", "");
            };

            const camposUsuario = internalEditComponents.filter((comp) =>
                camposRequeridos.includes(obtenerNombreCampo(comp))
            );

            const camposAutomaticos = internalEditComponents.filter(
                (comp) => !camposRequeridos.includes(obtenerNombreCampo(comp))
            );

            return (
                <>
                    <DialogTitle
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            fontWeight: 600,
                            color: "#bbdefb",
                            letterSpacing: "0.5px",
                            mb: 1,
                        }}
                    >
                        Nueva Orden de Producción
                    </DialogTitle>

                    <DialogContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            py: 2,
                            px: 3,
                            backgroundColor: "#121212",
                            color: "#e0e0e0",
                            maxHeight: "70vh", // 🔹 para evitar que se desborde
                            overflowY: "auto", // 🔹 scroll si es necesario
                        }}
                    >
                        {/* Sección de datos obligatorios */}
                        <Box
                            sx={{
                                backgroundColor: "#1e1e1e",
                                borderRadius: 2,
                                border: "1px solid #2a2a2a",
                                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                                p: 3,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: 2,
                                    fontWeight: "bold",
                                    color: "#64b5f6",
                                    borderBottom: "1px solid #1976d2",
                                    pb: 1,
                                    textAlign: "center",
                                }}
                            >
                                Datos obligatorios
                            </Typography>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 2,
                                }}
                            >
                                {camposUsuario}
                            </Box>
                        </Box>

                        {/* Sección de datos automáticos */}
                        <Box
                            sx={{
                                backgroundColor: "#1a1a1a",
                                borderRadius: 2,
                                border: "1px solid #333",
                                boxShadow: "0 0 10px rgba(0,0,0,0.25)",
                                p: 3,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: 2,
                                    fontWeight: "bold",
                                    color: "#b0bec5",
                                    borderBottom: "1px solid #424242",
                                    pb: 1,
                                    textAlign: "center",
                                }}
                            >
                                Datos automáticos
                            </Typography>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 2,
                                }}
                            >
                                {camposAutomaticos}
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions
                        sx={{
                            justifyContent: "center",
                            py: 2,
                            borderTop: "1px solid #333",
                            backgroundColor: "#121212",
                        }}
                    >
                        <MRT_EditActionButtons table={table} row={row} color="primary" />
                    </DialogActions>
                </>
            );
        },

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
            const { id, codigoProducto, estado, stockProducidoReal } = row.original;
            const enProduccion = estado === "EN_PRODUCCION";
            const finalizada = estado === "FINALIZADA_ENTREGADA";
            const cancelada = estado === "CANCELADA";
            const evaluacion = estado === "EVALUACIÓN";

            const acciones = [
                {
                    title: "En Producción",
                    icon: "⚙️",
                    color: "warning",
                    action: () => marcarEnProduccion(Number(id), codigoProducto),
                    disabled: enProduccion || finalizada || cancelada,
                },
                {
                    title: "Finalizar Orden",
                    icon: "✅",
                    color: "success",
                    action: () => finalizarOrden(id, stockProducidoReal, "Deposito central"),
                    disabled: finalizada || cancelada || evaluacion,
                },
                {
                    title: "Cancelar Orden",
                    icon: "❌",
                    color: "error",
                    action: () => cancelarOrden(Number(id)),
                    disabled: finalizada || cancelada || enProduccion,
                },
                {
                    title: "Detalles",
                    icon: "ℹ️",
                    color: "info",
                    action: () => row.toggleExpanded(),
                },
            ];

            return (
                <Box sx={{ display: "flex", gap: "0.5rem" }}>
                    {acciones.map(({ title, icon, color, action, disabled }) => (
                        <Tooltip key={title} title={title}>
                            <span>
                                <IconButton color={color as any} onClick={action} disabled={disabled}>
                                    {icon}
                                </IconButton>
                            </span>
                        </Tooltip>
                    ))}
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


