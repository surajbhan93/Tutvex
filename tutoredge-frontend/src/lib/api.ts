import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api/v1",
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
