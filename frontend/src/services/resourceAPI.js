import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080/api';

export const resourceAPI = {
  /**
   * Get all distribution centers with filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getDistributionCenters: (params) => 
    axios.get(`${API_BASE_URL}/resources`, { params }),

  /**
   * Get single distribution center by ID
   * @param {string} id - Center ID
   * @param {number} latitude - Optional: for distance calculation
   * @param {number} longitude - Optional: for distance calculation
   * @returns {Promise}
   */
  getDistributionCenterById: (id, latitude, longitude) => {
    const params = {};
    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    return axios.get(`${API_BASE_URL}/resources/${id}`, { params });
  },

  /**
   * Search for specific item across all centers
   * @param {string} itemName - Name of the item
   * @param {number} minStock - Minimum stock quantity
   * @param {number} latitude - Optional: for distance calculation
   * @param {number} longitude - Optional: for distance calculation
   * @returns {Promise}
   */
  searchItem: (itemName, minStock = 1, latitude, longitude) => {
    const params = { itemName, minStock };
    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    return axios.get(`${API_BASE_URL}/resources/search/item`, { params });
  },

  /**
   * Get low stock alerts
   * @param {Object} params - Query parameters (severity, isActive)
   * @returns {Promise}
   */
  getLowStockAlerts: (params) =>
    axios.get(`${API_BASE_URL}/resources/alerts`, { params }),

  /**
   * Get resource statistics
   * @returns {Promise}
   */
  getStats: () =>
    axios.get(`${API_BASE_URL}/resources/stats`),

  /**
   * Create new distribution center (Admin only)
   * @param {Object} data - Center data
   * @returns {Promise}
   */
  createDistributionCenter: (data) =>
    axios.post(`${API_BASE_URL}/resources`, data),

  /**
   * Update distribution center (Admin only)
   * @param {string} id - Center ID
   * @param {Object} data - Updated data
   * @returns {Promise}
   */
  updateDistributionCenter: (id, data) =>
    axios.put(`${API_BASE_URL}/resources/${id}`, data),

  /**
   * Update stock item
   * @param {string} id - Center ID
   * @param {string} itemName - Item name
   * @param {number} currentStock - New stock quantity
   * @returns {Promise}
   */
  updateStock: (id, itemName, currentStock) =>
    axios.patch(`${API_BASE_URL}/resources/${id}/stock`, { itemName, currentStock }),

  /**
   * Delete distribution center (Admin only)
   * @param {string} id - Center ID
   * @returns {Promise}
   */
  deleteDistributionCenter: (id) =>
    axios.delete(`${API_BASE_URL}/resources/${id}`),
};

export default resourceAPI;