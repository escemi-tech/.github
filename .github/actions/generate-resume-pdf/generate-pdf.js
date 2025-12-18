#!/usr/bin/env node
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const theme = require("jsonresume-theme-escemi");

const execFileAsync = promisify(execFile);

const FALLBACK_LOCALE = "en";
const COUNTRY_LOCALE_MAP = {
  FR: "fr",
  EN: "en",
  US: "en",
  GB: "en",
};
const DEFAULT_PAGEDJS_TIMEOUT_MS = 10_000;
const PAGEDJS_TIMEOUT_MS = (() => {
  if (!process.env.PAGEDJS_TIMEOUT_MS) {
    return DEFAULT_PAGEDJS_TIMEOUT_MS;
  }
  const parsed = Number.parseInt(process.env.PAGEDJS_TIMEOUT_MS, 10);
  return Number.isFinite(parsed) ? parsed : DEFAULT_PAGEDJS_TIMEOUT_MS;
})();

const normalizeLocale = (candidate) => {
  if (typeof candidate !== "string") {
    return null;
  }
  const trimmed = candidate.trim();
  return trimmed ? trimmed.toLowerCase() : null;
};

const inferLocaleFromPath = (filePath) => {
  const fileName = path.basename(filePath);
  const match = fileName.match(/\.([a-z]{2}(?:-[a-z]{2})?)\.json$/i);
  return match ? match[1].toLowerCase() : null;
};

const inferLocale = (resumeData, resumePath) => {
  const metaLocale = normalizeLocale(resumeData?.meta?.locale);
  if (metaLocale) {
    return metaLocale;
  }

  const countryCode = resumeData?.basics?.location?.countryCode;
  if (countryCode) {
    const mappedLocale = COUNTRY_LOCALE_MAP[countryCode.toUpperCase()];
    if (mappedLocale) {
      return mappedLocale;
    }
  }

  const pathLocale = inferLocaleFromPath(resumePath);
  if (pathLocale) {
    return pathLocale;
  }

  return FALLBACK_LOCALE;
};

const buildRenderOptions = (resumeData, resumePath) => {
  const locale = inferLocale(resumeData, resumePath);
  const dir = resumeData?.meta?.dir === "rtl" ? "rtl" : "ltr";
  const title = resumeData?.basics?.name || "Resume";
  return { locale, dir, title };
};

const optimizePdf = async (inputPath) => {
  const tempPath = inputPath.replace(/\.pdf$/i, ".unoptimized.pdf");
  await fs.rename(inputPath, tempPath);

  try {
    await execFileAsync("gs", [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      "-dPDFSETTINGS=/ebook",
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      `-sOutputFile=${inputPath}`,
      tempPath,
    ]);

    const [originalStats, optimizedStats] = await Promise.all([
      fs.stat(tempPath),
      fs.stat(inputPath),
    ]);

    const reduction =
      ((originalStats.size - optimizedStats.size) / originalStats.size) * 100;
    console.log(
      `📉 PDF optimized: ${Math.round(
        originalStats.size / 1024,
      )}KB → ${Math.round(optimizedStats.size / 1024)}KB (${reduction.toFixed(
        1,
      )}% reduction)`,
    );
  } finally {
    await fs.unlink(tempPath).catch((error) => {
      console.warn(
        `⚠️ Failed to remove temporary file ${tempPath}: ${error.message}`,
      );
    });
  }
};

async function main() {
  const [resumeArg, outputArg] = process.argv.slice(2);

  if (!resumeArg || !outputArg) {
    console.error("Usage: node generate-pdf.js <resume.json> <output.pdf>");
    process.exit(1);
  }
  const resumePath = path.resolve(resumeArg);
  const outputPath = path.resolve(outputArg);

  try {
    const htmlPath = await generateHtmlFileFromResume(resumePath);
    console.log(`📝 Generated HTML at: ${htmlPath}`);

    await generatePdfFromHtml(htmlPath, outputPath);
    console.log(`✅ Resume PDF created: ${outputPath}`);
    await optimizePdf(outputPath);
  } catch (error) {
    console.error("Failed to generate PDF:", error.message);
    process.exitCode = 1;
  }
}

main()
  .then(() => {
    process.exit(process.exitCode ?? 0);
  })
  .catch((error) => {
    console.error("Unexpected error while generating PDF:", error);
    process.exit(1);
  });

async function generatePdfFromHtml(htmlPath, outputPath) {
  const cliPath = path.resolve(__dirname, "node_modules/.bin/pagedjs-cli");
  const args = [htmlPath, outputPath];
  await execFileAsync(cliPath, args, {
    env: {
      ...process.env,
      PAGEDJS_TIMEOUT: String(PAGEDJS_TIMEOUT_MS),
    },
  });
}

async function generateHtmlFileFromResume(resumePath) {
  const resumeRaw = await fs.readFile(resumePath, "utf8");

  const resumeData = JSON.parse(resumeRaw);

  const renderOptions = buildRenderOptions(resumeData, resumePath);
  const html = theme.render(resumeData, renderOptions);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "resume-pagedjs-"));
  const htmlPath = path.join(tempDir, "resume.html");
  await fs.writeFile(htmlPath, html, "utf8");
  return htmlPath;
}
