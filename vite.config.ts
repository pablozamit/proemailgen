import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

const rootDir = path.resolve(__dirname, "client");
const publicIndex = path.resolve(rootDir, "public", "index.html");
const indexHtml = fs.existsSync(publicIndex)
  ? publicIndex
  : path.resolve(rootDir, "index.html");

export default defineConfig({
  root: rootDir,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: indexHtml,
    },
  },
  publicDir: path.resolve(rootDir, "public"),
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
