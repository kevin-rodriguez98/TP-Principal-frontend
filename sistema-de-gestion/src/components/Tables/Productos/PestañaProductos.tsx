import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_EditActionButtons, type MRT_Row, } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from "@mui/material";
import { ProductosContext, type Producto } from "../../../Context/ProductosContext";
import { RecetaContext } from "../../../Context/RecetaContext";
import { TiempoProduccionContext } from "../../../Context/TiempoProduccionContext";
import { FaceAuthContext } from "../../../Context/FaceAuthContext";
import { useToUpper } from "../../../hooks/useToUpper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SinResultados from "../../estaticos/SinResultados";
import AddReceta from "./modals/AddReceta";
import ModalTiempos from "./modals/ModalTiempoProduccion";
import ModalAgregarTiempo from "./modals/AddTiempo";
import ModalInfoProducto from "./modals/VerInfo";




const ESTILOS_CABECERA = { style: { color: "#15a017ff" } };

const TablaProductos: React.FC = () => {
  const { productos, isLoading, error, handleAddProducto, handleEditProducto, handleDeleteProducto, obtenerSiguienteCodigo } = useContext(ProductosContext)!;
  const { insumosProducto, obtenerInsumosNecesarios } = useContext(RecetaContext)!;
  const { obtenerTiempoProduccionUnitario } = useContext(TiempoProduccionContext)!;
  const { user } = useContext(FaceAuthContext)!;

  const { toUpperObject } = useToUpper();
  const [productoInfo, setProductoInfo] = useState<Producto | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  // MODAL'S
  const [openModalReceta, setOpenModalReceta] = useState(false);
  const [openModalAgregarTiempo, setOpenModalAgregarTiempo] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [openModalTiempos, setOpenModalTiempos] = useState(false);


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



  const columns = useMemo<MRT_ColumnDef<Producto>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        muiTableHeadCellProps: ESTILOS_CABECERA,
      },
      {
        accessorKey: "codigo",
        header: "Código",
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
        accessorKey: "linea",
        header: "Línea",
        editVariant: "select",
        editSelectOptions: ["Light", "Entero", "Sin Lactosa", "Descremado", "Otro"],
        muiTableHeadCellProps: ESTILOS_CABECERA,
        muiEditTextFieldProps: baseTextFieldProps("linea"),
      },
      {
        accessorKey: "presentacion",
        header: "Presentación",
        muiTableHeadCellProps: ESTILOS_CABECERA,
        muiEditTextFieldProps: baseTextFieldProps("presentacion", { type: "number" }),
      },
      {
        accessorKey: "unidad",
        header: "Unidad",
        editVariant: "select",
        editSelectOptions: ["Unidades", "Litros ", "Gramos ", "Kilogramos", "Toneladas"],
        muiTableHeadCellProps: ESTILOS_CABECERA,
        muiEditTextFieldProps: baseTextFieldProps("unidad"),
      },
      {
        accessorKey: "stock",
        header: "Stock",
        enableEditing: false,
        muiTableHeadCellProps: ESTILOS_CABECERA,
        muiEditTextFieldProps: baseTextFieldProps("stock", { type: "number", required: false }),
      },
      {
        accessorKey: "fechaCreacion",
        header: "Fecha",
        enableEditing: false,
        muiTableHeadCellProps: ESTILOS_CABECERA,
      },
      {
        accessorKey: "legajoResponsable",
        header: "Responsable",
        enableEditing: false,
        muiTableHeadCellProps: ESTILOS_CABECERA,
        muiEditTextFieldProps: { value: `${user?.legajo}` },
        Cell: ({ row }) => `${row.original.legajo} - ${row.original.responsableApellido} ${row.original.responsableNombre}   ` || "—",

      },
    ],
    [validationErrors, productos]
  );

  const validarProducto = (producto: Partial<Producto>) => {
    const errores: Record<string, string> = {};
    if (!producto.nombre?.trim()) errores.nombre = "Nombre requerido";
    if (!producto.categoria?.trim()) errores.categoria = "Categoría requerida";
    if (!producto.linea?.trim()) errores.linea = "Línea requerida";
    if (producto.presentacion === undefined || producto.presentacion === null)
      errores.presentacion = "Presentación requerida";

    if (!producto.unidad?.trim()) errores.unidad = "Unidad requerida";
    return errores;
  };

  const handleCrearProducto = async ({ values, table }: any) => {
    const errores = validarProducto(values);
    if (Object.keys(errores).length > 0) {
      setValidationErrors(errores);
      return;
    }

    setValidationErrors({});
    const codigo = values.codigo && values.codigo.trim() !== ""
      ? values.codigo
      : obtenerSiguienteCodigo();

    const nuevoProducto: Producto = {
      ...values, codigo, stock: 0,
      legajoResponsable: values.legajo && values.legajo.trim() !== "" ? values.legajo : "100",
    };

    const valoresEnMayus = toUpperObject(nuevoProducto);
    await handleAddProducto(valoresEnMayus);

    table.setCreatingRow(null);
  };

  const handleEditarProducto = async ({ values, exitEditingMode }: any) => {
    const errores = validarProducto(values);
    if (Object.keys(errores).length > 0) {
      setValidationErrors(errores);
      return;
    }
    const valoresEnMayus = toUpperObject(values);
    setValidationErrors({});
    await handleEditProducto(valoresEnMayus);
    exitEditingMode();
  };

  const openDeleteConfirmModal = (row: MRT_Row<Producto>) => {
    handleDeleteProducto(row.original.codigo);
  };


  const table = useMaterialReactTable({
    columns,
    data: productos,
    createDisplayMode: "modal",
    enableRowActions: true,
    positionActionsColumn: 'first',
    enableGlobalFilter: true,
    editDisplayMode: "modal",
    enableEditing: true,
    positionExpandColumn: 'last',
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0
      },
      sorting: [{ id: "id", desc: true }],
      density: 'compact',
      columnVisibility: {
        fechaCreacion: false,
        legajoResponsable: false,
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

    getRowId: (row) => row.codigo,
    onCreatingRowSave: handleCrearProducto,
    onEditingRowSave: handleEditarProducto,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),

    renderRowActions: ({ row }) => (

      <Box sx={{ display: "flex", gap: "0.5rem" }}>
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

        <Tooltip title="Ver Receta">
          <IconButton
            color="success"
            onClick={async () => {
              await obtenerInsumosNecesarios(row.original.codigo, row.original.stock);
              setProductoInfo(row.original);
              row.toggleExpanded();
            }}
          >
            🧾
          </IconButton>
        </Tooltip>

        <Tooltip title="Información">
          <IconButton
            color="info"
            onClick={() => {
              setProductoInfo(row.original);
              setOpenInfoModal(true);
            }}
          >
            ℹ️
          </IconButton>
        </Tooltip>

      </Box>
    ),

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
      const siguienteCodigo = obtenerSiguienteCodigo();
      row._valuesCache.codigo = siguienteCodigo;

      return (
        <>
          <DialogTitle
            variant="h5"
            sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
          >
            Nuevo Producto
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
          Editar Producto
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
          <span className="texto-boton">Nuevo Producto</span>
          <span className="icono-boton">➕</span>
        </Button>
        <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
          <Typography variant="h5" color="primary" className="titulo-lista-insumos">
            Lista de Productos
          </Typography>
        </Box>
      </Box>
    ),

    renderDetailPanel: ({ row }) => {
      if (row.original.codigo !== productoInfo?.codigo) return null;

      return (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr", // ← dos columnas iguales
            gap: 2,
            p: 2,
            backgroundColor: "#2b2b2bff",
            borderRadius: "10px",
            color: "#fff",
          }}
        >
          {/* COLUMNA IZQUIERDA - RECETA */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#1f1f1f",
              borderRadius: "10px",
            }}
          >
            <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
              🧾 Receta de {row.original.nombre}
            </Typography>

            {insumosProducto.length === 0 ? (
              <Typography>No hay receta disponible.</Typography>
            ) : (
              <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
                {insumosProducto.map((insumo, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    <Typography variant="body2">
                      <strong>{insumo.nombreInsumo}</strong> — Cantidad:{" "}
                      {insumo.cantidadNecesaria + " " + insumo.unidad}
                    </Typography>
                  </li>
                ))}
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ mt: 2, px: 3 }}
              onClick={async () => {
                await obtenerInsumosNecesarios(row.original.codigo, row.original.stock);
                setOpenModalReceta(true);
              }}
            >
              Agregar insumo
            </Button>
          </Box>

          {/* COLUMNA DERECHA - TIEMPO PRODUCCIÓN */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#1f1f1f",
              borderRadius: "10px",
            }}
          >
            <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
              ⏱️ Tiempo de Producción
            </Typography>

            <Button
              variant="contained"
              color="warning"
              fullWidth
              sx={{ mt: 1 }}
              onClick={async () => {
                await obtenerTiempoProduccionUnitario(row.original.codigo);
                setOpenModalTiempos(true);
              }}
            >
              Ver Tiempo de Producción
            </Button>

            <Button
              variant="outlined"
              color="success"
              fullWidth
              sx={{ mt: 2 }}
              onClick={async () => {
                await obtenerTiempoProduccionUnitario(row.original.codigo);
                setOpenModalAgregarTiempo(true);
              }}
            >
              Agregar Tiempo de Producción
            </Button>

          </Box>
        </Box>
      );
    },


    renderEmptyRowsFallback: () =>
      error ? (
        <SinResultados mensaje="El servidor no está disponible. Intenta más tarde." />
      ) : (
        <SinResultados mensaje="No hay productos disponibles para mostrar." />
      ),

    state: { isLoading },
  });

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );


  return (
    <>
      <MaterialReactTable table={table} />

      <AddReceta
        open={openModalReceta}
        onClose={() => setOpenModalReceta(false)}
        productoInfo={productoInfo}
      />

      <ModalTiempos
        open={openModalTiempos}
        onClose={() => setOpenModalTiempos(false)}
      />

      <ModalAgregarTiempo
        open={openModalAgregarTiempo}
        onClose={() => setOpenModalAgregarTiempo(false)}
        productoInfo={productoInfo}
      />

      <ModalInfoProducto
        open={openInfoModal}
        onClose={() => setOpenInfoModal(false)}
        productoInfo={productoInfo}
      />

    </>
  );
};

export default TablaProductos;