
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load .env, .env.local, .env.[mode], .env.[mode].local
  const env = loadEnv(mode, process.cwd(), ""); // no third arg => load all keys

  return {
    base: env.VITE_HUMAN_AGING_BASE_URL || "/",   // <- pulled from .env files
    server: { host: "::", port: 8080 },
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  };
});


