const esbuild = require("esbuild");
const { mkdirSync, writeFileSync, readFileSync } = require("fs");
const path = require("path");
const postcss = require("postcss");
const postcssImport = require("postcss-import");
const tailwindcss = require("@tailwindcss/postcss");

const distDir = path.join(__dirname, "dist");
mkdirSync(distDir, { recursive: true });

async function buildTailwindCSS() {
  const inputCss = path.join(__dirname, "src", "styles.css");
  const outputCss = path.join(distDir, "tailwind.css");

  console.log("Building Tailwind CSS...");

  const css = readFileSync(inputCss, "utf8");

  const result = await postcss([postcssImport, tailwindcss]).process(css, {
    from: inputCss,
    to: outputCss,
  });

  writeFileSync(outputCss, result.css, "utf8");

  if (result.map) {
    writeFileSync(outputCss + ".map", result.map.toString(), "utf8");
  }

  console.log("✅ Tailwind CSS built successfully!");
}

const buildOptions = {
  entryPoints: ["src/index.js"],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node18",
  outfile: path.join(distDir, "index.js"),
  external: ["react", "react-dom"],
  jsx: "automatic",
  jsxImportSource: "react",
  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
    ".ts": "ts",
    ".tsx": "tsx",
  },
  logLevel: "info",
};

console.log("Building ESCEMI Resume Theme (React edition)...");

buildTailwindCSS()
  .then(() => esbuild.build(buildOptions))
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
