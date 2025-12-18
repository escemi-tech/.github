import { describe, expect, it } from "vitest";
import { escapeHtml } from "./escapeHtml";
import { emphasize } from "./text";

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
});
