import axios from "axios";
// import toast from "react-hot-toast";

export const baseURL = "http://207.154.215.133:3000/";

export interface APIError {
  message: string;
  status: string;
}

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  },
);
