import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../services/axios.config"; // Importa tu instancia de Axios
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Modal,
} from "@mui/material";

const Login = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  // Validar campos del formulario
  const validateFields = (values) => {
    if (!values.txtUsr) {
      setModalMessage("El Usuario es obligatorio");
      setModalVisible(true);
      return false;
    }
    if (!values.txtPass) {
      setModalMessage("La Clave es obligatoria");
      setModalVisible(true);
      return false;
    }
    return true;
  };

  // Manejar el inicio de sesión
  const handleLogin = async (values, setSubmitting) => {
    try {
      const response = await axiosInstance.post("/auth/", {
        txtUsr: values.txtUsr, // Usuario enviado al backend
        txtPass: values.txtPass, // Contraseña enviada al backend
      });

      if (response.status === 200) {
        
        sessionStorage.setItem("token", response.data.access_token); // Guarda el token en sessionStorage
        sessionStorage.setItem("id_usuario", response.data.id_usuario); // Guarda el id_usuario en sessionStorage
        navigate("/inicio"); // Redirige al inicio
      } else {
        setModalMessage("Usuario o Contraseña Incorrectos.");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.response) {
        setModalMessage(error.response.data.msg || "Credenciales inválidas");
      } else if (error.request) {
        setModalMessage("No se pudo conectar con el servidor.");
      } else {
        setModalMessage("Ocurrió un error inesperado.");
      }
      setModalVisible(true);
    } finally {
      setSubmitting(false); // Restablece el estado del botón
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#fafafa", // Color de fondo de toda la página
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xs" // Tamaño máximo del contenedor
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh", // Centra el contenido verticalmente
          padding: 2, // Espaciado para pantallas pequeñas
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4, // Padding interno del formulario
            width: "100%", // Asegura que ocupe todo el ancho del contenedor
            maxWidth: "400px", // Tamaño máximo del formulario
            boxSizing: "border-box", // Asegura que el padding no afecte el ancho
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" }, // Tamaño responsivo
            }}
          >
            Acceso Administrativo
          </Typography>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" }, // Tamaño responsivo
            }}
          >
            Ingrese Usuario y Contraseña
          </Typography>
          <Formik
            initialValues={{ txtUsr: "", txtPass: "" }}
            onSubmit={(values, { setSubmitting }) => {
              if (validateFields(values)) {
                handleLogin(values, setSubmitting); // Llama a la función para validar con el backend
              } else {
                setSubmitting(false); // Restablece el estado si la validación falla
              }
            }}
          >
            {({ isSubmitting, handleChange, values }) => (
              <Form>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Usuario"
                    name="txtUsr"
                    value={values.txtUsr}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "gray", // Color predeterminado de la etiqueta cuando no está en foco
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "green", // Color de la etiqueta cuando está en foco
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "green", // Cambia el color del borde al enfocarse
                        },
                      },
                    }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Clave"
                    name="txtPass"
                    type="password"
                    value={values.txtPass}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "gray", // Color predeterminado de la etiqueta
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "green", // Color de la etiqueta cuando está en foco
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "primary", // Cambia el color del borde al enfocarse
                        },
                      },
                    }}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Iniciando..." : "INGRESAR"}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>

        {/* Modal de error */}
        <Modal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
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
              textAlign: "center",
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Error de Inicio de Sesión
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              {modalMessage}
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => setModalVisible(false)}
              sx={{ mt: 2 }}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default Login;
