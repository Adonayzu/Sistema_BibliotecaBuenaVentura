import { axiosInstance } from '../../services/axios.config';

const ObtenerPrestamosDevueltos = async (params = {}) => {
  try {
    const token = sessionStorage.getItem("token"); // Obtener el token de sesión
    const response = await axiosInstance.get('/prestamos/prestamos_devuelto', {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token en los headers
      },
      params, // parámetros de búsqueda
    });
    return response.data; // Devolver la respuesta de la API
  } catch (error) {
    console.error("Error al obtener los préstamos devueltos:", error);
    throw error; 
  }
};

export default ObtenerPrestamosDevueltos;