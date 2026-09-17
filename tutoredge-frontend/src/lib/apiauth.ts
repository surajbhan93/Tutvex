import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ✅ CORRECT

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
