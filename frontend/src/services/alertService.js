import api from './api';


const alertService = {
    getRecentAlerts: async (limit = 5) => {
        try {
            const response = await api.get(`/alerts/recent?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("API Error (fetch):", error);
            throw error.response?.data || { message: 'Server unreachable' };
        }
    },

    createAlert: async (alertData) => {
        try {
            const response = await api.post('/alerts', alertData);
            return response.data;
        } catch (error) {
            console.error("API Error (fetch):", error);
            throw error.response?.data || { message: 'Failed to send alert' };
        }
    },

    getAllAlerts: async (params = {}) => {
        try {
            const queryParams = {
                page: params.page || 1,
                limit: params.limit || 100,
                sortBy: params.sortBy || 'createdAt',
                order: params.order || 'desc',
                ...params
            }
            const response = await api.get('/alerts', { params: queryParams });
            return response.data;
        } catch (error) {
             console.error("API Error (fetch):", error);
            throw error.response?.data || { message: 'Server unreachable' };
        }
    }
};

export default alertService;