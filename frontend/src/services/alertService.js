import axios from 'axios';
import { logger } from '../../../backend/utils/logger';

const LOCAL_BACKEND = 'http://localhost:5080/api';

const api = axios.create({
    baseURL: import.meta.VITE_API_URL || LOCAL_BACKEND,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

const alertService = {
    getRecentAlerts: async (limit = 5) => {
        try {
            const response = await api.get(`/alerts/recent?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("API Error (fecth):", error);
            throw error.response?.data || { message: 'Server unreachable' };
        }
    },

    createAlert: async (alertData) => {
        try {
            const response = await api.post('/alerts', alertData);
            return response.data;
        } catch (error) {
            console.error("API Error (fecth):", error);
            throw error.response?.data || { message: 'Failed to send alert' };
        }
    }
};

export default alertService;