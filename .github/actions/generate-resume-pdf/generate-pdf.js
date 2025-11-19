#!/usr/bin/env node
/* global document */
const fs = require("node:fs/promises");
const path = require("node:path");
const puppeteer = require("puppeteer");
const theme = require("jsonresume-theme-escemi");

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

  const html = theme.render(resumeData);

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
