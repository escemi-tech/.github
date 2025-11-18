const esbuild = require("esbuild");
const { mkdirSync, writeFileSync } = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

const distDir = path.join(__dirname, "dist");
mkdirSync(distDir, { recursive: true });

function buildTailwindCSS() {
  const cliPath = require.resolve("tailwindcss/lib/cli.js");
  const inputCss = path.join(__dirname, "src", "styles.css");
  const outputCss = path.join(distDir, "tailwind.css");
  const args = [
    cliPath,
    "-c",
    path.join(__dirname, "tailwind.config.js"),
    "--postcss",
    path.join(__dirname, "postcss.config.js"),
    "-i",
    inputCss,
    "-o",
    outputCss,
    "--minify",
  ];

  console.log("Building Tailwind CSS...");
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });

  if (result.status !== 0) {
    throw new Error("Tailwind CSS build failed");
  }
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

buildTailwindCSS();

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
