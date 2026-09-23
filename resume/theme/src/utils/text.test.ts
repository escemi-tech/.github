import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { escapeHtml } from "./escapeHtml";
import { emphasize } from "./text";
import { renderEmphasizedText } from "./text";

describe("emphasize", () => {
  it("highlights space-separated thousands with plus suffix", () => {
    const html = emphasize(escapeHtml("1 200+"));
    expect(html).toBe("<strong>1 200+</strong>");
  });

  it("highlights decimal star ratings", () => {
    const html = emphasize(escapeHtml("4,8★"));
    expect(html).toBe("<em>4,8★</em>");
  });

  it("highlights escaped comparator + number + unit", () => {
    const html = emphasize(escapeHtml("<300ms"));
    expect(html).toBe("<em>&lt;300ms</em>");
  });

  it("renders escaped emphasis without inner HTML injection", () => {
    const markup = renderToStaticMarkup(
      createElement("span", null, renderEmphasizedText("<300ms and 1 200+")),
    );

    expect(markup).toBe(
      "<span><em>&lt;300ms</em> and <strong>1 200+</strong></span>",
    );
  });
});
