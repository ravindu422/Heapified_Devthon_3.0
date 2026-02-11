import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://heapifieddevthon30-production.up.railway.app/api';

export const updateAPI = {
  /**
   * Get all updates with filters
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getUpdates: (params) => 
    axios.get(`${API_BASE_URL}/updates`, { params }),

  /**
   * Get single update by ID
   * @param {string} id - Update ID
   * @returns {Promise}
   */
  getUpdateById: (id) =>
    axios.get(`${API_BASE_URL}/updates/${id}`),

  /**
   * Get recent critical updates
   * @param {number} limit - Number of updates to fetch
   * @returns {Promise}
   */
  getRecentCritical: (limit = 5) =>
    axios.get(`${API_BASE_URL}/updates/critical/recent`, { params: { limit } }),

  /**
   * Get updates by location
   * @param {string} province - Province name
   * @param {string} district - District name (optional)
   * @returns {Promise}
   */
  getUpdatesByLocation: (province, district) => {
    const params = district ? { district } : {};
    return axios.get(`${API_BASE_URL}/updates/location/${province}`, { params });
  },

  /**
   * Search updates
   * @param {string} query - Search query
   * @returns {Promise}
   */
  searchUpdates: (query) =>
    axios.get(`${API_BASE_URL}/updates/search`, { params: { q: query } }),

  /**
   * Get update statistics
   * @returns {Promise}
   */
  getStats: () =>
    axios.get(`${API_BASE_URL}/updates/stats`),

  /**
   * Get filter options
   * @returns {Promise}
   */
  getFilterOptions: () =>
    axios.get(`${API_BASE_URL}/updates/filters/options`),

  /**
   * Create new update (Coordinator/Admin)
   * @param {Object} data - Update data
   * @returns {Promise}
   */
  createUpdate: (data) =>
    axios.post(`${API_BASE_URL}/updates`, data),

  /**
   * Update an update (Coordinator/Admin)
   * @param {string} id - Update ID
   * @param {Object} data - Updated data
   * @returns {Promise}
   */
  updateUpdate: (id, data) =>
    axios.put(`${API_BASE_URL}/updates/${id}`, data),

  /**
   * Delete update (Admin)
   * @param {string} id - Update ID
   * @returns {Promise}
   */
  deleteUpdate: (id) =>
    axios.delete(`${API_BASE_URL}/updates/${id}`),

  /**
   * Share update (increment share count)
   * @param {string} id - Update ID
   * @returns {Promise}
   */
  shareUpdate: (id) =>
    axios.post(`${API_BASE_URL}/updates/${id}/share`),
};

export default updateAPI;