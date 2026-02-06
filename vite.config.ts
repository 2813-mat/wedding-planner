import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3013",
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, "");
          console.log(
            `[Vite Proxy] ${path} -> http://localhost:3013${newPath}`,
          );
          return newPath;
        },
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("[Vite Proxy] Erro:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log(
              `[Vite Proxy] Requisição: ${req.method} ${req.url} -> ${proxyReq.path}`,
            );
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              `[Vite Proxy] Resposta: ${req.method} ${req.url} -> ${proxyRes.statusCode}`,
            );
          });
        },
      },
    },
  },
});
