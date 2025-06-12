import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response, // Devuelve la respuesta si es exitosa
  (error) => {
    if (error.response?.status === 401) { // si el error es 401 es que el token es inválido o ha expirado
      sessionStorage.removeItem("token"); // Elimina el token inválido
      window.location.href = "/"; // Redirige al login
    }
    // esto es para que si hay un error en la petición, se maneje el error en el componente
    return Promise.reject(error);
  }
);