import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
// ...existing code...

export default defineConfig({
  plugins: [
    react(),
    // ...existing code...
  ],
  resolve: {
    alias: {
      "@": path.resolve(fileURLToPath(import.meta.url), "../client/src"),
      "@shared": path.resolve(fileURLToPath(import.meta.url), "../shared"),
      "@assets": path.resolve(fileURLToPath(import.meta.url), "../attached_assets"),
    },
  },
  root: path.resolve(fileURLToPath(import.meta.url), "../client"),
  build: {
    outDir: path.resolve(fileURLToPath(import.meta.url), "../dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
