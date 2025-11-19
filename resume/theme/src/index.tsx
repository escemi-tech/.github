import { renderToString } from "react-dom/server";
import Resume from "./Resume";
import type { RenderOptions, ResumeSchema } from "./types/resume";
import styles from "./styles.css?inline";

const GOOGLE_FONTS =
  "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap";

export function render(resume: ResumeSchema, options: RenderOptions = {}): string {
  if (!resume) {
    throw new Error("[@escemi/jsonresume-theme] resume payload is required");
  }

  const {
    locale = "en",
    dir = "ltr",
    title = resume.basics?.name || "Resume",
  } = options;

  const markup = renderToString(<Resume resume={ resume } locale = { locale } />);

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${GOOGLE_FONTS}" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
  ${markup}
</body>
</html>`;
}

export { Resume };
export type { RenderOptions, ResumeSchema };

export default { render };
