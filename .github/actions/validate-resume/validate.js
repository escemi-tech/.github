#!/usr/bin/env node
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const { resolveResumeToFile } = require(
  path.resolve(__dirname, "../../../resume/resolve-resume"),
);
const execFileAsync = promisify(execFile);
const RESUME_BIN = path.resolve(__dirname, "node_modules/.bin/resume");

async function main() {
  const resumeArg = process.argv[2];

  if (!resumeArg) {
    console.error("Usage: node validate.js <resume.json>");
    process.exit(1);
  }

  const { path: resolvedResumePath } = await resolveResumeToFile(
    path.resolve(resumeArg),
  );

  await runValidation(resolvedResumePath);
}

async function runValidation(resumePath) {
  await execFileAsync(RESUME_BIN, ["validate", "--resume", resumePath], {
    cwd: __dirname,
    stdio: "inherit",
  });
}

main().catch((error) => {
  console.error(`[validate-resume] ${error.message}`);
  process.exit(1);
});
