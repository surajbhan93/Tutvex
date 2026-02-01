import axios from "axios";
import { getToken } from "@/lib/auth";

const adminApi = axios.create({
  baseURL: "http://localhost:3001/api/v1",
});

adminApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
