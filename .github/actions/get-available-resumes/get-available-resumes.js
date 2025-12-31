const fs = require("node:fs");
const path = require("node:path");

const RESUME_DIR = path.resolve(__dirname, "../../../resume");
const PDF_OUTPUT_DIR = path.join(RESUME_DIR, "pdf");

// Regex to match resume files: resume.<lang>[.<position>].json
const RESUME_FILE_PATTERN = /^resume\.([a-z]{2})(?:\.([a-z-]+))?\.json$/;

function getAvailableResumes() {
  const files = fs.readdirSync(RESUME_DIR);
  const resumes = [];

  for (const file of files) {
    const match = file.match(RESUME_FILE_PATTERN);
    if (match) {
      const [, language, position] = match;

      const name = position ? `${language}.${position}` : `${language}`;
      const pdfFileName = `resume.${name}.pdf`;

      // Keep absolute paths for local filesystem access (for Makefile usage)
      const resumeAbsPath = path.join(RESUME_DIR, file);
      const pdfPath = path.join(PDF_OUTPUT_DIR, pdfFileName);

      resumes.push({
        name,
        path: resumeAbsPath,
        "pdf-path": pdfPath,
      });
    }
  }

  return resumes;
}

if (require.main === module) {
  const resumes = getAvailableResumes();
  console.log(JSON.stringify(resumes));
}

module.exports = getAvailableResumes;
