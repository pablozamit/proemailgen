import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const root = path.resolve(__dirname, "client");
const publicIndex = path.join(root, "public", "index.html");
const input = fs.existsSync(publicIndex)
  ? publicIndex
  : path.join(root, "index.html");

export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.join(root, "src"),
      "@shared": path.join(__dirname, "shared"),
      "@assets": path.join(__dirname, "attached_assets"),
    },
  },
  base: "./",
  publicDir: path.join(root, "public"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input,
    },
  },
});