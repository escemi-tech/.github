const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const themePath = path.join(__dirname, "../../../resume/themes/escemi");
const theme = require(themePath);

const resumePath =
  process.argv[2] || path.join(__dirname, "../../../resume/resume.en.json");
const outputPath = process.argv[3] || "/tmp/resume-preview.png";

async function generatePreview() {
  try {
    const resumeData = JSON.parse(fs.readFileSync(resumePath, "utf-8"));
    const html = theme.render(resumeData);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 1.5,
    });
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.screenshot({
      path: outputPath,
      fullPage: false,
    });

    await browser.close();

    console.log(`✅ Preview generated: ${outputPath}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

generatePreview();
