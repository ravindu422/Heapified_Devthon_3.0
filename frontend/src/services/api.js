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

export default api;