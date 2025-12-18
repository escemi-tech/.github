import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "JsonResumeThemeEscemi",
      fileName: (format) =>
        format === "cjs"
          ? "jsonresume-theme-escemi.cjs"
          : "jsonresume-theme-escemi.js",
      formats: ["cjs", "es"],
    },
    target: "node18",
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      "pagedjs/dist/paged.polyfill.js": path.resolve(
        __dirname,
        "node_modules/pagedjs/dist/paged.polyfill.js",
      ),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, ".."), path.resolve(__dirname)],
    },
  },
});
