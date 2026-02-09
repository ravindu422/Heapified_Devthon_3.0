import api from "./api"

const locationService = {
    searchOnLocations: async (query) => {
        try {
            const response = await api.get(`/locations/search?q=${encodeURIComponent(query)}`);
            return response.data.data;
        } catch (error) {
            console.error("API Error (location search):", error);
            throw error.response?.data || { message: 'Failed to search locations' };
        }
    }
};

export default locationService;