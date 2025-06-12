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
import CrearLibro from "../CrudLibros/CrearLibro";
import ActualizarLibro from "../CrudLibros/ActualizarLibro";

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

const CrearActualizarLibro = ({ open, onClose, libro, onLibroGuardado }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    isbn: "",
    anio_publicacion: "",
    nombre_autor: "",
    nombre_editorial: "",
    cantidad_disponible: "",
    cantidad_total: "",
    observaciones: ""
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (open) {
      if (libro) {
        setFormData(libro);
      } else {
        setFormData({
          titulo: "",
          isbn: "",
          anio_publicacion: "",
          nombre_autor: "",
          nombre_editorial: "",
          cantidad_disponible: "",
          cantidad_total: "",
          observaciones: ""
        });
      }
    }
  }, [libro, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const libroData = {
        titulo: formData.titulo,
        isbn: formData.isbn,
        anio_publicacion: formData.anio_publicacion,
        nombre_autor: formData.nombre_autor,
        nombre_editorial: formData.nombre_editorial,
        cantidad_disponible: formData.cantidad_disponible,
        cantidad_total: formData.cantidad_total,
        };

        if (libro) {
        await ActualizarLibro({ ...libroData, id_libro: libro.id_libro });
        setSnackbarMessage("Libro actualizado correctamente.");
        } else {
        await CrearLibro(libroData);
        setSnackbarMessage("Libro creado correctamente.");
        }
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        onClose();
        if (onLibroGuardado) onLibroGuardado();
    } catch (error) {
        // Mostrar el mensaje de error devuelto por el backend
        const backendMessage = error.response?.data?.msg || "Ocurrió un error al guardar el libro.";
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
              {libro ? "Actualizar Libro" : "Crear Nuevo Libro"}
            </Typography>
            
            <TextField
              required
              id="titulo"
              name="titulo"
              label="Título"
              fullWidth
              margin="normal"
              value={formData.titulo}
              onChange={handleChange}
            />
            <TextField
              required
              id="isbn"
              name="isbn"
              label="ISBN"
              fullWidth
              margin="normal"
              value={formData.isbn}
              onChange={handleChange}
            />
            <TextField
              required
              id="anio_publicacion"
              name="anio_publicacion"
              label="Año de publicación"
              type="number"
              fullWidth
              margin="normal"
              value={formData.anio_publicacion}
              onChange={handleChange}
            />
            <TextField
              required
              id="nombre_autor"
              name="nombre_autor"
              label="Autor"
              fullWidth
              margin="normal"
              value={formData.nombre_autor}
              onChange={handleChange}
            />
            <TextField
              required
              id="nombre_editorial"
              name="nombre_editorial"
              label="Editorial"
              fullWidth
              margin="normal"
              value={formData.nombre_editorial}
              onChange={handleChange}
            />

            <TextField
              required
              id="cantidad_disponible"
              name="cantidad_disponible"
              label="Cantidad disponible"
              type="number"
              fullWidth
              margin="normal"
              value={formData.cantidad_disponible}
              onChange={handleChange}
            />
            <TextField
              required
              id="cantidad_total"
              name="cantidad_total"
              label="Cantidad total"
              type="number"
              fullWidth
              margin="normal"
              value={formData.cantidad_total}
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
                {libro ? "Actualizar Libro" : "Crear Libro"}
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

export default CrearActualizarLibro;