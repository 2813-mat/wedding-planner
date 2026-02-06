import axios, { type AxiosInstance } from "axios";
import { apiConfig } from "../config/auth0";

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

const api: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
