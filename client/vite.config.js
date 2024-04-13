import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://lhrlslacktest.ngrok.io",
    },
     build: {
    outDir: 'build', // Optional: Configure output directory (default is 'dist')
  }
  },
});
