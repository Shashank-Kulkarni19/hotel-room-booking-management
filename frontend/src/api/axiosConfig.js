import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token and set default Content-Type
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // If no token and trying to access protected route, log warning
      const protectedPaths = ['/user/', '/admin/', '/bookings'];
      const isProtected = protectedPaths.some(path => config.url?.includes(path));
      if (isProtected) {
        console.warn('No token found for protected route:', config.url);
      }
    }
    // Only set Content-Type if not already set (for FormData requests)
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      console.warn('401 Unauthorized - Token may be expired or invalid');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // Small delay to allow error message to be displayed
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }

    // Format error message from backend response
    if (error.response?.data) {
      const errorData = error.response.data;
      // Backend returns { message: "..." } or { fieldName: "..." } for validation
      if (errorData.message) {
        error.formattedMessage = errorData.message;
      } else if (typeof errorData === 'object') {
        // Handle validation errors with multiple fields
        const firstError = Object.values(errorData)[0];
        error.formattedMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

