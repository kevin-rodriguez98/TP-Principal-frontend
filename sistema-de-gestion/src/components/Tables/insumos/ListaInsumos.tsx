import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_Row, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton,Tooltip, Typography, } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { InsumoContext, type Insumo } from "../../../Context/InsumoContext";
import { FaExclamationTriangle } from "react-icons/fa";
import SinResultados from "../../estaticos/SinResultados";
import { useToUpper } from "../../../hooks/useToUpper";
import MapIcon from "@mui/icons-material/Map";
import ModalMapaAlmacen from "./modals/modalMapa";
import ModalLocacionInsumo from "./modals/modalAddLocacion";

const ESTILOS_CABECERA = { style: { color: "#15a017ff" } };

const TablaInsumos: React.FC = () => {
    const { insumos, handleAddInsumo, handleUpdateInsumo, handleDelete, isLoading, error, obtenerSiguienteCodigo } = useContext(InsumoContext)!;
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const { toUpperObject } = useToUpper();
    const [openMapa, setOpenMapa] = useState(false);
    const [insumoSeleccionado, setInsumoSeleccionado] = useState<Insumo | null>(null);

    const handleOpenMapa = (insumo: Insumo) => {
        setInsumoSeleccionado(insumo);
        setOpenMapa(true);
    };

    const handleCloseMapa = () => {
        setOpenMapa(false);
        setInsumoSeleccionado(null);
    };


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


    const columns = useMemo<MRT_ColumnDef<Insumo>[]>(
        () => [
            {
                accessorKey: "codigo",
                header: "Código",
                size: 90,
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("codigo"),
            },
            {
                accessorKey: "nombre",
                header: "Nombre",
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("nombre"),
            },
            {
                accessorKey: "categoria",
                header: "Categoría",
                editVariant: "select",
                editSelectOptions: ["Lácteos", "Quesos", "Postres", "Crema", "Congelados", "Otros"],
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("categoria"),
            },
            {
                accessorKey: "marca",
                header: "Marca",
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("marca"),
            },
            {
                accessorKey: "unidad",
                header: "Unidad",
                editVariant: "select",
                editSelectOptions: ["Unidad", "Litros ", "Gramos ", "Kilogramos", "Toneladas"],
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("unidad"),
            },
            {
                accessorKey: "stock",
                header: "Stock",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("stock", { type: "number", required: false }),
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
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: baseTextFieldProps("umbralMinimoStock", { type: "number" }),
                Cell: ({ row }) => {
                    const umbral = row.original.umbralMinimoStock;
                    return (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Typography sx={{ color: "#e4f502ff" }}>{umbral}</Typography>
                        </Box>
                    );
                },
            },
        ],
        [validationErrors, insumos]
    );

    const validarCamposInsumo = (insumo: Partial<Insumo>) => {
        const errores: Record<string, string> = {};
        if (!insumo.nombre?.trim()) errores.nombre = "Nombre requerido";
        if (!insumo.categoria?.trim()) errores.categoria = "Categoría requerida";
        if (!insumo.marca?.trim()) errores.marca = "Marca requerida";
        if (!insumo.unidad?.trim()) errores.unidad = "Medida requerida";
        const umbralNumber = Number(insumo.umbralMinimoStock);
        if (insumo.umbralMinimoStock === undefined || insumo.umbralMinimoStock === null || isNaN(umbralNumber) || umbralNumber <= 0) {
            errores.umbralMinimoStock = "Umbral mínimo debe ser un número válido mayor a 0";
        }
        return errores;
    };

    // const handleCreateInsumo: MRT_TableOptions<Insumo>["onCreatingRowSave"] = async ({ values, table }) => {
    //     const errores = validarCamposInsumo(values);
    //     if (Object.keys(errores).length > 0) {
    //         setValidationErrors(errores);
    //         return;
    //     }

    //     setValidationErrors({});

    //     const codigo = values.codigo && values.codigo.trim() !== "" ? values.codigo : obtenerSiguienteCodigo();
    //     const nuevoInsumo: Insumo = {
    //         ...values,
    //         codigo,
    //         stock: 0,
    //         locacion: {
    //             deposito: "Depósito Central",
    //             sector: "insumos-secos",
    //             estante: "ins-1",
    //             posicion: "E1",
    //         },
    //     };

    //     const valoresEnMayus = toUpperObject(nuevoInsumo);

    //     await handleAddInsumo(valoresEnMayus);
    //     table.setCreatingRow(null);
    // };

    // --- Modal Locación ---










    const [openLocacion, setOpenLocacion] = useState(false);
    const [locacionTemp, setLocacionTemp] = useState({
        deposito: "",
        sector: "",
        estante: "",
        posicion: "",
    });

    // Guarda temporalmente los datos del insumo en creación
    const [insumoTemp, setInsumoTemp] = useState<Insumo | null>(null);

    const handleChangeLocacion = (campo: string, valor: string) => {
        setLocacionTemp((prev) => ({ ...prev, [campo]: valor }));
    };
    const handleCreateInsumo: MRT_TableOptions<Insumo>["onCreatingRowSave"] = async ({ values, table }) => {
        const errores = validarCamposInsumo(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }

        setValidationErrors({});

        // Guardar datos temporales del insumo
        setInsumoTemp(values);

        // Abrir modal de locación
        setOpenLocacion(true);

        // NO crear el insumo todavía
    };


    const confirmarLocacion = async () => {
        if (!insumoTemp) return;

        const codigo = insumoTemp.codigo?.trim() !== ""
            ? insumoTemp.codigo
            : obtenerSiguienteCodigo();

        const nuevoInsumo: Insumo = {
            ...insumoTemp,
            codigo: codigo ?? "",
            stock: 0,
            locacion: locacionTemp,
        };

        const valoresEnMayus = toUpperObject(nuevoInsumo);

        await handleAddInsumo(valoresEnMayus);

        // Cerrar modal
        setOpenLocacion(false);
        setLocacionTemp({ deposito: "", sector: "", estante: "", posicion: "" });
        setInsumoTemp(null);
    };












    const handleSaveInsumo: MRT_TableOptions<Insumo>['onEditingRowSave'] = async ({ values, exitEditingMode }) => {
        const errores = validarCamposInsumo(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }
        const valoresEnMayus = toUpperObject(values);
        setValidationErrors({});
        await handleUpdateInsumo(valoresEnMayus);
        exitEditingMode();
    };

    const openDeleteConfirmModal = (row: MRT_Row<Insumo>) => {
        handleDelete(row.original.codigo);
    };

    const tabla = useMaterialReactTable({
        columns,
        data: insumos,
        // enableColumnResizing: true,
        columnResizeMode: 'onEnd',
        createDisplayMode: "modal",
        defaultColumn: {
            minSize: 80, 
            maxSize: 900, 
            size: 110, 
            grow: 1,
            enableResizing: true,
        },
        enableRowActions: true,
        positionActionsColumn: 'first',
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        enableEditing: true,
        // enableColumnOrdering: true,
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            },
            sorting: [{ id: "codigo", desc: true }],
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
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateInsumo,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveInsumo,


        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
            const siguienteCodigo = obtenerSiguienteCodigo();
            row._valuesCache.codigo = siguienteCodigo;

            return (
                <>
                    <DialogTitle
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
                    >
                        Nuevo Insumo
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
            );
        },

        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
                >
                    Editar Insumo
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
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
                <Tooltip title="Editar">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Mapa">
                    <IconButton color="primary" onClick={() => handleOpenMapa(row.original)}>
                        <MapIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
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
                    <span className="texto-boton">Agregar Insumo</span>
                    <span className="icono-boton">➕</span>
                </Button>
                <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
                    <Typography variant="h5" color="primary" className="titulo-lista-insumos">
                        Insumos
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
        <>
            <MaterialReactTable table={tabla} />


            <ModalLocacionInsumo
                open={openLocacion}
                onClose={() => setOpenLocacion(false)}
                locacion={locacionTemp}
                onChange={handleChangeLocacion}
                onConfirm={confirmarLocacion}
            />


            <ModalMapaAlmacen
                open={openMapa}
                onClose={handleCloseMapa}
                insumo={insumoSeleccionado}
            />


        </>
    );
};

export default TablaInsumos;
