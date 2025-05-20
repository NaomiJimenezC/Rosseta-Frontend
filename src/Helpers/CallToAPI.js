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
    if (token && config.needsAuth !== false) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    delete config.needsAuth;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const postCalling = async (route, data, needsAuth = true) => {
  try {
    return await api.post(route, {...data, needsAuth});
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getCalling = async (route, needsAuth = true) => {
  try {
    const response = await api.get(route, { needsAuth });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateCalling = async (route, data, needsAuth = true) => {
  try {
    return await api.patch(route, {...data, needsAuth});
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteCalling = async (route, data = {}, needsAuth = true) => {
  try {
    const config = {
      data,
      needsAuth
    };
    return await api.delete(route, config);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
