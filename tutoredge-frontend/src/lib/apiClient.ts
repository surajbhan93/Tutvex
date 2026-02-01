import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    // 1. Get the raw string from localStorage
    const authStorage = localStorage.getItem('auth-storage');

    if (authStorage) {
      // 2. Parse the JSON string
      const authState = JSON.parse(authStorage);

      // 3. Access the token using the correct structure: state -> token
      const token = authState?.state?.token;

      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
