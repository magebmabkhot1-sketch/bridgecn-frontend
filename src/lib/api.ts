import axios from 'axios';

// HARDCODED PRODUCTION URL
const API_URL = 'https://bridgecn-api.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export as 'api' for backward compatibility
export { apiClient as api };