import type { ExperienceEntry, ResumeStrings } from "../types/resume";

const STRINGS: Record<string, ResumeStrings> = {
  en: {
    sections: {
      impact: "Impact Missions",
      professional: "Professional Experience",
      projects: "Key Projects",
      community: "Community Leadership",
      skills: "Skills",
      languages: "Languages",
      education: "Education",
      certificates: "Certifications",
    },
    labels: {
      present: "Present",
    },
  },
  fr: {
    sections: {
      impact: "Expériences Professionnelles",
      professional: "Expériences Professionnelles",
      projects: "Projets Clés",
      community: "Engagement Communautaire",
      skills: "Compétences",
      languages: "Langues",
      education: "Formation",
      certificates: "Certifications",
    },
    labels: {
      present: "Aujourd'hui",
    },
  },
};

export const getStrings = (locale?: string): ResumeStrings => {
  const language = locale?.split("-")[0]?.toLowerCase();
  return STRINGS[language || "en"] || STRINGS.en;
};

export const sanitize = (value?: string | null): string => value?.trim() || "";

export const displayUrl = (value?: string | null): string =>
  sanitize(value)
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");

type FeatureFlag = { featured?: boolean };

export const selectFeatured = <T>(entries: T[] = []): T[] => {
  if (!entries.length) return [];
  const visible = entries.filter((entry) =>
    typeof entry === "object" &&
    entry !== null &&
    "featured" in (entry as FeatureFlag)
      ? (entry as FeatureFlag).featured !== false
      : true,
  );
  return visible.length ? visible : entries;
};

export const extractBaseline = (summary?: string | null): string | null => {
  if (!summary) return null;
  const [firstLine] = summary.split("\n");
  return /\d+.*·.*\d+/.test(firstLine?.trim() || "") ? firstLine.trim() : null;
};

export const stripBaseline = (summary?: string | null): string => {
  if (!summary) return "";
  const [firstLine, ...rest] = summary.split("\n");
  if (/\d+.*·.*\d+/.test(firstLine?.trim() || "")) {
    return rest.join("\n").trim();
  }
  return summary.trim();
};

export const emphasize = (text?: string | null): string => {
  if (!text) return "";
  let value = text;
  const numberPattern = String.raw`(?:\d{1,3}(?:[.,]\d{3})+|\d+)(?:[.,]\d+)?`;
  const numberRangePattern = String.raw`${numberPattern}(?:[KMB])?(?:\s*[-–]\s*${numberPattern}(?:[KMB])?)?`;
  const currencySegments: Array<{ token: string; content: string }> = [];
  const toCurrencyPlaceholder = (content: string) => {
    const token = `@@CURRENCY_HL_${currencySegments.length}@@`;
    currencySegments.push({ token, content });
    return token;
  };
  value = value.replace(
    new RegExp(`([€$£])(\\s*)(${numberRangePattern})`, "gi"),
    (match, symbol, spacing, amount) =>
      toCurrencyPlaceholder(`<strong>${symbol}${spacing}${amount}</strong>`),
  );
  value = value.replace(
    new RegExp(`(${numberRangePattern})(\\s*)([€$£])`, "gi"),
    (match, amount, spacing, symbol) =>
      toCurrencyPlaceholder(`<strong>${amount}${spacing}${symbol}</strong>`),
  );
  value = value.replace(
    /(\d+(?:-\d+)?\s+[a-z]+\s+to\s+\d+(?:-\d+)?\s+[a-z]+)/gi,
    "<em>$1</em>",
  );
  value = value.replace(
    /(\d+(?:\.\d+)?\s*[a-z]+\s*→\s*\d+(?:\.\d+)?\s*[a-z]+)/gi,
    "<em>$1</em>",
  );
  value = value.replace(
    new RegExp(`([+\\-~]?${numberPattern}%)`, "g"),
    "<em>$1</em>",
  );
  value = value.replace(
    new RegExp(`(${numberPattern}[KMB])`, "gi"),
    "<strong>$1</strong>",
  );
  value = value.replace(
    new RegExp(`(${numberPattern}\\+)`, "g"),
    "<strong>$1</strong>",
  );
  currencySegments.forEach(({ token, content }) => {
    value = value.replace(token, content);
  });
  return value;
};

export const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDateRange = (
  start?: string,
  end?: string,
  locale: string = "en",
  presentLabel = "Present",
): string | null => {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  if (!startDate && !endDate) return null;
  const formatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  });
  const startLabel = startDate ? formatter.format(startDate) : "";
  const endLabel = endDate ? formatter.format(endDate) : presentLabel;
  return [startLabel, endLabel].filter(Boolean).join(" – ");
};

export const FIRST_PAGE_EXPERIENCES = 2;

export const splitExperiences = <T extends ExperienceEntry>(
  entries: T[] = [],
  spotlightSize = FIRST_PAGE_EXPERIENCES,
): { spotlight: T[]; timeline: T[] } => {
  if (!entries.length) {
    return { spotlight: [], timeline: [] };
  }
  const safeSize = Math.max(0, spotlightSize);
  return {
    spotlight: entries.slice(0, safeSize),
    timeline: entries.slice(safeSize),
  };
};

export const experienceKey = (
  entry: Partial<ExperienceEntry> = {},
  index = 0,
): string => {
  const tokens = [
    entry.id,
    entry.name,
    entry.organization,
    entry.position,
    entry.title,
    entry.client,
    entry.entity,
    entry.startDate,
    entry.endDate,
  ].filter(Boolean);
  return tokens.length ? tokens.join("::") : `experience-${index}`;
};
