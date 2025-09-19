import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: '/skin-compass/',
  plugins: [react()],
  build: { outDir: "dist" }
});

