export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || "seu-dominio.auth0.com",
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "seu-client-id",
  redirectUri:
    import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
  audience:
    import.meta.env.VITE_AUTH0_AUDIENCE ||
    "https://seu-dominio.auth0.com/api/v2/",
};

export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3013",
};
