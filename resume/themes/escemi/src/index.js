import React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import Resume from "./Resume.jsx";

/**
 * JSON Resume Sidebar Theme
 * Two-column layout with dark sidebar and cream main content
 *
 * @param {Object} resume - JSON Resume object
 * @param {Object} [options] - Rendering options
 * @returns {string} Complete HTML document
 */
export function render(resume, options = {}) {
  const {
    locale = "en",
    dir = "ltr",
    title = resume.basics?.name || "Resume",
  } = options;

  const sheet = new ServerStyleSheet();

  try {
    const html = renderToString(
      sheet.collectStyles(<Resume resume={resume} />),
    );

    const styles = sheet.getStyleTags();

    const fontLinks = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap"
    rel="stylesheet"
  >
`;

    const designTokens = `
    :root {
      --resume-font-sans: 'Source Sans Pro', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      --resume-color-primary: #1c3144;
      --resume-color-secondary: #ecb807;
      --resume-color-text: #1f2933;
      --resume-color-muted: #4c5a67;
      --resume-color-sidebar: #132030;
      --resume-color-sidebar-text: #f4f6fb;
      --resume-color-main: #f7f9fc;
      --resume-color-border: #d5dce3;
      --resume-color-highlight: rgba(236, 184, 7, 0.15);
      --resume-radius-panel: 12px;
      --resume-spacing-section: 40px;
    }
  `;

    const globalStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: var(--resume-font-sans);
      background: #e7ebf2;
      color: var(--resume-color-text);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        background: #fff;
      }

      @page {
        size: A4;
        margin: 0;
      }
    }
  `;

    return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>

  ${fontLinks}

  <style>
    ${designTokens}
  </style>

  ${styles}

  <style>
    ${globalStyles}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  } finally {
    sheet.seal();
  }
}

export { Resume };
export default { render };
