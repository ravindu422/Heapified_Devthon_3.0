import api from './api'; // Use the main api instance with auth interceptor

export const resourceAPI = {
  /**
   * Get all distribution centers with filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getDistributionCenters: (params) => 
    api.get('/resources', { params }),

  /**
   * Get single distribution center by ID
   */
  getDistributionCenterById: (id, latitude, longitude) => {
    const params = {};
    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    return api.get(`/resources/${id}`, { params });
  },

  /**
   * Search for specific item across all centers
   */
  searchItem: (itemName, minStock = 1, latitude, longitude) => {
    const params = { itemName, minStock };
    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    return api.get('/resources/search/item', { params });
  },

  /**
   * Get low stock alerts
   */
  getLowStockAlerts: (params) =>
    api.get('/resources/alerts', { params }),

  /**
   * Get resource statistics
   */
  getStats: () =>
    api.get('/resources/stats'),

  /**
   * Create new distribution center (Admin only)
   */
  createDistributionCenter: (data) =>
    api.post('/resources', data),

  /**
   * Update distribution center (Admin only)
   */
  updateDistributionCenter: (id, data) =>
    api.put(`/resources/${id}`, data),

  /**
   * Update stock item
   */
  updateStock: (id, itemName, currentStock) =>
    api.patch(`/resources/${id}/stock`, { itemName, currentStock }),

  /**
   * Delete distribution center (Admin only)
   */
  deleteDistributionCenter: (id) =>
    api.delete(`/resources/${id}`),
};

export default resourceAPI;