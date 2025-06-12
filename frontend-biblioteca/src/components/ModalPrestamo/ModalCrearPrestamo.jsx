import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import AsignarPrestamo from "../CrudPrestamos/AsignarPrestamo";
import ObtenerClientes from "../CrudClientes/ObtenerClientes";
import ObtenerLibros from "../CrudLibros/ObtenerLibros";

const ModalCrearPrestamo = ({ open, onClose, onPrestamoGuardado }) => {
  const [formData, setFormData] = useState({
    id_cliente: "",
    id_libro: "",
    observaciones: "",
  });
  const [clientes, setClientes] = useState([]);
  const [libros, setLibros] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const clientesData = await ObtenerClientes();
        const librosData = await ObtenerLibros();
        setClientes(clientesData);
        setLibros(librosData);
      } catch (error) {
        console.error("Error al cargar clientes o libros:", error);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    try {
      // Validar que los campos requeridos estén completos
      if (!formData.id_cliente || !formData.id_libro || !formData.observaciones.trim()) {
        setSnackbarMessage("Todos los campos son obligatorios.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return; // Detener el envío
      }

      // Enviar los datos al backend
      await AsignarPrestamo(formData);
      setSnackbarMessage("Préstamo asignado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onPrestamoGuardado(); // Refrescar la lista de préstamos
      onClose(); // Cerrar el modal
    } catch (error) {
      const backendMessage = error.response?.data?.msg || "Error desconocido.";
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
      <Modal open={open} onClose={onClose}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Asignar Nuevo Préstamo
          </Typography>
          <Autocomplete
            options={clientes}
            getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
            onChange={(event, value) =>
              setFormData((prev) => ({
                ...prev,
                id_cliente: value?.id_cliente || "",
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Cliente"
                sx={{ mb: 2 }}
              />
            )}
          />
          <Autocomplete
            options={libros}
            getOptionLabel={(option) => option.titulo}
            onChange={(event, value) =>
              setFormData((prev) => ({
                ...prev,
                id_libro: value?.id_libro || "",
              }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Seleccionar Libro" sx={{ mb: 2 }} />
            )}
          />
          <TextField
            required
            fullWidth
            label="Observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Asignar Préstamo
          </Button>
        </Box>
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

export default ModalCrearPrestamo;