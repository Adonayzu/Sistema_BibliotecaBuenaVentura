import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";
import CrearCliente from "../crudClientes/CrearCliente";
import ActualizarCliente from "../crudClientes/ActualizarCliente";

const ModalCrearActualizarCliente = ({
  open,
  onClose,
  cliente,
  onClienteGuardado,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    numero_identificacion: "",
    telefono: "",
    direccion: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (cliente) {
      setFormData(cliente); // Si hay un cliente, carga sus datos para actualizar
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        numero_identificacion: "",
        telefono: "",
        direccion: "",
      }); // Si no hay cliente, inicializa los campos vacíos para crear
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      let response;
      if (cliente) {
        // Actualizar cliente
        response = await ActualizarCliente(formData);
      } else {
        // Crear cliente
        response = await CrearCliente(formData);
      }

      // Verificar si el backend devuelve un mensaje de éxito
      if (response?.msg) {
        setErrorMessage(""); // Limpiar cualquier mensaje de error previo
        onClienteGuardado(); // Llama a la función para actualizar la lista de clientes
        onClose(); // Cierra el modal
      }
    } catch (error) {
      // Capturar el mensaje de error del backend
      const backendMessage = error.response?.data?.msg || "Error desconocido.";
      setErrorMessage(backendMessage);
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
          {cliente ? "Actualizar Cliente" : "Crear Nuevo Cliente"}
        </Typography>
        {[
          { label: "Nombre", name: "nombre" },
          { label: "Apellido", name: "apellido" },
          { label: "Correo Electrónico", name: "correo", type: "email" },
          { label: "Número de Identificación", name: "numero_identificacion" },
          { label: "Teléfono", name: "telefono" },
          { label: "Dirección", name: "direccion" },
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
          {cliente ? "Actualizar" : "Guardar"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalCrearActualizarCliente;
