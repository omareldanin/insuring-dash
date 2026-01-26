import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   open: false, // 🚀 prevents browser tab opening
  //   port: 5173, // ensure port is fixed for Electron
  // },
  build: {
    outDir: "dist",
  },
  base: "./",
});
