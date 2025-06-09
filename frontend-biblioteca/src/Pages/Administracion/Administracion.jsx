import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const PALETTE = {
  background: "#f5f6fa",
  paper: "#fff",
  blue: "#3b82f6",
  gray: "#6b7280",
};

const Administracion = () => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Admin", correo: "admin@mail.com" },
    { id: 2, nombre: "Oscar Hernández", correo: "oscar@mail.com" },
  ]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", correo: "" });
  const [editingId, setEditingId] = useState(null);

  const handleAddOrUpdate = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.correo) return;
    if (editingId !== null) {
      setUsuarios(usuarios.map(u =>
        u.id === editingId ? { ...u, ...nuevoUsuario } : u
      ));
      setEditingId(null);
    } else {
      setUsuarios([
        ...usuarios,
        { ...nuevoUsuario, id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1 },
      ]);
    }
    setNuevoUsuario({ nombre: "", correo: "" });
  };

  const handleEdit = (usuario) => {
    setNuevoUsuario({ nombre: usuario.nombre, correo: usuario.correo });
    setEditingId(usuario.id);
  };

  const handleDelete = (id) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: PALETTE.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          maxWidth: 700,
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: PALETTE.paper,
            boxShadow: "0 2px 16px 0 rgba(60,72,88,0.07)",
            width: "100%",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: PALETTE.blue, fontWeight: 700 }}
          >
            Administración
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: PALETTE.gray, mb: 2 }}
          >
            Gestión de usuarios del sistema
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Nombre"
              value={nuevoUsuario.nombre}
              onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
              fullWidth
            />
            <TextField
              label="Correo"
              value={nuevoUsuario.correo}
              onChange={e => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
              fullWidth
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: PALETTE.blue,
                color: "#fff",
                fontWeight: 600,
                "&:hover": { backgroundColor: PALETTE.gray },
              }}
              onClick={handleAddOrUpdate}
            >
              {editingId !== null ? "Actualizar" : "Agregar"}
            </Button>
          </Stack>
          <Typography variant="h6" sx={{ color: PALETTE.gray, mb: 1 }}>
            Usuarios registrados
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map(usuario => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.id}</TableCell>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEdit(usuario)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(usuario.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: PALETTE.paper,
            boxShadow: "0 2px 16px 0 rgba(60,72,88,0.07)",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ color: PALETTE.gray }}
          >
            Configuraciones generales
          </Typography>
          {/* Aquí puedes agregar más configuraciones */}
        </Paper>
      </Container>
    </Box>
  );
};

export default Administracion;