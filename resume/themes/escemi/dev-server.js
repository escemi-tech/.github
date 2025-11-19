#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const http = require("http");
const esbuild = require("esbuild");
const chokidar = require("chokidar");
const { spawnSync } = require("child_process");

const themeRoot = __dirname;
const distDir = path.join(themeRoot, "dist");
const bundlePath = path.join(distDir, "index.js");
const previewBundlePath = path.join(distDir, "print-toolbar.js");
const resumePath = path.join(themeRoot, "..", "..", "resume.en.json");
const tailwindConfig = path.join(themeRoot, "tailwind.config.js");
const tailwindInput = path.join(themeRoot, "src", "styles.css");
const tailwindOutput = path.join(distDir, "tailwind.css");
const postcssConfig = path.join(themeRoot, "postcss.config.js");
fs.mkdirSync(distDir, { recursive: true });
const port = Number(process.env.PORT || 4173);

const buildOptions = {
  entryPoints: [path.join(themeRoot, "src/index.js")],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node18",
  outfile: bundlePath,
  external: ["react", "react-dom"],
  jsx: "automatic",
  jsxImportSource: "react",
  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
    ".ts": "ts",
    ".tsx": "tsx",
  },
  logLevel: "silent",
};

const previewBuildOptions = {
  entryPoints: [path.join(themeRoot, "src/preview/printToolbar.jsx")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2018",
  outfile: previewBundlePath,
  jsx: "automatic",
  jsxImportSource: "react",
  sourcemap: false,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
};

let currentRender = null;
let tailwindWatcher = null;
let tailwindRebuildTimer = null;
let previewContext = null;

function buildTailwindCSS({ verbose = true } = {}) {
  const cliPath = require.resolve("tailwindcss/lib/cli.js");
  const args = [
    cliPath,
    "-c",
    tailwindConfig,
    "--postcss",
    postcssConfig,
    "-i",
    tailwindInput,
    "-o",
    tailwindOutput,
  ];

  if (process.env.NODE_ENV === "production") {
    args.push("--minify");
  }

  if (verbose) {
    log("Building Tailwind CSS...");
  }

  const result = spawnSync(process.execPath, args, {
    stdio: verbose ? "inherit" : "ignore",
  });

  if (result.status !== 0) {
    throw new Error("Tailwind CSS build failed");
  }
}

function startTailwindWatcher() {
  if (tailwindWatcher) {
    tailwindWatcher.close();
  }

  const cssGlob = path.join(themeRoot, "src", "**", "*.css");
  tailwindWatcher = chokidar
    .watch([tailwindConfig, cssGlob], {
      ignoreInitial: true,
    })
    .on("all", () => {
      if (tailwindRebuildTimer) {
        clearTimeout(tailwindRebuildTimer);
      }
      tailwindRebuildTimer = setTimeout(() => {
        try {
          buildTailwindCSS({ verbose: false });
          log("Tailwind CSS refreshed from style change");
        } catch (error) {
          console.error("[dev-server] Tailwind rebuild failed", error);
        }
      }, 75);
    })
    .on("error", (error) => {
      console.error("[dev-server] Tailwind watcher error", error);
    });
}

function stopTailwindWatcher() {
  if (tailwindWatcher) {
    tailwindWatcher.close();
    tailwindWatcher = null;
  }
  if (tailwindRebuildTimer) {
    clearTimeout(tailwindRebuildTimer);
    tailwindRebuildTimer = null;
  }
}

function log(message) {
  console.log(`[dev-server] ${message}`);
}

function readResumeFile() {
  return fs.readFileSync(resumePath, "utf8");
}

function parseResume() {
  try {
    return JSON.parse(readResumeFile());
  } catch (error) {
    throw new Error(
      `Unable to parse resume data at ${resumePath}: ${error.message}`,
    );
  }
}

function loadRenderer() {
  const resolvedBundlePath = require.resolve(bundlePath);
  delete require.cache[resolvedBundlePath];
  const moduleExports = require(resolvedBundlePath);
  const candidateRender =
    moduleExports.render ||
    moduleExports.default?.render ||
    moduleExports.default;

  if (typeof candidateRender !== "function") {
    throw new Error("Bundle did not export a render(resume, options) function");
  }

  currentRender = candidateRender;
}

function renderHtml() {
  if (!currentRender) {
    throw new Error("Renderer has not finished building yet");
  }

  const resumeData = parseResume();
  return currentRender(resumeData, { locale: "en" });
}

function wrapWithA4Preview(html) {
  const previewStyles = `
    <style id="dev-preview-a4-styles">
      
    </style>
  `;
  const previewScripts = `
    <script defer src="/print-toolbar.js"></script>
  `;
  const toolbarFallback = `
    <div id="preview-toolbar" class="preview-toolbar-host">
      <button type="button" class="print-toolbar__button" onclick="window.print()">
        Print resume · Imprimer le CV
      </button>
    </div>
  `;

  if (html.includes("</head>") && html.includes("<body")) {
    let wrapped = html;
    wrapped = wrapped.replace("</head>", `${previewStyles}</head>`);

    wrapped = wrapped.replace(
      "<body>",
      `<body>\n${toolbarFallback}\n<div class="preview-page">`,
    );

    wrapped = wrapped.replace("</body>", `</div>${previewScripts}</body>`);

    return wrapped;
  }

  // Fallback: wrap entire document if the expected tags are missing
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      ${previewStyles}
    </head>
    <body>
      ${toolbarFallback}
      <div class="preview-page">
        ${html}
      </div>
      ${previewScripts}
    </body>
  </html>`;
}

async function buildPreviewBundle() {
  if (previewContext) {
    await previewContext.dispose();
  }

  const toolbarWatcherPlugin = {
    name: "resume-preview-toolbar",
    setup(build) {
      build.onEnd((result) => {
        if (result.errors.length > 0) {
          console.error(
            "[dev-server] Preview toolbar build failed",
            result.errors,
          );
        } else {
          log("Preview print toolbar refreshed");
        }
      });
    },
  };

  previewContext = await esbuild.context({
    ...previewBuildOptions,
    plugins: [...(previewBuildOptions.plugins || []), toolbarWatcherPlugin],
  });

  await previewContext.rebuild();
  await previewContext.watch();
}

async function startWatchServer() {
  let isInitialBuild = true;

  const watcherPlugin = {
    name: "resume-dev-server-watch",
    setup(build) {
      build.onEnd((result) => {
        if (result.errors.length > 0) {
          console.error("[dev-server] Build failed", result.errors);
          return;
        }

        try {
          buildTailwindCSS({ verbose: false });
          loadRenderer();
          if (isInitialBuild) {
            log("Renderer ready");
            isInitialBuild = false;
          } else {
            log(`Renderer refreshed @ ${new Date().toLocaleTimeString()}`);
          }
        } catch (err) {
          console.error("[dev-server] Unable to refresh renderer", err);
        }
      });
    },
  };

  buildTailwindCSS();
  startTailwindWatcher();
  await buildPreviewBundle();
  const ctx = await esbuild.context({
    ...buildOptions,
    plugins: [...(buildOptions.plugins || []), watcherPlugin],
  });

  await ctx.rebuild();
  await ctx.watch();
  log("Watching source files for changes...");

  const server = http.createServer((req, res) => {
    if (req.url === "/resume.json") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(readResumeFile());
      return;
    }

    if (req.url === "/print-toolbar.js") {
      fs.readFile(previewBundlePath, (error, data) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Unable to load preview toolbar bundle");
          return;
        }
        res.writeHead(200, {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "no-store",
        });
        res.end(data);
      });
      return;
    }

    try {
      const html = wrapWithA4Preview(renderHtml());
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`Failed to render resume.\n${error.stack}`);
    }
  });

  await new Promise((resolve) =>
    server.listen(port, () => {
      log(`Dev server available at http://localhost:${port}`);
      log(`Serving resume data from ${path.relative(themeRoot, resumePath)}`);
      log("Press Ctrl+C to stop.");
      resolve();
    }),
  );

  const cleanup = async () => {
    log("Shutting down...");
    server.close();
    stopTailwindWatcher();
    if (previewContext) {
      await previewContext.dispose();
    }
    await ctx.dispose();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

(async () => {
  try {
    await startWatchServer();
  } catch (error) {
    console.error("[dev-server] Unexpected error", error);
    process.exit(1);
  }
})();
