import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_EditActionButtons, type MRT_Row, } from "material-react-table";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { ProductosContext, type Producto } from "../../../Context/ProductosContext";
import { RecetaContext, type Receta } from "../../../Context/RecetaContext";
import { TiempoProduccionContext } from "../../../Context/TiempoProduccionContext";
import { InsumoContext } from "../../../Context/InsumoContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SinResultados from "../../estaticos/SinResultados";
import { FaceAuthContext } from "../../../Context/FaceAuthContext";


const ESTILOS_CABECERA = { style: { color: "#15a017ff" } };

const TablaProductos: React.FC = () => {
  const { productos, isLoading, error, handleAddProducto, handleEditProducto, handleDeleteProducto, obtenerSiguienteCodigo } = useContext(ProductosContext)!;
  const { insumosProducto, obtenerInsumosNecesarios, agregarInsumoAReceta } = useContext(RecetaContext)!;
  const { insumos } = useContext(InsumoContext)!;
  const { user } = useContext(FaceAuthContext)!;
  const { agregarTiempoProduccion, obtenerTiempoProduccionUnitario, tiempoProduccionUnitario } = useContext(TiempoProduccionContext)!;
  const [productoSeleccionado, setProductoSeleccionado] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [openModalReceta, setOpenModalReceta] = useState(false);
  const [codigoProducto, setCodigoProducto] = useState("");
  const [nuevoInsumo, setNuevoInsumo] = useState<Receta>({
    codigoInsumo: "",
    nombreInsumo: "",
    cantidadNecesaria: 1,
    unidad: ""
  });


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
    [validationErrors]
  );

  const validarProducto = (producto: Partial<Producto>) => {
    const errores: Record<string, string> = {};
    if (!producto.nombre?.trim()) errores.nombre = "Nombre requerido";
    if (!producto.categoria?.trim()) errores.categoria = "Categoría requerida";
    if (!producto.linea?.trim()) errores.linea = "Línea requerida";
    if (!producto.presentacion?.trim()) errores.presentacion = "Presentación requerida";
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
    // await handleAddProducto(values);

    const codigo = values.codigo && values.codigo.trim() !== ""
      ? values.codigo
      : obtenerSiguienteCodigo();

    const nuevoProducto: Producto = {
      ...values, codigo, stock: 0,
      legajoResponsable: values.legajo && values.legajo.trim() !== "" ? values.legajo : "100",
    };
    await handleAddProducto(nuevoProducto);

    table.setCreatingRow(null);
  };

  const handleEditarProducto = async ({ values, exitEditingMode }: any) => {
    const errores = validarProducto(values);
    if (Object.keys(errores).length > 0) {
      setValidationErrors(errores);
      return;
    }
    setValidationErrors({});
    await handleEditProducto(values);
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
    positionActionsColumn: 'last',
    enableGlobalFilter: true,
    editDisplayMode: "modal",
    enableEditing: true,
    positionExpandColumn: 'last',
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
              await obtenerTiempoProduccionUnitario(row.original.codigo);
              setProductoSeleccionado(row.original.codigo);
              row.toggleExpanded();
            }}
          >
            🧾
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
    renderEmptyRowsFallback: () =>
      error ? (
        <SinResultados mensaje="El servidor no está disponible. Intenta más tarde." />
      ) : (
        <SinResultados mensaje="No hay productos disponibles para mostrar." />
      ),
    renderDetailPanel: ({ row }) => {
      if (row.original.codigo !== productoSeleccionado) return null;

      return (
        <Box
          sx={{
            mt: 1,
            p: 2,
            backgroundColor: "#2b2b2b",
            borderRadius: "10px",
            color: "#fff",
            width: "50%",
          }}
        >
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
            🧾 Receta para {row.original.nombre}
          </Typography>

          {insumosProducto.length === 0 ? (
            <Typography>No hay receta disponible.</Typography>
          ) : (
            <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
              {insumosProducto.map((insumo) => (
                <li key={insumo.codigoInsumo} style={{ marginBottom: "8px" }}>
                  <Typography variant="body2">
                    <strong>{insumo.nombreInsumo}</strong> — Cantidad: {insumo.cantidadNecesaria + " " + insumo.unidad}
                  </Typography>
                </li>

              ))}
              <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                Tiempo de produccion unitario: {tiempoProduccionUnitario.tiempoProduccion} hs.
              </Typography>
            </Box>
          )}

          <Tooltip title="Agregar Insumo a Receta">
            <IconButton
              color="secondary"
              onClick={() => {
                setCodigoProducto(row.original.codigo);
                setNuevoInsumo({ codigoInsumo: "", nombreInsumo: "", cantidadNecesaria: 1, unidad: "gr." });
                setOpenModalReceta(true);
              }}
            >
              ➕
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar tiempo de producción">
            <IconButton
              color="secondary"
              disabled={tiempoProduccionUnitario !== null && tiempoProduccionUnitario.tiempoProduccion > 0}
              onClick={() => {
                const tiempo = prompt("Ingrese el tiempo de producción (en horas):");
                if (tiempo) {
                  agregarTiempoProduccion(row.original.codigo, parseInt(tiempo));
                }
              }}
            >
              ⏱️
            </IconButton>
          </Tooltip>


        </Box>
      );
    },

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
      <Dialog
        open={openModalReceta}
        onClose={() => setOpenModalReceta(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
        >
          Agregar Insumo a Receta
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>
          <TextField
            label="Código del Producto"
            value={codigoProducto}
            disabled
            fullWidth
          />

          <TextField
            select
            // label="Código del Insumo"
            value={nuevoInsumo.codigoInsumo}
            onChange={(e) => {
              const codigo = e.target.value;
              const insumoSeleccionado = insumos.find(i => i.codigo === codigo);
              setNuevoInsumo({
                ...nuevoInsumo,
                codigoInsumo: codigo,
                nombreInsumo: insumoSeleccionado ? insumoSeleccionado.nombre : "",
              });
            }}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="">Seleccione un insumo</option>
            {insumos.map((i) => (
              <option key={i.codigo} value={i.codigo}>
                {i.codigo + " - " + i.nombre + " - " + i.marca}
              </option>
            ))}
          </TextField>

          <TextField
            label="Cantidad Necesaria"
            type="number"
            value={nuevoInsumo.cantidadNecesaria}
            onChange={(e) =>
              setNuevoInsumo({
                ...nuevoInsumo,
                cantidadNecesaria: Number(e.target.value),
              })
            }
            fullWidth
          />

          <TextField
            select
            label="Unidad"
            type="text"
            value={nuevoInsumo.unidad}
            onChange={(e) =>
              setNuevoInsumo({
                ...nuevoInsumo,
                unidad: e.target.value,
              })
            }
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="Unidades"> Unidades </option>
            <option value="Miligramos"> Miligramos </option>
            <option value="Gramos"> Gramos </option>
            <option value="Litros"> Litros </option>
            <option value="Kilogramos"> Kilogramos </option>

          </TextField>

        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await agregarInsumoAReceta(codigoProducto, nuevoInsumo);
              setOpenModalReceta(false);
            }}
          >
            Guardar
          </Button>
          <Button onClick={() => setOpenModalReceta(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default TablaProductos;