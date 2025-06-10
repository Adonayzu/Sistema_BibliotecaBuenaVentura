import { axiosInstance } from "../../services/axios.config"; // Importa la instancia de axios configurada

const ObtenerUsuarios = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get("/usuarios/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Devuelve los datos obtenidos
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default ObtenerUsuarios;