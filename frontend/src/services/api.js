import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout on token expiration
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const predictionAPI = {
  predict: (data) => api.post('/predict', data),
  getModelPerformance: () => api.get('/model/performance'),
};

export const historyAPI = {
  getHistory: (params) => api.get('/history', { params }),
  getDetail: (id) => api.get(`/history/${id}`),
  delete: (id) => api.delete(`/history/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getStatistics: () => api.get('/admin/statistics'),
};

export default api;
