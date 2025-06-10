import { axiosInstance } from "../../services/axios.config"; // Importa la instancia de axios configurada

const ObtenerRoles = async (idRol) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get(`/usuarios/roles/${idRol}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Devuelve los datos obtenidos
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default ObtenerRoles;



