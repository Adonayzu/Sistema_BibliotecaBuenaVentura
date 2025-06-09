import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

let isRedirecting = false; // Variable para evitar múltiples redirecciones

axiosInstance.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, simplemente devuélvela
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Si el backend devuelve un error 401, redirige al login
      if (!isRedirecting) {
        isRedirecting = true;
        sessionStorage.removeItem("token"); // Elimina el token inválido
        window.location.href = "/"; // Redirige al login
      }
    }

    return Promise.reject(error); // Rechaza el error para que el componente lo maneje si es necesario
  }
);