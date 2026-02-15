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

// Log da configuração da API ao inicializar
console.log("⚙️ Configuração da API:", {
  baseURL: apiConfig.baseURL,
  ambiente: import.meta.env.DEV ? "desenvolvimento" : "produção",
});

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Log detalhado da requisição para debug
    console.log("🚀 Requisição API:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      urlCompleta: `${config.baseURL}${config.url}`,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? "Bearer ***" : undefined,
      },
      data: config.data,
    });
    
    return config;
  },
  (error) => {
    console.error("❌ Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  },
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => {
    // Log de resposta bem-sucedida
    console.log("✅ Resposta API:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Log detalhado de erro
    console.error("❌ Erro na resposta API:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      urlCompleta: error.config ? `${error.config.baseURL}${error.config.url}` : "N/A",
      data: error.response?.data,
      headers: error.response?.headers,
    });
    
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
