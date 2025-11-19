import React, { useState, useMemo } from "react";
import {
  Box, Button, DialogActions, DialogContent, DialogTitle,
  Typography, CircularProgress,
  Paper,
  Tooltip,
  IconButton
} from "@mui/material";

import * as XLSX from "xlsx";
import {
  MaterialReactTable,
  MRT_EditActionButtons,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import { useFaceAuth } from "../Context/FaceAuthContext";
import { useUsuarios, type Empleado } from "../Context/UsuarioContext";
import SinResultados from "../components/estaticos/SinResultados";
import '../styles/tablas.css'
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";


const ESTILOS_CABECERA = { style: { color: "#15a017ff" } };
const roles = ["GERENTE", "SUPERVISOR", "ADMINISTRADOR", "OPERARIO"];


const TablaUsuarios: React.FC = () => {
  const { empleados, cargando, agregarEmpleado, error, isLoading, eliminarEmpleado } = useUsuarios();
  const { login, logout, user } = useFaceAuth();
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const navigate = useNavigate();
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



  /** ------------------------------------------------------------------
   * COLUMNAS DE LA TABLA
   * ------------------------------------------------------------------ */
  const columns = useMemo<MRT_ColumnDef<Empleado>[]>(() => [
    {
      accessorKey: "legajo",
      header: "Legajo",
      muiTableHeadCellProps: ESTILOS_CABECERA,
      muiEditTextFieldProps: baseTextFieldProps("legajo"),
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
      muiTableHeadCellProps: ESTILOS_CABECERA,
      muiEditTextFieldProps: baseTextFieldProps("nombre"),
    },
    {
      accessorKey: "apellido",
      header: "Apellido",
      muiTableHeadCellProps: ESTILOS_CABECERA,
      muiEditTextFieldProps: baseTextFieldProps("apellido"),
    },
    {
      accessorKey: "area",
      header: "Área",
      muiTableHeadCellProps: ESTILOS_CABECERA,
      muiEditTextFieldProps: baseTextFieldProps("area"),
    },
    {
      accessorKey: "rol",
      header: "Rol",
      editVariant: "select",
      editSelectOptions: roles,
      muiTableHeadCellProps: ESTILOS_CABECERA,
      muiEditTextFieldProps: baseTextFieldProps("rol"),
    },
  ], [validationErrors]);

  /** ------------------------------------------------------------------
 * GUARDAR NUEVO EMPLEADO
 * ------------------------------------------------------------------ */
  const handleGuardar = async ({ values, table }: any) => {
    const errores = validarUsuario(values);
    if (Object.keys(errores).length) {
      setValidationErrors(errores);
      return;
    }

    setValidationErrors({});
    await agregarEmpleado(values);
    table.setCreatingRow(null);
  };


  /** ------------------------------------------------------------------
   * LOGIN SIMULADO
   * ------------------------------------------------------------------ */
  const handleLoginSimulado = async (u: Empleado) => {
    await login(u.legajo, `${u.nombre} ${u.apellido}`);
    alert(`👤 Usuario autenticado: ${u.nombre} ${u.apellido}`);
  };

  /** ------------------------------------------------------------------
   * EXPORTACIÓN EXCEL
   * ------------------------------------------------------------------ */
  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(empleados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  /** ------------------------------------------------------------------
 * VALIDACIÓN
 * ------------------------------------------------------------------ */
  const validarUsuario = (u: Partial<Empleado>) => {
    const errores: Record<string, string> = {};
    if (!u.legajo?.trim()) errores.legajo = "Legajo requerido";
    if (!u.nombre?.trim()) errores.nombre = "Nombre requerido";
    if (!u.apellido?.trim()) errores.apellido = "Apellido requerido";
    if (!u.area?.trim()) errores.area = "Área requerida";
    if (!u.rol?.trim()) errores.rol = "Rol requerido";
    return errores;
  };

  /** ------------------------------------------------------------------
   * CONFIGURACIÓN DE LA TABLA
   * ------------------------------------------------------------------ */
  const table = useMaterialReactTable({
    columns,
    data: empleados,
    createDisplayMode: "modal",
    enableRowActions: true,
    enableGlobalFilter: true,
    editDisplayMode: "modal",
    enableEditing: true,
    positionActionsColumn: "last",
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0
      },
      density: "compact",
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
    getRowId: (row) => row.legajo,

    // Crear nuevo usuario
    onCreatingRowSave: handleGuardar,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),

    // Modal de creación
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
        >
          Nuevo Usuario
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

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <MRT_EditActionButtons table={table} row={row} />
        </DialogActions>
      </>
    ),

    /** ---- BOTONES SUPERIORES ---- */
    renderTopToolbarCustomActions: ({ table }) => (
      <Box display="flex" gap={2} alignItems="center" width="100%">
        <Button
          onClick={() => navigate("/")}
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
            "&:hover": { backgroundColor: "#444" },
          }}
        >
          <IoArrowBackCircleSharp size={28} style={{ color: "#ff4b4b" }} />
        </Button>


        <Button variant="contained" color="success" onClick={() => table.setCreatingRow(true)}>
          Nuevo Usuario
        </Button>

        <Button variant="contained" onClick={exportarExcel}>
          Descargar Listado
        </Button>

        <Box marginLeft="auto">
          {user ? (
            <>
              <Typography color="green">👤 Sesión activa: {user.nombre}</Typography>
              <Button color="error" onClick={logout}>Cerrar sesión</Button>
            </>
          ) : (
            <Typography color="text.secondary">⚪ Sin usuario autenticado</Typography>
          )}
        </Box>
      </Box>
    ),

    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        {/* <Button variant="outlined" onClick={() => handleLoginSimulado(row.original)}>
          Iniciar Sesión
        </Button> */}
        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={async () =>  await eliminarEmpleado(row.original.legajo)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    renderEmptyRowsFallback: () =>
      error ? (
        <SinResultados mensaje="El servidor no está disponible. Intenta más tarde." />
      ) : (
        <SinResultados mensaje="No hay usuarios disponibles." />
      ),

    state: { isLoading },
  });

  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
        p: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "1400px",
          borderRadius: 2,
          p: 3,
          backgroundColor: "#1e1e1e",
        }}
      >
        <MaterialReactTable table={table} />
      </Paper>
    </Box>
  );


};

export default TablaUsuarios;
