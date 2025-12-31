const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Merge arrays element-by-element only when both contain objects and share the
// same length; otherwise prefer the overriding array as a whole.
const mergeArrays = (base, override) => {
  const allWithId = (arr) =>
    arr.length > 0 &&
    arr.every(
      (item) =>
        isPlainObject(item) &&
        typeof item.id === "string" &&
        item.id.trim().length > 0,
    );

  if (allWithId(base) && allWithId(override)) {
    const baseById = new Map(base.map((item) => [item.id, item]));
    const merged = override.map((item) =>
      mergeDeep(baseById.get(item.id) || {}, item),
    );
    for (const item of base) {
      if (!override.find((candidate) => candidate.id === item.id)) {
        merged.push(item);
      }
    }
    return merged;
  }

  if (
    base.length > 0 &&
    override.length > 0 &&
    base.length === override.length &&
    base.every(isPlainObject) &&
    override.every(isPlainObject)
  ) {
    return override.map((item, index) => mergeDeep(base[index], item));
  }
  if (override.length === 0) {
    return base;
  }
  return override;
};

const mergeDeep = (base, override) => {
  if (override === undefined) {
    return base;
  }

  if (Array.isArray(base) && Array.isArray(override)) {
    return mergeArrays(base, override);
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
      result[key] = mergeDeep(base[key], value);
    }
    return result;
  }

  return override;
};

/**
 * Resolve a resume file that may extend shared sources into a single payload.
 * Circular extends are guarded through the `seen` accumulator.
 * @param {string} resumePath absolute or relative path to the resume JSON file
 * @param {Set<string>} [seen=new Set()] set of absolute paths already processed
 * @returns {Promise<Record<string, unknown>>} merged resume content without extends markers
 */
async function resolveResume(resumePath, seen = new Set()) {
  const absolutePath = path.resolve(resumePath);

  if (seen.has(absolutePath)) {
    throw new Error(
      `Circular extends detected while resolving ${path.basename(resumePath)}`,
    );
  }

  seen.add(absolutePath);

  const raw = await fs.readFile(absolutePath, "utf8");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${absolutePath}: ${error.message}`);
  }

  // Allow both "extends" (primary) and "$extends" (interop-safe) markers.
  const extendsField = parsed.extends ?? parsed.$extends;
  let baseData = {};

  if (extendsField) {
    const parents = Array.isArray(extendsField) ? extendsField : [extendsField];

    for (const parent of parents) {
      if (typeof parent !== "string" || !parent.trim()) {
        throw new Error(
          `Invalid extends entry in ${absolutePath}: ${String(parent)}`,
        );
      }

      const parentPath = path.resolve(path.dirname(absolutePath), parent);
      const resolvedParent = await resolveResume(parentPath, seen);
      baseData = mergeDeep(baseData, resolvedParent);
    }
  }

  const rest = { ...parsed };
  delete rest.extends;
  delete rest.$extends;

  return mergeDeep(baseData, rest);
}

async function resolveResumeToFile(resumePath) {
  const data = await resolveResume(resumePath);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "resolved-resume-"));
  const outputPath = path.join(tempDir, path.basename(resumePath));
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
  return { path: outputPath, data };
}

if (require.main === module) {
  const [inputPath, outputPath] = process.argv.slice(2);

  if (!inputPath) {
    console.error("Usage: node resolve-resume.js <resume-path> [output.json]");
    process.exit(1);
  }

  resolveResume(inputPath)
    .then((data) => {
      const serialized = `${JSON.stringify(data, null, 2)}\n`;
      if (outputPath) {
        return fs.writeFile(outputPath, serialized);
      }
      process.stdout.write(serialized);
      return undefined;
    })
    .catch((error) => {
      console.error(`[resolve-resume] ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  resolveResume,
  resolveResumeToFile,
};
