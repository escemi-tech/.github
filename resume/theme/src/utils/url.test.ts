import { describe, expect, it } from "vitest";
import { displayUrl, safeUrl } from "./url";

describe("safeUrl", () => {
  it("returns fallback for empty input", () => {
    expect(safeUrl(undefined)).toBe("#");
    expect(safeUrl(null)).toBe("#");
    expect(safeUrl("   ")).toBe("#");
  });

  it("prepends https:// when protocol is missing", () => {
    expect(safeUrl("example.com")).toBe("https://example.com/");
  });

  it("allows http/https and blocks javascript: URLs", () => {
    expect(safeUrl("https://example.com")).toBe("https://example.com/");
    expect(safeUrl("javascript:alert(1)")).toBe("#");
  });

  it("handles mailto and tel as passthrough when allowed", () => {
    expect(safeUrl("mailto:test@example.com")).toBe("mailto:test@example.com");
    expect(safeUrl("tel:+33123456789")).toBe("tel:+33123456789");
  });

  it("supports overriding allowed protocols", () => {
    expect(
      safeUrl("https://example.com", { allowedProtocols: ["http:"] }),
    ).toBe("#");
  });
});

describe("displayUrl", () => {
  it("removes scheme and trailing slash", () => {
    expect(displayUrl("https://example.com/")).toBe("example.com");
  });

  it("returns trimmed string for non-http values", () => {
    expect(displayUrl("  mailto:test@example.com ")).toBe(
      "mailto:test@example.com",
    );
  });
});
