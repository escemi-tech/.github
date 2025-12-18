import { describe, expect, it } from "vitest";
import { escapeHtml } from "./escapeHtml";

describe("escapeHtml", () => {
  it("returns empty string for nullish values", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("escapes HTML special characters", () => {
    expect(escapeHtml("&<>\"'")).toBe("&amp;&lt;&gt;&quot;&#39;");
  });

  it("stringifies non-string values", () => {
    expect(escapeHtml(42)).toBe("42");
    expect(escapeHtml(false)).toBe("false");
  });
});
