#!/usr/bin/env node
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { execFile, spawn } = require("node:child_process");
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
const A4_MM = { width: 210, height: 297 };
const DEFAULT_LAYOUT_VALIDATION_ENABLED = true;
const EXPECTED_PDF_PAGE_COUNT = 4;

const getExpectedSectionTitles = (locale) => {
  const language = normalizeLocale(locale)?.split("-")[0];
  if (language === "fr") {
    return { projects: "Projets Clés", community: "Engagement Communautaire" };
  }
  return { projects: "Key Projects", community: "Community Leadership" };
};
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
        originalStats.size / 1024
      )}KB → ${Math.round(optimizedStats.size / 1024)}KB (${reduction.toFixed(
        1
      )}% reduction)`
    );
  } finally {
    await fs.unlink(tempPath).catch((error) => {
      console.warn(
        `⚠️ Failed to remove temporary file ${tempPath}: ${error.message}`
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
    const { htmlPath, renderOptions } = await generateHtmlFileFromResume(
      resumePath
    );
    console.log(`📝 Generated HTML at: ${htmlPath}`);

    await generatePdfFromHtml(htmlPath, outputPath, renderOptions);
    console.log(`✅ Resume PDF created: ${outputPath}`);
    if (process.env.SKIP_PDF_OPTIMIZE !== "1") {
      await optimizePdf(outputPath);
    }
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

async function generatePdfFromHtml(htmlPath, outputPath, renderOptions) {
  await generatePagedPdfFromHtml(htmlPath, outputPath, renderOptions);
}

function resolveFrom(subpath, candidates) {
  return require.resolve(subpath, { paths: candidates });
}

async function generatePagedPdfFromHtml(htmlPath, outputPath, renderOptions) {
  const puppeteerPath = resolveFrom("puppeteer", [
    path.resolve(__dirname, "node_modules"),
    path.resolve(__dirname, "node_modules/pagedjs-cli/node_modules"),
  ]);
  const pdfLibPath = resolveFrom("pdf-lib", [
    path.resolve(__dirname, "node_modules"),
    path.resolve(__dirname, "node_modules/pagedjs-cli/node_modules"),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const puppeteer = require(puppeteerPath);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PDFDocument } = require(pdfLibPath);

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--disable-dev-shm-usage",
      "--export-tagged-pdf",
      "--allow-file-access-from-files",
    ],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(PAGEDJS_TIMEOUT_MS);
    await page.emulateMediaType("print");

    await page.goto(`file://${htmlPath}`, { waitUntil: "load" });

    // Our theme already inlines the Paged.js polyfill script; wait until it
    // finishes building `.pagedjs_pages`.
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".pagedjs_pages .pagedjs_page").length > 0,
      { timeout: PAGEDJS_TIMEOUT_MS }
    );
    // Give layout a short beat to settle.
    await page.waitForTimeout(200);

    const pageCount = await page.evaluate(
      () => document.querySelectorAll(".pagedjs_pages .pagedjs_page").length
    );

    const validationEnabled = (() => {
      if (process.env.SKIP_LAYOUT_VALIDATE === "1") {
        return false;
      }
      if (process.env.LAYOUT_VALIDATE === "0") {
        return false;
      }
      if (process.env.LAYOUT_VALIDATE === "1") {
        return true;
      }
      return DEFAULT_LAYOUT_VALIDATION_ENABLED;
    })();

    if (validationEnabled) {
      const { projects, community } = getExpectedSectionTitles(
        renderOptions?.locale
      );
      const result = await page.evaluate(
        ({
          expectedPageCount,
          expectedProjectsTitle,
          expectedCommunityTitle,
        }) => {
          const errors = [];
          const pagedPageCount = document.querySelectorAll(
            ".pagedjs_pages .pagedjs_page"
          ).length;
          if (pagedPageCount !== expectedPageCount) {
            errors.push(
              `Expected ${expectedPageCount} paged pages, got ${pagedPageCount}.`
            );
          }

          const selectText = (el) => (el?.textContent || "").trim();
          const page3 = document.querySelector('section.page[data-page="3"]');
          const page4 = document.querySelector('section.page[data-page="4"]');
          if (!page3) errors.push("Missing logical page 3 section.");
          if (!page4) errors.push("Missing logical page 4 section.");

          if (page3) {
            const sections = Array.from(
              page3.querySelectorAll(":scope > .section")
            );
            if (sections.length !== 1) {
              errors.push(
                `Expected 1 section on logical page 3, got ${sections.length}.`
              );
            }
            const title = selectText(page3.querySelector(".section__title"));
            if (
              title &&
              title.toLowerCase() !== expectedProjectsTitle.toLowerCase()
            ) {
              errors.push(
                `Unexpected page 3 title: "${title}" (expected "${expectedProjectsTitle}").`
              );
            }
            const cardCount = page3.querySelectorAll("article.card").length;
            if (cardCount !== 4) {
              errors.push(
                `Expected 4 project cards on logical page 3, got ${cardCount}.`
              );
            }
          }

          if (page4) {
            const sections = Array.from(
              page4.querySelectorAll(":scope > .section")
            );
            if (sections.length !== 2) {
              errors.push(
                `Expected 2 sections on logical page 4, got ${sections.length}.`
              );
            } else {
              const [projectsSection, communitySection] = sections;

              const projectsTitle = selectText(
                projectsSection.querySelector(".section__title")
              );
              if (
                projectsTitle &&
                projectsTitle.toLowerCase() !==
                  expectedProjectsTitle.toLowerCase()
              ) {
                errors.push(
                  `Unexpected page 4 projects title: "${projectsTitle}" (expected "${expectedProjectsTitle}").`
                );
              }
              const projectsCards =
                projectsSection.querySelectorAll("article.card").length;
              if (projectsCards !== 2) {
                errors.push(
                  `Expected 2 project cards on logical page 4, got ${projectsCards}.`
                );
              }

              const communityTitle = selectText(
                communitySection.querySelector(".section__title")
              );
              if (
                !communityTitle ||
                communityTitle.toLowerCase() !==
                  expectedCommunityTitle.toLowerCase()
              ) {
                errors.push(
                  `Missing/incorrect community section title on page 4: "${communityTitle}" (expected "${expectedCommunityTitle}").`
                );
              }
              const communityCards =
                communitySection.querySelectorAll("article.card").length;
              if (communityCards !== 2) {
                errors.push(
                  `Expected 2 community cards on logical page 4, got ${communityCards}.`
                );
              }
            }
          }

          return {
            ok: errors.length === 0,
            errors,
          };
        },
        {
          expectedPageCount: EXPECTED_PDF_PAGE_COUNT,
          expectedProjectsTitle: projects,
          expectedCommunityTitle: community,
        }
      );

      if (!result.ok) {
        throw new Error(
          `Layout validation failed:\n- ${result.errors.join("\n- ")}`
        );
      }
    }

    const merged = await PDFDocument.create();

    for (let index = 1; index <= pageCount; index += 1) {
      await page.evaluate((i) => {
        const styleId = "__export_one_paged_page";
        let style = document.getElementById(styleId);
        if (!style) {
          style = document.createElement("style");
          style.id = styleId;
          document.head.appendChild(style);
        }

        // Hide everything except the i-th paged page.
        style.textContent = `
          .pagedjs_page { display: none !important; }
          .pagedjs_pages .pagedjs_page:nth-child(${i}) { display: block !important; }
          .pagedjs_pages { margin: 0 !important; padding: 0 !important; }
        `;
      }, index);

      const pdfBytes = await page.pdf({
        printBackground: true,
        displayHeaderFooter: false,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        width: `${A4_MM.width}mm`,
        height: `${A4_MM.height}mm`,
        pageRanges: "1",
      });

      const doc = await PDFDocument.load(pdfBytes);
      const [copied] = await merged.copyPages(doc, [0]);
      merged.addPage(copied);
    }

    const out = await merged.save();
    await fs.writeFile(outputPath, out);
  } finally {
    await browser.close();
  }
}

function spawnStreaming(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: "inherit",
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      const suffix = signal ? ` (signal: ${signal})` : "";
      reject(
        new Error(`Command failed: ${command}${suffix} (exit code: ${code})`)
      );
    });
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
  return { htmlPath, renderOptions };
}
