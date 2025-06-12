import { axiosInstance } from "../../services/axios.config";

const EliminarRol = async (idRol) => {
  try {
    // Obtener el token de sesión
    const token = sessionStorage.getItem("token");

    // Realizar la solicitud DELETE al backend
    const response = await axiosInstance.delete(`/roles/eliminar_rol/${idRol}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token en los headers
      },
    });

    // Devolver la respuesta de la API
    return response.data;
  } catch (error) {
    // Manejo de errores
    console.error("Error al eliminar el rol:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default EliminarRol;