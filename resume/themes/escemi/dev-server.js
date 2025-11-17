#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const http = require("http");
const esbuild = require("esbuild");

const themeRoot = __dirname;
const distDir = path.join(themeRoot, "dist");
const bundlePath = path.join(distDir, "index.js");
const resumePath = path.join(themeRoot, "..", "..", "resume.en.json");
const port = Number(process.env.PORT || 4173);

const buildOptions = {
  entryPoints: [path.join(themeRoot, "src/index.js")],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node18",
  outfile: bundlePath,
  external: ["react", "react-dom", "styled-components"],
  jsx: "automatic",
  jsxImportSource: "react",
  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
  },
  logLevel: "silent",
};

let currentRender = null;

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
      body.preview-shell {
        background: linear-gradient(135deg, #0f1621 0%, #1c3144 65%);
        padding: 40px;
        min-height: 100vh;
        box-sizing: border-box;
        font-family: 'Source Sans Pro', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .preview-stage {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 24px;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }

      .preview-page {
        width: 210mm;
        min-height: 297mm;
        background: #ffffff;
        box-shadow: 0 18px 45px rgba(12, 19, 34, 0.35);
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(19, 49, 68, 0.12);
      }

      @media (max-width: 1100px) {
        .preview-stage {
          flex-direction: column;
          align-items: center;
        }
      }

      @media print {
        body.preview-shell {
          background: #ffffff;
          padding: 0;
        }

        .preview-page {
          box-shadow: none;
          border-radius: 0;
          width: 210mm;
          min-height: 297mm;
        }
      }
    </style>
  `;

  if (html.includes("</head>") && html.includes("<body")) {
    let wrapped = html;
    wrapped = wrapped.replace("</head>", `${previewStyles}</head>`);

    wrapped = wrapped.replace(
      "<body>",
      '<body class="preview-shell"><div class="preview-stage"><div class="preview-page">',
    );

    wrapped = wrapped.replace("</body>", "</div></div></body>");

    return wrapped;
  }

  // Fallback: wrap entire document if the expected tags are missing
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      ${previewStyles}
    </head>
    <body class="preview-shell">
      <div class="preview-stage">
        <div class="preview-page">
          ${html}
        </div>
      </div>
    </body>
  </html>`;
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
