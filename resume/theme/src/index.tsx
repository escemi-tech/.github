import { renderToString } from "react-dom/server";
import Resume from "./Resume";
import type { RenderOptions, ResumeSchema } from "./types/resume";
import styles from "./styles.css?inline";

const PAGEDJS_POLYFILL =
  "https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js";
const PAGEDJS_INTEGRITY =
  "sha384-OLBgp1GsljhM2TJ+sbHjaiH9txEUvgdDTAzHv2P24donTt6/529l+9Ua0vFImLlb";

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
  <style>${styles}</style>
  <script>
    (function() {
      if (document.querySelector('script[data-enforce="pagedjs"]')) {
        return;
      }
      var script = document.createElement("script");
      script.src = "${PAGEDJS_POLYFILL}";
      script.integrity = "${PAGEDJS_INTEGRITY}";
      script.async = true;
      script.setAttribute("crossorigin", "anonymous");
      script.dataset.enforce = "pagedjs";
      document.head.appendChild(script);
    })();
  </script>
</head>
<body>
  ${markup}
</body>
</html>`;
}

export { Resume };
export type { RenderOptions, ResumeSchema };

export default { render };
