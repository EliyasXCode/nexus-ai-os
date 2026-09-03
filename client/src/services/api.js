import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token if in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to NEXUS server. Please ensure the server is active.';
    return Promise.reject(new Error(message));
  }
);

export default api;
