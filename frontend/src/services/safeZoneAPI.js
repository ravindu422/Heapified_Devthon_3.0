import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const safeZoneAPI = {
  /**
   * Get all safe zones with filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getSafeZones: (params) => 
    axios.get(`${API_BASE_URL}/safe-zones`, { params }),

  /**
   * Get nearest safe zones
   * @param {number} latitude 
   * @param {number} longitude 
   * @param {number} limit 
   * @param {number} maxDistance - in kilometers
   * @returns {Promise}
   */
  getNearest: (latitude, longitude, limit = 5, maxDistance = 50) =>
    axios.get(`${API_BASE_URL}/safe-zones/nearest`, {
      params: { latitude, longitude, limit, maxDistance }
    }),

  /**
   * Get single safe zone by ID
   * @param {string} id - Safe zone ID
   * @param {number} latitude - Optional: for distance calculation
   * @param {number} longitude - Optional: for distance calculation
   * @returns {Promise}
   */
  getSafeZoneById: (id, latitude, longitude) => {
    const params = {};
    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    return axios.get(`${API_BASE_URL}/safe-zones/${id}`, { params });
  },

  /**
   * Get safe zone statistics
   * @returns {Promise}
   */
  getStats: () =>
    axios.get(`${API_BASE_URL}/safe-zones/stats`),

  /**
   * Get available amenities for filtering
   * @returns {Promise}
   */
  getAmenities: () =>
    axios.get(`${API_BASE_URL}/safe-zones/amenities/list`),

  /**
   * Get safe zone types for filtering
   * @returns {Promise}
   */
  getTypes: () =>
    axios.get(`${API_BASE_URL}/safe-zones/types/list`),

  /**
   * Create new safe zone (Admin only)
   * @param {Object} data - Safe zone data
   * @returns {Promise}
   */
  createSafeZone: (data) =>
    axios.post(`${API_BASE_URL}/safe-zones`, data),

  /**
   * Update safe zone (Admin only)
   * @param {string} id - Safe zone ID
   * @param {Object} data - Updated data
   * @returns {Promise}
   */
  updateSafeZone: (id, data) =>
    axios.put(`${API_BASE_URL}/safe-zones/${id}`, data),

  /**
   * Update safe zone capacity
   * @param {string} id - Safe zone ID
   * @param {number} current - Current capacity
   * @returns {Promise}
   */
  updateCapacity: (id, current) =>
    axios.patch(`${API_BASE_URL}/safe-zones/${id}/capacity`, { current }),

  /**
   * Delete safe zone (Admin only)
   * @param {string} id - Safe zone ID
   * @returns {Promise}
   */
  deleteSafeZone: (id) =>
    axios.delete(`${API_BASE_URL}/safe-zones/${id}`),
};

export default safeZoneAPI;