#!/usr/bin/env node
/* global document */
const fs = require("node:fs/promises");
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const puppeteer = require("puppeteer");
const theme = require("jsonresume-theme-escemi");

const execFileAsync = promisify(execFile);

const FALLBACK_LOCALE = "en";
const COUNTRY_LOCALE_MAP = {
  FR: "fr",
  EN: "en",
  US: "en",
  GB: "en",
};

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
      `📉 PDF optimized: ${Math.round(originalStats.size / 1024)}KB → ${Math.round(optimizedStats.size / 1024)}KB (${reduction.toFixed(1)}% reduction)`,
    );
  } finally {
    await fs.unlink(tempPath).catch(() => {});
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

  const resumeRaw = await fs.readFile(resumePath, "utf8").catch((error) => {
    console.error(
      `Unable to read resume file at ${resumePath}:`,
      error.message,
    );
    process.exit(1);
  });

  let resumeData;
  try {
    resumeData = JSON.parse(resumeRaw);
  } catch (error) {
    console.error(`Invalid JSON in resume file: ${error.message}`);
    process.exit(1);
  }

  const renderOptions = buildRenderOptions(resumeData, resumePath);
  const html = theme.render(resumeData, renderOptions);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: null,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log(`✅ Resume PDF created: ${outputPath}`);

    await optimizePdf(outputPath);
  } catch (error) {
    console.error("Failed to generate PDF:", error.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
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
