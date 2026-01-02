import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.0.18:3001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
