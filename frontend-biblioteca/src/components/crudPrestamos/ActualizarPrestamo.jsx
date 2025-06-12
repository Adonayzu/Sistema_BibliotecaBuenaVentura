import { axiosInstance } from "../../services/axios.config";

const ActualizarPrestamo = async (prestamoData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/prestamos/update_prestamo/${prestamoData.id_prestamo}`, 
      prestamoData, // Datos actualizados del préstamo
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Retorna la respuesta del servidor
  } catch (error) {
    console.error("Error al actualizar el préstamo:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default ActualizarPrestamo;