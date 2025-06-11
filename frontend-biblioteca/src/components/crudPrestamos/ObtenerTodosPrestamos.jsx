import { axiosInstance } from '../../services/axios.config';

const ObtenerTodosPrestamos = async () => {
  try {
    const token = sessionStorage.getItem("token"); // Obtener el token de sesión
    const response = await axiosInstance.get('/prestamos/todos_prestamos', {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token en los headers
      },
    });
    return response.data; // Devolver la respuesta de la API
  } catch (error) {
    console.error("Error al obtener todos los préstamos:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default ObtenerTodosPrestamos;