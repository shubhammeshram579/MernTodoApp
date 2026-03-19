import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://mern-todo-app-backend-eight.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
