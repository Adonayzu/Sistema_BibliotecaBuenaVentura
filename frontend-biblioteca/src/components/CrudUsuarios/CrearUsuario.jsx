
import { axiosInstance } from '../../services/axios.config';
const CrearUsuario = async (usuarioData) => {
    try {
      const token = sessionStorage.getItem("token"); // Obtener el token de sesión
      const response = await axiosInstance.post("/usuarios/create_user", usuarioData, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token en los headers
          "Content-Type": "application/json", // Especificar el tipo de contenido
        },
      });
      return response.data; // Devolver la respuesta de la API
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  };

export default CrearUsuario;
