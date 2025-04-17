import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.needsAuth !== false) { // Solo añadimos el token si existe Y si needsAuth no es explícitamente false
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    delete config.needsAuth; // Limpiamos la propiedad needsAuth para que no se envíe en la petición
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const postCalling = async (route, data, needsAuth = true) => {
  try {
    console.log("PRUEBA");
    const response = await api.post(route, { ...data, needsAuth }); // Pasamos needsAuth en la configuración
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getCalling = async (route, needsAuth = true) => {
  try {
    const response = await api.get(route, { needsAuth }); // Pasamos needsAuth en la configuración
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateCalling = async (route, data, needsAuth = true) => {
  try {
    const response = await api.patch(route, { ...data, needsAuth }); // Pasamos needsAuth en la configuración
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteCalling = async (route, needsAuth = true) => {
  try {
    const response = await api.delete(route, { needsAuth }); // Pasamos needsAuth en la configuración
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
