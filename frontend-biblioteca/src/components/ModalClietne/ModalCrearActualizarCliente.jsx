import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import CrearCliente from "../CrudClientes/CrearCliente";
import ActualizarCliente from "../CrudClientes/ActualizarCliente";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid green",
  boxShadow: 50,
  p: 2,
};

const ModalCrearActualizarCliente = ({ open, onClose, cliente, onClienteGuardado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    numero_identificacion: "",
    telefono: "",
    direccion: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (open) {
      if (cliente) {
        setFormData(cliente);
      } else {
        setFormData({
          nombre: "",
          apellido: "",
          correo: "",
          numero_identificacion: "",
          telefono: "",
          direccion: "",
        });
      }
    }
  }, [cliente, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clienteData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        numero_identificacion: formData.numero_identificacion,
        telefono: formData.telefono,
        direccion: formData.direccion,
      };

      if (cliente) {
        await ActualizarCliente({ ...clienteData, id_cliente: cliente.id_cliente });
        setSnackbarMessage("Cliente actualizado correctamente.");
      } else {
        await CrearCliente(clienteData);
        setSnackbarMessage("Cliente creado correctamente.");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
      if (onClienteGuardado) onClienteGuardado();
    } catch (error) {
      const backendMessage = error.response?.data?.msg || "Ocurrió un error al guardar el cliente.";
      setSnackbarMessage(backendMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box component="form" sx={style} onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              component="h2"
              textAlign="center"
              sx={{ fontWeight: "bold" }}
            >
              {cliente ? "Actualizar Cliente" : "Crear Nuevo Cliente"}
            </Typography>
            
            <TextField
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              margin="normal"
              value={formData.nombre}
              onChange={handleChange}
            />
            <TextField
              required
              id="apellido"
              name="apellido"
              label="Apellido"
              fullWidth
              margin="normal"
              value={formData.apellido}
              onChange={handleChange}
            />
            <TextField
              required
              id="correo"
              name="correo"
              label="Correo Electrónico"
              type="email"
              fullWidth
              margin="normal"
              value={formData.correo}
              onChange={handleChange}
            />
            <TextField
              required
              id="numero_identificacion"
              name="numero_identificacion"
              label="Número de Identificación"
              fullWidth
              margin="normal"
              value={formData.numero_identificacion}
              onChange={handleChange}
            />
            <TextField
              required
              id="telefono"
              name="telefono"
              label="Teléfono"
              fullWidth
              margin="normal"
              value={formData.telefono}
              onChange={handleChange}
            />
            <TextField
              required
              id="direccion"
              name="direccion"
              label="Dirección"
              fullWidth
              margin="normal"
              value={formData.direccion}
              onChange={handleChange}
            />
            
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={onClose}
                sx={{ flex: 1, mr: 1 }}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ flex: 1 }}
              >
                {cliente ? "Actualizar Cliente" : "Crear Cliente"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalCrearActualizarCliente;