import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

const dirname = import.meta.dirname;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
