import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "./index";

const resumePath = path.resolve(process.cwd(), "../resume.en.json");
const resume = JSON.parse(readFileSync(resumePath, "utf8")) as Record<
  string,
  unknown
>;

describe("render", () => {
  it("wraps the rendered React markup inside a printable HTML document", () => {
    const html = render(resume, { locale: "en", title: "Test" });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<html lang="en"');
    expect(html).toContain("resume-root");
    expect(html).toContain("<style>");
  });

  it("throws when no resume payload is provided", () => {
    // @ts-expect-error - intentionally passing an invalid payload for testing
    expect(() => render(undefined)).toThrow();
  });
});
