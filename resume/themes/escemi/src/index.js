import React from "react";
import { renderToString } from "react-dom/server";
import fs from "fs";
import path from "path";
import Resume from "./Resume.jsx";

/**
 * JSON Resume ESCEMI Theme - React Edition
 * Professional theme optimized for senior technical profiles
 * Implements CV Coach methodology for maximum impact
 *
 * @param {Object} resume - JSON Resume object
 * @param {Object} [options] - Rendering options
 * @returns {string} Complete HTML document
 */
const tailwindOutputPath = path.join(__dirname, "tailwind.css");
let cachedStyles = null;

function getTailwindStyles() {
  if (cachedStyles) {
    return cachedStyles;
  }

  try {
    cachedStyles = fs.readFileSync(tailwindOutputPath, "utf8");
    return cachedStyles;
  } catch (error) {
    console.warn(
      "[jsonresume-theme-escemi] Tailwind CSS bundle missing. Returning basic markup.",
      error,
    );
    return "";
  }
}

export function render(resume, options = {}) {
  const {
    locale = "en",
    dir = "ltr",
    title = resume.basics?.name || "Resume",
  } = options;

  const html = renderToString(<Resume resume={resume} locale={locale} />);
  const styles = getTailwindStyles();

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
  ${html}
</body>
</html>`;
}

export { Resume };
export default { render };
