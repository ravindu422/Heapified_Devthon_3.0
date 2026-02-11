import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    || 'https://heapifieddevthon30-production.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});


// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
          localStorage.removeItem('token');
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

export default api;
