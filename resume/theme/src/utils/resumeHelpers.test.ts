import { describe, expect, it } from "vitest";
import {
  experienceKey,
  extractBaseline,
  extractResultsSnippet,
  formatDateRange,
  getStrings,
  selectFeatured,
  splitExperiences,
  stripBaseline,
} from "./resumeHelpers";
import { ExperienceEntry } from "../types/resume";

describe("getStrings", () => {
  it("falls back to English", () => {
    expect(getStrings()).toEqual(getStrings("en"));
  });

  it("maps locale to language", () => {
    expect(getStrings("fr-FR").labels.present).toBe("Aujourd'hui");
  });
});

describe("selectFeatured", () => {
  it("filters out entries with featured=false", () => {
    const entries = [
      { id: 1, featured: true },
      { id: 2, featured: false },
    ];
    expect(selectFeatured(entries)).toEqual([{ id: 1, featured: true }]);
  });

  it("returns original list when filtering yields empty", () => {
    const entries = [{ id: 1, featured: false }];
    expect(selectFeatured(entries)).toEqual(entries);
  });
});

describe("baseline helpers", () => {
  it("extracts a baseline line when it matches the pattern", () => {
    const baseline = "10+ years · 3 countries";
    expect(extractBaseline(`${baseline}\nMore text`)).toBe(baseline);
    expect(stripBaseline(`${baseline}\nMore text`)).toBe("More text");
  });

  it("keeps summary intact when no baseline is present", () => {
    const summary = "No numbers here\nSecond line";
    expect(extractBaseline(summary)).toBeNull();
    expect(stripBaseline(summary)).toBe(summary);
  });
});

describe("formatDateRange", () => {
  it("formats month/year and uses present label when end is missing", () => {
    const result = formatDateRange("2020-01-01", undefined, "en-US", "Present");
    expect(result).toBe("Jan 2020 – Present");
  });

  it("returns null when both dates are missing", () => {
    expect(formatDateRange(undefined, undefined)).toBeNull();
  });
});

describe("splitExperiences", () => {
  it("splits experiences into spotlight and timeline", () => {
    const entries = [
      { id: "a" },
      { id: "b" },
      { id: "c" },
    ] as unknown as ExperienceEntry[];
    const { spotlight, timeline } = splitExperiences(entries, 2);
    expect(spotlight).toHaveLength(2);
    expect(timeline).toHaveLength(1);
  });
});

describe("experienceKey", () => {
  it("creates a stable key from available fields", () => {
    expect(
      experienceKey({ id: "1", organization: "Org", title: "Title" }, 0),
    ).toBe("1::Org::Title");
  });

  it("falls back to index-based key", () => {
    expect(experienceKey({}, 3)).toBe("experience-3");
  });
});

describe("extractResultsSnippet", () => {
  it("extracts text after Results markers", () => {
    expect(extractResultsSnippet("Results: shipped 3 features")).toBe(
      "shipped 3 features",
    );
    expect(extractResultsSnippet("Résultats: +20% perf")).toBe("+20% perf");
  });

  it("returns trimmed input when no marker is present", () => {
    expect(extractResultsSnippet("  Nothing special  ")).toBe(
      "Nothing special",
    );
  });
});
