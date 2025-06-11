import { axiosInstance } from '../../services/axios.config';

const CancelarPrestamo = async (idPrestamo) => {
  try {
    const token = sessionStorage.getItem("token"); // Obtener el token de sesión
    const response = await axiosInstance.put(`/prestamos/cancelar_prestamo/${idPrestamo}`, null, {
      headers: {
        Authorization: `Bearer ${token}`, // token
        "Content-Type": "application/json", //  tipo de contenido
      },
    });
    return response.data; // Devolver la respuesta de la API
  } catch (error) {
    console.error("Error al cancelar el préstamo:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default CancelarPrestamo;