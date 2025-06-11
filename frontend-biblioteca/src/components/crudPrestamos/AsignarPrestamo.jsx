import { axiosInstance } from '../../services/axios.config';

const AsignarPrestamo = async (prestamoData) => {
  try {
    const token = sessionStorage.getItem("token"); // Obtener el token de sesión
    const response = await axiosInstance.post("/prestamos/asignar_prestamo", prestamoData, {
      headers: {
        Authorization: `Bearer ${token}`, // token de autorización
        "Content-Type": "application/json", // Especificar el tipo de contenido
      },
    });
    return response.data; // Devolver la respuesta de la API
  } catch (error) {
    console.error("Error al asignar el préstamo:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default AsignarPrestamo;