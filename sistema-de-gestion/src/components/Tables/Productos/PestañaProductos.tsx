import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_EditActionButtons, type MRT_Row, } from "material-react-table";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { ProductosContext, type Producto } from "../../../Context/ProductosContext";
import { RecetaContext, type Receta } from "../../../Context/RecetaContext";
import { TiempoProduccionContext, type TiempoProduccion } from "../../../Context/TiempoProduccionContext";
import { InsumoContext } from "../../../Context/InsumoContext";
import { FaceAuthContext } from "../../../Context/FaceAuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SinResultados from "../../estaticos/SinResultados";
import { useToUpper } from "../../../hooks/useToUpper";




const ESTILOS_CABECERA = { style: { color: "#15a017ff" } };

const TablaProductos: React.FC = () => {
  const { productos, isLoading, error, handleAddProducto, handleEditProducto, handleDeleteProducto, obtenerSiguienteCodigo } = useContext(ProductosContext)!;
  const { insumosProducto, obtenerInsumosNecesarios, agregarInsumoAReceta } = useContext(RecetaContext)!;
  const { insumos } = useContext(InsumoContext)!;
  const { user } = useContext(FaceAuthContext)!;
  const { obtenerTiempoProduccionUnitario, agregarTiempoProduccion, tiempoProduccion } = useContext(TiempoProduccionContext)!;
  const [productoSeleccionado, setProductoSeleccionado] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [openModalReceta, setOpenModalReceta] = useState(false);
  const [codigoProducto, setCodigoProducto] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [nuevoInsumo, setNuevoInsumo] = useState<Receta>({
    codigoInsumo: "",
    nombreInsumo: "",
    cantidadNecesaria: 1,
    unidad: ""
  });
  const [openModalTiempos, setOpenModalTiempos] = useState(false);
  const { toUpperObject } = useToUpper();
  const [openModalAgregarTiempo, setOpenModalAgregarTiempo] = useState(false);
  const [nuevoTiempo, setNuevoTiempo] = useState<TiempoProduccion>({
    codigoProducto: "",
    tiempoPreparacion: 0,
    tiempoCiclo: 0,
    maximoTanda: 1,
  });
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [productoInfo, setProductoInfo] = useState<Producto | null>(null);




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
        legajoResponsable:false,
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
              setProductoSeleccionado(row.original.codigo);
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
                {insumosProducto.map((insumo) => (
                  <li key={insumo.codigoInsumo} style={{ marginBottom: "8px" }}>
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
                setProductoSeleccionado(row.original.codigo);
                setCodigoProducto(row.original.codigo)
                setCantidad(row.original.stock)
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
                const tiempo = await obtenerTiempoProduccionUnitario(row.original.codigo);

                setNuevoTiempo({
                  codigoProducto: row.original.codigo,
                  tiempoPreparacion: tiempo?.tiempoPreparacion ?? 0,
                  tiempoCiclo: tiempo?.tiempoCiclo ?? 0,
                  maximoTanda: tiempo?.cantidadMaximaTanda ?? 1,
                });

                // 3. Abrir modal
                setOpenModalAgregarTiempo(true);
              }}

            >
              Agregar Tiempo de Producción
            </Button>

          </Box>
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
            sx={{ mt: 1 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            select
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
              await obtenerInsumosNecesarios(codigoProducto, cantidad);

              setOpenModalReceta(false);
            }}
          >
            Guardar
          </Button>

          <Button onClick={() => setOpenModalReceta(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openModalTiempos}
        onClose={() => setOpenModalTiempos(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
        >
          Tiempo de Producción
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>
          <Typography><b>Preparación:</b> {tiempoProduccion?.tiempoPreparacion ?? "-"} Min.</Typography>
          <Typography><b>Ciclos:</b> {tiempoProduccion?.tiempoCiclo ?? "-"} </Typography>
          <Typography><b>Tanda Máxima:</b> {tiempoProduccion?.cantidadMaximaTanda ?? "-"}</Typography>
          <Typography><b>Total:</b> {tiempoProduccion?.tiempoTotal ?? "-"} Min.</Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => setOpenModalTiempos(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>



      {/* Modal para AGREGAR TIEMPO */}
      <Dialog
        open={openModalAgregarTiempo}
        onClose={() => setOpenModalAgregarTiempo(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
        >
          Registrar Tiempo de Producción
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>
          <TextField
            label="Código del Producto"
            value={nuevoTiempo.codigoProducto}
            disabled
            fullWidth
          />

          <TextField
            label="Tiempo de Preparación (hs)"
            type="number"
            value={nuevoTiempo.tiempoPreparacion}
            onChange={(e) =>
              setNuevoTiempo({
                ...nuevoTiempo,
                tiempoPreparacion: Number(e.target.value),
              })
            }
            fullWidth
          />

          <TextField
            label="Tiempo de Ciclo (hs)"
            type="number"
            value={nuevoTiempo.tiempoCiclo}
            onChange={(e) =>
              setNuevoTiempo({
                ...nuevoTiempo,
                tiempoCiclo: Number(e.target.value),
              })
            }
            fullWidth
          />

          <TextField
            label="Máximo por Tanda"
            type="number"
            value={nuevoTiempo.maximoTanda}
            onChange={(e) =>
              setNuevoTiempo({
                ...nuevoTiempo,
                maximoTanda: Number(e.target.value),
              })
            }
            fullWidth
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
          <Button
            variant="contained"
            onClick={async () => {
              // validaciones mínimas
              if (!nuevoTiempo.codigoProducto) return;
              await agregarTiempoProduccion(nuevoTiempo);
              // opcional: actualizar el tiempo mostrado
              await obtenerTiempoProduccionUnitario(nuevoTiempo.codigoProducto);
              setOpenModalAgregarTiempo(false);
            }}
          >
            Guardar
          </Button>
          <Button onClick={() => setOpenModalAgregarTiempo(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>



      <Dialog
        open={openInfoModal}
        onClose={() => setOpenInfoModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
        >
          Información del Producto
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>
          {productoInfo && (
            <>
              <Typography><b>Código:</b> {productoInfo.codigo}</Typography>
              <Typography><b>Nombre:</b> {productoInfo.nombre}</Typography>
              <Typography><b>Categoría:</b> {productoInfo.categoria}</Typography>
              <Typography><b>Línea:</b> {productoInfo.linea}</Typography>
              <Typography><b>Presentación:</b> {productoInfo.presentacion} {productoInfo.unidad}</Typography>
              <Typography><b>Stock:</b> {productoInfo.stock}</Typography>
              <Typography><b>Fecha Creación:</b> {productoInfo.fechaCreacion}</Typography>
              <Typography>
                <b>Responsable:</b> {productoInfo.legajo} - {productoInfo.responsableApellido} {productoInfo.responsableNombre}
              </Typography>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => setOpenInfoModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default TablaProductos;