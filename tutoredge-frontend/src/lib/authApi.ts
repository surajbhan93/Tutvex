import axios from "axios";
import { getToken } from "@/lib/auth";

const authApi = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  timeout: 10000,
});

authApi.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default authApi;
