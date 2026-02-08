import axios from 'axios';

// Base URL for your API - update this when you deploy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - add auth token if needed
api.interceptors.request.use(
  (config) => {
    // Add authorization token if it exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error responses
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login or clear token
          localStorage.removeItem('authToken');
          // window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error occurred');
          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const crisisAPI = {
  // Get overall crisis overview data
  getOverview: () => api.get('/crisis/overview'),
  
  // Get specific crisis details
  getCrisisById: (id) => api.get(`/crisis/${id}`),
  
  // Get safe zones
  getSafeZones: (params) => api.get('/safe-zones', { params }),
  
  // Get resources availability
  getResources: () => api.get('/resources'),
  
  // Get emergency updates
  getUpdates: (params) => api.get('/updates', { params }),
  
  // Get alerts
  getAlerts: () => api.get('/alerts'),
};

// Volunteer API endpoints
export const volunteerAPI = {
  // Register as volunteer
  register: (data) => api.post('/volunteer/register', data),
  
  // Get volunteer profile
  getProfile: () => api.get('/volunteer/profile'),
  
  // Update volunteer profile
  updateProfile: (data) => api.put('/volunteer/profile', data),
  
  // Get available tasks
  getTasks: (params) => api.get('/volunteer/tasks', { params }),
  
  // Accept a task
  acceptTask: (taskId) => api.post(`/volunteer/tasks/${taskId}/accept`),
};

// Coordinator API endpoints
export const coordinatorAPI = {
  // Create new task
  createTask: (data) => api.post('/coordinator/tasks', data),
  
  // Update resource stock
  updateResource: (resourceId, data) => api.put(`/coordinator/resources/${resourceId}`, data),
  
  // Publish alert
  publishAlert: (data) => api.post('/coordinator/alerts', data),
  
  // Get active volunteers
  getVolunteers: (params) => api.get('/coordinator/volunteers', { params }),
};

// Export the axios instance for custom requests
export default api;