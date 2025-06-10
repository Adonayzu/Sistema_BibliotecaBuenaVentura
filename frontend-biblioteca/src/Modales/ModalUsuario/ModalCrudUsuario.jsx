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
import CrearUsuario from "../../components/CrudUsuarios/CrearUsuario";
import ActualizarUsuario from "../../components/CrudUsuarios/ActualizarUsuario";

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

const ModalCrudUsuario = ({
  open,
  onClose,
  onUsuarioCreado,
  usuario,
  onExited,
}) => {
  const [formData, setFormData] = useState({
    
    usuario: "",
    clave: "",

  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (open) {
      if (usuario) {
        setFormData({
          ...usuario,
          clave: "", // No mostrar la clave anterior
        });
      } else {
        setFormData({
          usuario: "",
          clave: "",
          
        });
      }
    }
  }, [usuario, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (usuario) {
        await ActualizarUsuario({ ...formData, id_usuario: usuario.id_usuario });
        setSnackbarMessage("Usuario actualizado correctamente.");
      } else {
        await CrearUsuario(formData);
        setSnackbarMessage("Usuario creado correctamente.");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
      if (onUsuarioCreado) onUsuarioCreado();
    } catch (error) {
      setSnackbarMessage("Ocurrió un error al guardar el usuario.");
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
        onExited={onExited}
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
              {usuario ? "Actualizar Usuario" : "Crear Nuevo Usuario"}
            </Typography>
            
            <TextField
              required
              id="usuario"
              name="usuario"
              label="Usuario"
              fullWidth
              margin="normal"
              value={formData.usuario}
              onChange={handleChange}
            />
            <TextField
              required={!usuario}
              id="clave"
              name="clave"
              label={usuario ? "Clave (opcional)" : "Clave"}
              type="password"
              fullWidth
              margin="normal"
              value={formData.clave}
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
                {usuario ? "Actualizar Usuario" : "Crear Usuario"}
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

export default ModalCrudUsuario;