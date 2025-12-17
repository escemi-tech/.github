#!/usr/bin/env node

/**
 * Discover all resume JSON files in the repository.
 * Supports the following patterns:
 * - resume.<lang>.json (e.g., resume.en.json, resume.fr.json)
 * - resume.<lang>.<position>.json (e.g., resume.en.cto.json, resume.fr.lead-dev.json)
 */

const fs = require("fs");
const path = require("path");

// Navigate from .github/actions/get-available-resumes to the root, then to resume
// Path: .github/actions/get-available-resumes -> .github/actions -> .github -> root -> resume
const RESUME_DIR = path.resolve(__dirname, "../../../resume");
const PDF_OUTPUT_DIR = path.join(RESUME_DIR, "pdf");

// Supported languages
const SUPPORTED_LANGUAGES = ["en", "fr"];

// Regex to match resume files: resume.<lang>[.<position>].json
const RESUME_FILE_PATTERN = /^resume\.([a-z]{2})(?:\.([a-z-]+))?\.json$/;

function discoverResumeFiles() {
  const files = fs.readdirSync(RESUME_DIR);
  const resumes = [];

  for (const file of files) {
    const match = file.match(RESUME_FILE_PATTERN);
    if (match) {
      const [, language, position] = match;

      // Only include supported languages
      if (!SUPPORTED_LANGUAGES.includes(language)) {
        console.warn(`⚠️  Skipping unsupported language: ${file}`);
        continue;
      }

      const positionSlug = position || "default";
      const pdfFileName = position
        ? `resume.${language}.${position}.pdf`
        : `resume.${language}.pdf`;

      // Use relative paths from repository root for GitHub Actions compatibility
      const resumePath = `resume/${file}`;
      const pdfPath = `resume/pdf/${pdfFileName}`;

      // Keep absolute paths for local filesystem access (for Makefile usage)
      const resumeAbsPath = path.join(RESUME_DIR, file);
      const pdfAbsPath = path.join(PDF_OUTPUT_DIR, pdfFileName);

      resumes.push({
        file,
        path: resumePath,
        absPath: resumeAbsPath,
        language,
        position: positionSlug,
        pdfPath,
        pdfAbsPath,
        pdfFileName,
      });
    }
  }

  return resumes;
}

function main() {
  const resumes = discoverResumeFiles();

  if (resumes.length === 0) {
    console.error("❌ No resume files found matching the pattern.");
    process.exit(1);
  }

  console.log(`✅ Found ${resumes.length} resume file(s):`);
  resumes.forEach((resume) => {
    const positionLabel =
      resume.position === "default" ? "" : ` (${resume.position})`;
    console.log(`   - ${resume.file} [${resume.language}]${positionLabel}`);
  });

  // Output as JSON for GitHub Actions
  if (process.argv.includes("--json")) {
    console.log("\n--- JSON Output ---");
    console.log(JSON.stringify(resumes, null, 2));
  }

  // Output as matrix for GitHub Actions
  if (process.argv.includes("--matrix")) {
    const matrix = {
      include: resumes.map((r) => ({
        "resume-file": r.file,
        "resume-path": r.path,
        language: r.language,
        position: r.position,
        "pdf-path": r.pdfPath,
        "pdf-filename": r.pdfFileName,
      })),
    };
    console.log("\n--- GitHub Actions Matrix ---");
    console.log(JSON.stringify(matrix, null, 2));
  }
}

if (require.main === module) {
  main();
}

module.exports = { discoverResumeFiles };
