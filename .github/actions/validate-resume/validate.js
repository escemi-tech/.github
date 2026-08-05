#!/usr/bin/env node
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const path = require("node:path");
const schema = require("@jsonresume/schema/schema.json");
const { resolveResume } = require(
  path.resolve(__dirname, "../../../resume/resolve-resume"),
);

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateResume = ajv.compile(schema);

async function main() {
  const resumeArg = process.argv[2];

  if (!resumeArg) {
    console.error("Usage: node validate.js <resume.json>");
    process.exit(1);
  }

  const resolvedResume = await resolveResume(path.resolve(resumeArg));

  runValidation(resolvedResume, resumeArg);
}

function runValidation(resume, resumeArg) {
  const isValid = validateResume(resume);

  if (isValid) {
    return;
  }

  const formattedErrors = (validateResume.errors || []).map((error) => {
    const location = error.instancePath || "/";
    const details = error.message || "schema validation failed";
    return `${location} ${details}`;
  });

  throw new Error(
    [`Invalid resume: ${resumeArg}`, ...formattedErrors].join("\n"),
  );
}

main().catch((error) => {
  console.error(`[validate-resume] ${error.message}`);
  process.exit(1);
});
