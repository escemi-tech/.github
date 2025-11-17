const esbuild = require("esbuild");
const { mkdirSync, writeFileSync } = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "dist");
mkdirSync(distDir, { recursive: true });

const buildOptions = {
  entryPoints: ["src/index.js"],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node18",
  outfile: path.join(distDir, "index.js"),
  external: ["react", "react-dom", "styled-components"],
  jsx: "automatic",
  jsxImportSource: "react",
  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
  },
  logLevel: "info",
};

console.log("Building ESCEMI Resume Theme (React edition)...");

esbuild
  .build(buildOptions)
  .then(() => {
    const shimPath = path.join(__dirname, "index.js");
    const shimContents = "module.exports = require('./dist/index.js');\n";
    writeFileSync(shimPath, shimContents);
    console.log("✅ Build successful!");
    console.log("   Output: dist/index.js (CommonJS)");
  })
  .catch((error) => {
    console.error("❌ Build failed:", error);
    process.exit(1);
  });
