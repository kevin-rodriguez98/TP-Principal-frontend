import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from "@mui/material";
import { OrdenesContext, type OrdenProduccion, estados } from "../../../Context/OrdenesContext";
import { ProductosContext } from "../../../Context/ProductosContext";
import CeldaEstado from "./CeldaEstado";
import CeldaEtapa from "./CeldaEtapa";
import SinResultados from "../../estaticos/SinResultados";
import HistorialEtapas from "./HistorialEtapas";
import { useToUpper } from "../../../hooks/useToUpper";
import { useUsuarios } from "../../../Context/UsuarioContext";


const ESTILOS_CABECERA = { style: { color: "#8c52ff" } };

const TablaOrden: React.FC = () => {
    const { ordenes, isLoading, handleAddOrden, generarCodigoLote, error, notificarEtapa, finalizarOrden, agregarNota } = useContext(OrdenesContext)!;
    const { productos } = useContext(ProductosContext)!;
    const { usuario } = useUsuarios();
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const { toUpperObject } = useToUpper();
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

    const opcionesProductos = useMemo(() =>
        productos.map((p) => ({
            value: p.codigo,
            label: `${p.codigo} - ${p.nombre} - ${p.linea}`,
        })), [productos]);


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
                editSelectOptions: opcionesProductos,
                muiEditTextFieldProps: ({ row, table }) => ({
                    onChange: (e) => {
                        const codigo = e.target.value;
                        const producto = productos.find((p) => p.codigo === codigo);
                        row._valuesCache.codigoProducto = codigo;
                        row._valuesCache.productoRequerido = producto?.nombre || "";
                        row._valuesCache.marca = producto?.linea || "";
                        row._valuesCache.presentacion = producto?.presentacion || "";
                        row._valuesCache.lote = generarCodigoLote(codigo) || "";
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
                header: "Linea",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ row }) => ({
                    value: row._valuesCache.marca
                }),
                Cell: ({ row }) => row.original.marca || "—",
            },
            {
                accessorKey: "presentacion",
                header: "Presentación",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ row }) => ({
                    value: row._valuesCache.presentacion
                }),
                Cell: ({ row }) => {
                    const producto = productos.find((p) => p.codigo === row.original.codigoProducto);
                    const presentacion = producto?.presentacion;
                    const unidad = producto?.unidad;
                    return (
                        <span style={{ color: "yellow", cursor: "pointer" }}>
                            {presentacion} {unidad}
                        </span>

                    );
                },
            },
            {
                accessorKey: "estado",
                header: "Estado",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ }) => ({
                    value: "EVALUACIÓN",
                }),
                Cell: ({ row }) => (
                    <CeldaEstado
                        idOrden={row.original.id}
                        estado={row.original.estado}
                        legajo={usuario?.legajo ? usuario?.legajo : "100"}
                        notificarEtapa={notificarEtapa}
                        finalizarOrden={finalizarOrden}
                    />
                ),
            },
            {
                accessorKey: "etapa",
                header: "Etapa",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ }) => ({
                    value: "-",
                }),
                Cell: ({ row }) => (
                    <CeldaEtapa
                        idOrden={row.original.id}
                        etapa={row.original.etapa}
                        estadoActual={row.original.estado}
                        legajo={usuario?.legajo ? usuario?.legajo : "100"}
                        notificarEtapa={notificarEtapa}
                        agregarNota={agregarNota}
                    // visible={row.original.estado === estados.enProduccion}
                    />
                ),
            },
            {
                accessorKey: "stockRequerido",
                header: "Stock requerido",
                muiEditTextFieldProps: baseTextFieldProps("stockRequerido", { type: "number" }),
            },
            {
                accessorKey: "lote",
                header: "Lote",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ row }) => ({
                    value: row._valuesCache.lote
                }),
                Cell: ({ row }) => row.original.lote || "—",
            },
            {
                accessorKey: "fechaEntrega",
                header: "Fecha de entrega",
                muiEditTextFieldProps: baseTextFieldProps("fechaEntrega", {
                    type: "date",
                    InputLabelProps: { shrink: true },
                }),
            },
            {
                accessorKey: "legajo",
                header: "Responsable",
                enableEditing: false,
                muiEditTextFieldProps: { value: `${usuario?.legajo}` },
                Cell: ({ row }) => row.original.legajo || "—",
            },
            {
                accessorKey: "fechaCreacion",
                header: "Fecha creación",
                enableEditing: false,
                muiEditTextFieldProps: { value: new Date().toLocaleString() },
            },
        ],
        [validationErrors, ordenes]
    );


    const validar = (o: Partial<OrdenProduccion>) => {
        const err: Record<string, string> = {};
        if (!o.codigoProducto?.trim()) err.codigoProducto = "El código es requerido";
        if (!o.stockRequerido && o.stockRequerido !== 0)
            err.stockRequerido = "El stock planeado es requerido";
        if (!o.fechaEntrega) err.fechaEntrega = "La fecha de entrega es requerida";
        return err;
    };

    const handleCrearOrden: MRT_TableOptions<OrdenProduccion>["onCreatingRowSave"] = async ({ values, table }) => {
        setValidationErrors({});
        const errores = validar(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }

        const nuevaOrden = {
            ...values,
            estado: values.estado?.trim() !== "" ? values.estado : estados.evaluacion,
            legajo: values.legajo?.trim() !== "" ? values.legajo : usuario?.legajo,
            lote: generarCodigoLote(values.codigoProducto),
        };

        const valoresEnMayus = toUpperObject(nuevaOrden);
        setValidationErrors({});
        await handleAddOrden(valoresEnMayus);
        table.setCreatingRow(null);
    };


    const tabla = useMaterialReactTable({
        columns,
        data: ordenes,
        createDisplayMode: "modal",
        editDisplayMode: "row",
        enableRowActions: true,
        positionActionsColumn: 'first',
        enableGlobalFilter: true,
        enableEditing: true,
        enableExpandAll: false,
        positionExpandColumn: 'last',
        initialState: {
            pagination: {
                pageSize: 5,
                pageIndex: 0
            },
            sorting: [{ id: "id", desc: true }],
            density: 'compact',
            columnVisibility: {
                stockRequerido: false,
                legajo: false,
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

        renderDetailPanel: ({ row }) => {

            return (
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
                                Tiempo estimado de Producción
                            </Typography>

                            {row.original.tiempoProduccion ? (
                                <>
                                    <Typography>{row.original.tiempoProduccion} minutos.</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        *Los tiempos son estimativos.
                                    </Typography>
                                </>
                            ) : (
                                <Typography>No hay tiempos registrados</Typography>
                            )}
                        </Box>


                        {/* Resto de los datos */}
                        <Box>
                            <Typography variant="subtitle2" color="primary">
                                Stock Requerido
                            </Typography>
                            <Typography>{row.original.stockRequerido}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="primary">
                                Fecha entrega
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
                                Responsable
                            </Typography>
                            <Typography>{row.original.legajo} - {row.original.responsableApellido} {row.original.responsableNombre}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="primary">
                                Fecha creación
                            </Typography>
                            <Typography>{row.original.fechaCreacion}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="primary">
                                Stock producido
                            </Typography>
                            <Typography>{row.original.stockProducidoReal}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <HistorialEtapas ordenId={row.original.id} />
                    </Box>
                </Box>
            );
        },

        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
            const camposRequeridos = [
                "codigoProducto",
                "stockRequerido",
                "fechaEntrega",
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
                                backgroundColor: "#0e1217",
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

        renderRowActions: ({ row }) => {
            const acciones = [
                {
                    title: "Detalles",
                    icon: "ℹ️",
                    color: "info",
                    action: () => row.toggleExpanded(),
                    disabled: false
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

