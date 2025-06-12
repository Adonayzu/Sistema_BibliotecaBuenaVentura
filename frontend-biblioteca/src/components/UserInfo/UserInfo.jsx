import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import { axiosInstance } from "../../services/axios.config";

const UserInfo = () => {
  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario

  // Obtener el nombre del usuario desde la API
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Se obtiene el token del almacenamiento
        const response = await axiosInstance.get("/auth/check_user", {
          headers: {
            Authorization: `Bearer ${token}`, // Envía el token en los headers
          },
        });

        // Si la respuesta es un objeto con el campo 'usuario'
        const userData = response.data;
        if (userData && userData.usuario) {
          setUserName(userData.usuario); // Solo el campo usuario
        } else {
          setUserName("Usuario desconocido");
        }
      } catch (error) {
        setUserName("Usuario desconocido"); // Mensaje por defecto en caso de error
      }
    };

    fetchUserName();
  }, []);

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 1.5 }}>
      {/* Ícono de usuario */}
      <IconButton variant="contained">
        <PersonIcon sx={{ fontSize: 40, color: "black" }} />
      </IconButton>
      {/* Nombre del usuario */}
      <Typography variant="body1" sx={{ marginLeft: 1, color: "black", fontWeight: "bold" }}>
        {userName}
      </Typography>
    </Box>
  );
};

export default UserInfo;