import axios from 'axios';
import api from './api';


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