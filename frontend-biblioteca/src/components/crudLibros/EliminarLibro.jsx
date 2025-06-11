import { axiosInstance } from "../../services/axios.config"; 

const EliminarLibro = async (idLibro) => {
  try {
    const token = sessionStorage.getItem("token"); // Obtener el token de sesión
    const response = await axiosInstance.delete(`/libros/${idLibro}`, {
      headers: {
        Authorization: `Bearer ${token}`, 

      },
    });
    return response.data; // Devolver la respuesta de la API
  } catch (error) {
    console.error("Error al eliminar el libro:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default EliminarLibro;