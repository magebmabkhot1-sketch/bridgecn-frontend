import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://bridgecn-api.onrender.com';

console.log('🔧 API BASE URL:', API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ KEEP OLD COMPATIBILITY (IMPORTANT)
export const api = apiClient;

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    '➡️ REQUEST:',
    (config.baseURL || '') + (config.url || '')
  );

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE:', response.status);
    return response;
  },
  (error) => {
    console.error(
      '❌ ERROR:',
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);