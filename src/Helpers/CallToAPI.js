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
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const postCalling = async (route, data) => {
  try {
    const response = await api.post(route, data);
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getCalling = async (route) => {
  try {
    const response = await api.get(route);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateCalling = async (route, data) => {
  try {
    const response = await api.patch(route, data);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteCalling = async (route) => {
  try {
    const response = await api.delete(route);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
