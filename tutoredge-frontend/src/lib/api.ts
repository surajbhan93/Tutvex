import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const authRaw = localStorage.getItem("auth-storage");

    if (authRaw) {
      const auth = JSON.parse(authRaw);
      const token = auth?.state?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

export default api;
