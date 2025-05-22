import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// CI/CD specific Vite configuration with simplified settings
// to avoid platform-specific issues with Rollup
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable minification in CI to avoid potential issues
    minify: false,
    // Use a simpler sourcemap format
    sourcemap: 'inline',
    // Increase the rollup timeout
    rollupOptions: {
      maxParallelFileOps: 1,
      output: {
        // Avoid code splitting to reduce complexity
        manualChunks: undefined,
      },
    },
  },
});