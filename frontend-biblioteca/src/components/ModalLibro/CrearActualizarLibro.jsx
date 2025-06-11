import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";
import CrearLibro from "../crudLibros/CrearLibro";
import ActualizarLibro from "../crudLibros/ActualizarLibro";

const CrearActualizarLibro = ({ open, onClose, libro, onLibroGuardado }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    isbn: "",
    anio_publicacion: "",
    nombre_autor: "",
    nombre_editorial: "",
    cantidad_disponible: "",
    cantidad_total: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (libro) {
      setFormData(libro); // Si hay un libro, carga sus datos para actualizar
    } else {
      setFormData({
        titulo: "",
        isbn: "",
        anio_publicacion: "",
        nombre_autor: "",
        nombre_editorial: "",
        cantidad_disponible: "",
        cantidad_total: "",
      }); // Si no hay libro, inicializa los campos vacíos para crear
    }
  }, [libro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async () => {
  try {
    if (libro && !formData.id_libro) {
      setErrorMessage("El ID del libro es requerido para actualizar.");
      return;
    }

    if (libro) {
      // Actualizar libro
      await ActualizarLibro(formData);
    } else {
      // Crear libro
      await CrearLibro(formData);
    }
    onLibroGuardado(); // Llama a la función para actualizar la lista de libros
    onClose(); // Cierra el modal
  } catch  {
    setErrorMessage(
      libro
        ? "Error al actualizar el libro. Intenta nuevamente."
        : "Error al crear el libro. Intenta nuevamente."
    );
  }
};
  return (
    <Modal open={open} onClose={onClose}>
      <Box
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
          {libro ? "Actualizar Libro" : "Crear Nuevo Libro"}
        </Typography>
        {[
          { label: "Título", name: "titulo" },
          { label: "ISBN", name: "isbn" },
          { label: "Año de publicación", name: "anio_publicacion", type: "number" },
          { label: "Autor", name: "nombre_autor" },
          { label: "Editorial", name: "nombre_editorial" },
          { label: "Cantidad disponible", name: "cantidad_disponible", type: "number" },
          { label: "Cantidad total", name: "cantidad_total", type: "number" },
        ].map((field) => (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            value={formData[field.name]}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        ))}
        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          {libro ? "Actualizar" : "Guardar"}
        </Button>
      </Box>
    </Modal>
  );
};

export default CrearActualizarLibro;