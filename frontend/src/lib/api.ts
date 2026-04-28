import axios from 'axios';

const isProd = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

const api = axios.create({
  baseURL: isProd ? '/api' : 'http://localhost:9006/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
