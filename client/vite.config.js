import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // during local dev, proxy /api calls to the Firebase emulator
      "/api": "http://127.0.0.1:5001/nida-ad6ec/us-central1",
    },
  },
});
