import axios from "axios";

const api = axios.create({
  baseURL: "https://orderonthego-backend-5dmw.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token; // Bearer already included
  }
  return config;
});

export default api;