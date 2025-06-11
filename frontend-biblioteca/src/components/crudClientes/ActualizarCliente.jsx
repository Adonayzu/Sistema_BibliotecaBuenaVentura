import { axiosInstance } from "../../services/axios.config";

const ActualizarLibro = async (clienteData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/clientes/update_client/${clienteData.id_cliente}`,
      clienteData, // esto es para enviar los datos del libro a actualizar
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    throw error;
  }
};

export default ActualizarLibro;