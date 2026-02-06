import axios from 'axios';

const LOCAL_BACKEND = 'http://localhost:5080/api';

const api = axios.create({
    baseURL: import.meta.VITE_API_URL || LOCAL_BACKEND,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});


// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;