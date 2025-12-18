import type { RenderOptions, ResumeSchema } from "./types/resume";
import styles from "./styles.css?inline";
import { renderPagedResume } from "./paged/renderPagedResume";

import pagedPolyfill from "/node_modules/pagedjs/dist/paged.polyfill.js?raw";

export function render(resume: ResumeSchema, options: RenderOptions = {}): string {
  if (!resume) {
    throw new Error("[@escemi/jsonresume-theme] resume payload is required");
  }

  const {
    locale = "en",
    dir = "ltr",
    title = resume.basics?.name || "Resume",
  } = options;

  const markup = renderPagedResume(resume, { locale });

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${styles}</style>
  <script data-enforce="pagedjs">${pagedPolyfill}</script>
</head>
<body>
  ${markup}
</body>
</html>`;
}
export type { RenderOptions, ResumeSchema };

export default { render };
