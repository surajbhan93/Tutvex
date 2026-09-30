import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    let token: string | null | undefined = null;

    if (typeof window !== 'undefined') {
      // 1. Get token from Zustand auth-storage
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const authState = JSON.parse(authStorage);
          token = authState?.state?.token;
        } catch (e) {
          console.error("Failed to parse auth-storage", e);
        }
      }

      // 2. Fallbacks for direct localStorage keys
      if (!token) {
        token =
          localStorage.getItem('token') ||
          localStorage.getItem('adminToken') ||
          localStorage.getItem('parentToken') ||
          localStorage.getItem('tutorToken');
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      console.warn("401 Unauthorized encountered:", error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
