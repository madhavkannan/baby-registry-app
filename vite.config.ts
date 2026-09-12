import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Served from https://<user>.github.io/baby-registry-app/ — base must match the repo name.
export default defineConfig({
  base: "/baby-registry-app/",
  plugins: [react(), tailwindcss()],
});
