import { axiosInstance } from "../../services/axios.config";

const ActualizarLibro = async (libroData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/libros/update_book/${libroData.id_libro}`,
      libroData, // esto es para enviar los datos del libro a actualizar
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el libro:", error);
    throw error;
  }
};

export default ActualizarLibro;