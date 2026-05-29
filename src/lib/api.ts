import axios from 'axios';

// HARDCODED API URL - NO ENV VARIABLES ALLOWED
const API_URL = 'https://bridgecn-api.onrender.com/api';

console.log('🔧 API_URL is set to:', API_URL); // DEBUG LOG

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('➡️ REQUEST:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ RESPONSE ERROR:', error.response?.status, error.message, error.config?.url);
    return Promise.reject(error);
  }
);