import { axiosInstance } from '../../services/axios.config';

const ObtenerPrestamosDevueltos = async () => {
  try {
    const token = sessionStorage.getItem("token"); // Obtener el token de sesión
    const response = await axiosInstance.get('/prestamos/prestamos_devuelto', {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token en los headers
      },
    });
    return response.data; // Devolver la respuesta de la API
  } catch (error) {
    console.error("Error al obtener los préstamos devueltos:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default ObtenerPrestamosDevueltos;