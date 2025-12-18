import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ResumeSchema } from "../types/resume";
import { PagedResumeDocument } from "../components/PagedResumeDocument";

type RenderPagedResumeOptions = {
  locale?: string;
};

export function renderPagedResume(
  resume: ResumeSchema,
  options: RenderPagedResumeOptions = {},
): string {
  const locale = options.locale || "en";
  return renderToStaticMarkup(
    createElement(PagedResumeDocument, { resume, locale }),
  );
}
