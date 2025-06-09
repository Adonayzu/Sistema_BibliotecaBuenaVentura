import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Modal,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  IconButton,
  Pagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const PALETTE = {
  background: "#f5f6fa",
  paper: "#fff",
  blue: "#3b82f6",
  blueDark: "#2563eb",
  gray: "#6b7280",
};

const ITEMS_PER_PAGE = 5;

const Clientes = () => {
  const [clients, setClients] = useState([
    { id: 1, name: "Oscar Hernández", email: "oscar@mail.com" },
    { id: 2, name: "Ana López", email: "ana@mail.com" },
  ]);
  const [newClient, setNewClient] = useState({ name: "", email: "" });
  const [editingClientId, setEditingClientId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [page, setPage] = useState(1);

  // Validación de email único y formato básico
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEmailUnique = (email, idToExclude = null) => {
    return !clients.some(client => client.email === email && client.id !== idToExclude);
  };

  const handleAddOrUpdateClient = () => {
    if (!newClient.name || !newClient.email) {
      setModalMessage("Todos los campos son obligatorios");
      setModalVisible(true);
      return;
    }
    if (!isEmailValid(newClient.email)) {
      setModalMessage("Formato de correo inválido");
      setModalVisible(true);
      return;
    }
    if (!isEmailUnique(newClient.email, editingClientId)) {
      setModalMessage("El correo ya está en uso");
      setModalVisible(true);
      return;
    }

    if (editingClientId !== null) {
      // Editar cliente existente
      setClients(clients.map(client =>
        client.id === editingClientId ? { ...client, ...newClient } : client
      ));
      setEditingClientId(null);
    } else {
      // Agregar nuevo cliente
      const nextId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
      setClients([...clients, { ...newClient, id: nextId }]);
    }

    setNewClient({ name: "", email: "" });
    setPage(1);
  };

  const handleEdit = (client) => {
    setNewClient({ name: client.name, email: client.email });
    setEditingClientId(client.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar este cliente?")) {
      setClients(clients.filter(client => client.id !== id));
    }
  };

  // Paginación
  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);
  const clientsPaginados = clients.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleChangePage = (event, value) => {
    setPage(value);
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
          maxWidth: 600,
          px: 2,
        }}
      >
        {/* Formulario */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            backgroundColor: PALETTE.paper,
            boxShadow: "0 2px 16px 0 rgba(60,72,88,0.07)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: PALETTE.blue, fontWeight: 700 }}
          >
            Gestión de Clientes
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Nombre completo"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiInputLabel-root": { color: PALETTE.gray },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: PALETTE.blue,
                  },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: PALETTE.blue,
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Correo electrónico"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                variant="outlined"
                sx={{
                  "& .MuiInputLabel-root": { color: PALETTE.gray },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: PALETTE.blue,
                  },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: PALETTE.blue,
                  },
                }}
              />
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleAddOrUpdateClient}
              sx={{
                backgroundColor: PALETTE.blue,
                color: "#fff",
                fontWeight: 600,
                letterSpacing: 1,
                "&:hover": {
                  backgroundColor: PALETTE.blueDark,
                },
              }}
            >
              {editingClientId !== null ? "Actualizar cliente" : "Agregar cliente"}
            </Button>
          </Box>
        </Paper>

        {/* Tabla de clientes */}
        {clients.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, width: "100%" }}>
            <Typography variant="h5" sx={{ color: PALETTE.blue, mb: 2 }}>
              Lista de Clientes
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
                {clientsPaginados.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(client)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(client.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Paginación */}
            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Stack>
          </Paper>
        )}

        {/* Modal de error */}
        <Modal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          aria-labelledby="modal-title"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 350,
              bgcolor: PALETTE.paper,
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography id="modal-title" variant="h6" sx={{ color: PALETTE.blue }}>
              Aviso
            </Typography>
            <Typography sx={{ mt: 2, color: PALETTE.gray }}>{modalMessage}</Typography>
            <Button
              onClick={() => setModalVisible(false)}
              sx={{
                mt: 2,
                backgroundColor: PALETTE.blue,
                color: "#fff",
                "&:hover": {
                  backgroundColor: PALETTE.blueDark,
                },
              }}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default Clientes;
