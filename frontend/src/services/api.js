import axios from "axios";

// Direct Railway production URL
const api = axios.create({
  baseURL: "https://heapifieddevthon30-production.up.railway.app/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* ===========================
   Crisis API
=========================== */

export const crisisAPI = {
  getOverview: () => api.get("/crisis/overview"),
  getCrisisById: (id) => api.get(`/crisis/${id}`),
  getSafeZones: (params) => api.get("/safe-zones", { params }),
  getResources: () => api.get("/resources"),
  getUpdates: (params) => api.get("/updates", { params }),
  getAlerts: () => api.get("/alerts"),
};

export default api;
