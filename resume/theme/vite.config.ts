import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(rootDir, "src/index.tsx"),
      name: "JsonResumeThemeEscemi",
      fileName: (format) =>
        format === "cjs"
          ? "jsonresume-theme-escemi.cjs"
          : "jsonresume-theme-escemi.js",
      formats: ["cjs", "es"],
    },
    target: "esnext",
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
        rootDir,
        "node_modules/pagedjs/dist/paged.polyfill.js",
      ),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(rootDir, ".."), path.resolve(rootDir)],
    },
  },
});
