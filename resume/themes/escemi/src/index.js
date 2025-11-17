import React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
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

    // ESCEMI + CV Coach Design Tokens
    const designTokens = `
    :root {
      /* ESCEMI Brand Colors */
      --escemi-primary: #1c3144;
      --escemi-secondary: #ecb807;
      
      /* CV Coach Color Scheme */
      --challenge-bg: #fef3c7;
      --challenge-border: #f59e0b;
      --results-bg: #d1fae5;
      --results-border: #10b981;
      --action-color: #4338ca;
      
      /* Typography */
      --resume-font-sans: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      
      /* Color System */
      --color-text-primary: #1f2937;
      --color-text-secondary: #4b5563;
      --color-text-light: #6b7280;
      --color-background: #fff;
      --color-sidebar: #1c3144;
      --color-main: #f5f2ed;
      --color-border: #e5e7eb;
      --color-accent-light: #f8f9fa;
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      
      /* Enable better PDF rendering */
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }

    /* PDF-specific page settings */
    @page {
      size: A4;
      margin: 12mm 15mm;
    }

    @media print {
      body {
        background: #fff;
      }

      /* Ensure colors are preserved in PDF */
      * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
      }
    }
  `;

    return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- ESCEMI + CV Coach Design Tokens -->
  <style>
    ${designTokens}
  </style>

  <!-- Styled Components CSS -->
  ${styles}

  <!-- Global Styles -->
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
