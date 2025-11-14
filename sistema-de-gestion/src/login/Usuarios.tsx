import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Tabs,
  Tab,
  TableContainer,
  MenuItem,
  TableCell,
  Grid,
} from "@mui/material";
import * as XLSX from "xlsx";
import "../styles/Usuarios.css";
import { useFaceAuth } from "../Context/FaceAuthContext";

const API_BASE = "https://reconocimiento-facial-opxl.onrender.com";
const roles = ["GERENTE", "SUPERVISOR", "ADMINISTRADOR", "OPERARIO"];

const UsuariosPanel: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    legajo: "",
    nombre: "",
    apellido: "",
    email: "",
    rol: "",
  });

  const { user, login, logout } = useFaceAuth(); 

  /** ---- Alta de usuario ---- **/
  const handleAlta = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!res.ok) throw new Error("Error al registrar usuario");

      alert("✅ Usuario creado correctamente");
      setNuevoUsuario({
        legajo: "",
        nombre: "",
        apellido: "",
        email: "",
        rol: "",
      });
      await cargarUsuarios();
      setTab(0);
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  /** ---- Cargar lista ---- **/
  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/usuarios`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setUsuarios(data);
      } else if (Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
      } else {
        console.error("Formato inesperado de respuesta:", data);
        setUsuarios([]);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  /** ---- Descargar Excel ---- **/
  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(usuarios);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  /** ---- Simular autenticación facial ---- **/
  const handleLoginSimulado = async (u: any) => {
    await login(u.legajo, `${u.nombre} ${u.apellido}`);
    alert(`👤 Usuario autenticado: ${u.nombre} ${u.apellido}`);
  };

  useEffect(() => {
    if (tab === 0) cargarUsuarios();
  }, [tab]);

  return (
    <Box p={4}>
      <Box mb={2} textAlign="right">
        {user ? (
          <>
            <Typography variant="subtitle1">
              👤 Sesión activa: {user.nombre} (Legajo {user.legajo})
            </Typography>
            <Button color="error" onClick={logout}>
              Cerrar sesión
            </Button>
          </>
        ) : (
          <Typography variant="subtitle1" color="text.secondary">
            ⚪ No hay usuario autenticado
          </Typography>
        )}
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Ver Usuarios" />
          <Tab label="Alta de Usuario" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <>
          <Grid container justifyContent="space-between" alignItems="center" mb={2}>
            <div>
              <Button
                variant="contained"
                color="secondary"
                onClick={exportarExcel}
                disabled={!usuarios.length}
              >
                Descargar Listado
              </Button>
            </div>
          </Grid>

          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Legajo</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Apellido</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.map((u, i) => (
                    <TableRow key={i}>
                      <TableCell>{u.legajo}</TableCell>
                      <TableCell>{u.nombre}</TableCell>
                      <TableCell>{u.apellido}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.rol}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleLoginSimulado(u)}
                        >
                          Iniciar sesión
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {tab === 1 && (
        <Box maxWidth={400} mx="auto">
          <form onSubmit={handleAlta}>
            <TextField
              fullWidth
              label="Legajo"
              value={nuevoUsuario.legajo}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, legajo: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Nombre"
              value={nuevoUsuario.nombre}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Apellido"
              value={nuevoUsuario.apellido}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={nuevoUsuario.email}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Rol"
              value={nuevoUsuario.rol}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
              }
              required
              margin="normal"
            >
              <MenuItem value="">
                <em>Seleccionar rol...</em>
              </MenuItem>
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Usuario"}
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default UsuariosPanel;