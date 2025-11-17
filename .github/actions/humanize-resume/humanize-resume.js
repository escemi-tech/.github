import { humanizeString } from "humanize-ai-lib";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const HUMANIZE_OPTIONS = {
  transformHidden: true,
  transformTrailingWhitespace: true,
  transformNbs: true,
  transformDashes: true,
  transformQuotes: true,
  transformOther: true,
  keyboardOnly: false,
};

const rawArgs = process.argv.slice(2);
const flagArgs = new Set(rawArgs.filter((value) => value.startsWith("--")));
const fileArgs = rawArgs.filter((value) => !value.startsWith("--"));
const files = fileArgs.length > 0 ? fileArgs : [];
const humanizeOptions = {
  ...HUMANIZE_OPTIONS,
  keyboardOnly: flagArgs.has("--keyboard-only")
    ? true
    : HUMANIZE_OPTIONS.keyboardOnly,
};

if (files.length === 0) {
  console.error("[humanize] No resume files provided.");
  process.exit(1);
}

const cwd = process.cwd();
const errors = [];

for (const file of files) {
  const resolvedPath = path.resolve(cwd, file);
  try {
    await processFile(resolvedPath, humanizeOptions);
  } catch (error) {
    errors.push({ file: resolvedPath, error });
  }
}

if (errors.length > 0) {
  for (const { file, error } of errors) {
    console.error(`❌ Failed to humanize ${file}: ${error.message}`);
  }
  process.exit(1);
}

async function processFile(filePath, options) {
  const raw = await readFile(filePath, "utf8");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }

  const baseline = JSON.stringify(parsed, null, 2) + "\n";
  const stats = { totalStrings: 0, updatedStrings: 0, normalizedSymbols: 0 };

  humanizeNode(parsed, stats, options);

  const result = JSON.stringify(parsed, null, 2) + "\n";
  const relativePath = path.relative(cwd, filePath) || filePath;

  if (baseline !== result) {
    await writeFile(filePath, result);
    console.log(
      `✨ ${relativePath} humanized (${stats.updatedStrings}/${stats.totalStrings} strings updated, ${stats.normalizedSymbols} symbols normalized)`,
    );
  } else {
    console.log(
      `✅ ${relativePath} already clean (${stats.totalStrings} strings inspected, ${stats.updatedStrings} updates required)`,
    );
  }
}

function humanizeNode(node, stats, options) {
  if (typeof node === "string") {
    stats.totalStrings += 1;
    const { text, count = 0 } = humanizeString(node, options);
    if (text !== node) {
      stats.updatedStrings += 1;
      stats.normalizedSymbols += count;
      return text;
    }
    return node;
  }

  if (Array.isArray(node)) {
    for (let index = 0; index < node.length; index += 1) {
      node[index] = humanizeNode(node[index], stats, options);
    }
    return node;
  }

  if (node && typeof node === "object") {
    for (const key of Object.keys(node)) {
      node[key] = humanizeNode(node[key], stats, options);
    }
    return node;
  }

  return node;
}
