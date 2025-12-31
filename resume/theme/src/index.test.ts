import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type { ResolvedResume } from "../../resolve-resume";
import { resolveResume } from "../../resolve-resume";
import { render } from "./index";

const resumePath = path.resolve(process.cwd(), "../resume.en.json");
let resume: ResolvedResume;

beforeAll(async () => {
  resume = await resolveResume(resumePath);
});

describe("render", () => {
  it("wraps the rendered React markup inside a printable HTML document", () => {
    const html = render(resume, { locale: "en", title: "Test" });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<html lang="en"');
    expect(html).toContain("resume-root");
    expect(html).toContain("<style>");
    expect(html).toContain('data-enforce="pagedjs"');
  });

  it("throws when no resume payload is provided", () => {
    // @ts-expect-error - intentionally passing an invalid payload for testing
    expect(() => render(undefined)).toThrow();
  });

  it("merges shared resume data from the common source", () => {
    expect(resume.basics?.name).toBe("Emilien Escalle");
    expect(resume.certificates?.[0]?.issuer).toBe("The Linux Foundation");
    expect(resume).not.toHaveProperty("extends");
  });
});
