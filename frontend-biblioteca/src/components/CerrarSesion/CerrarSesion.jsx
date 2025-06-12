import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../services/axios.config";

const CerrarSesion = () => {
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    const cerrarSesion = async () => {
      try {
        // Llama a la API para cerrar sesión
        await axiosInstance.post("/logout", {}, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Envía el token JWT
          },
        });

        // Elimina el token del almacenamiento
        sessionStorage.removeItem("token");

        // Redirige al login
        navigate("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // Redirige al login incluso si hay un error
        navigate("/");
      }
    };

    cerrarSesion(); // Llama a la función para cerrar sesión
  }, [navigate]); 

  return <div>Cerrando sesión...</div>; // Mensaje mientras se cierra la sesión
};

export default CerrarSesion;