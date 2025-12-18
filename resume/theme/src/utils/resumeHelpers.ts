import type { ExperienceEntry, ResumeStrings } from "../types/resume";
import { parseDate } from "./text";

const STRINGS: Record<string, ResumeStrings> = {
  en: {
    sections: {
      professional: "💼 Professional Experience",
      projects: "🚀 Key Projects",
      community: "🤝 Community Leadership",
      skills: "⚙ Skills",
      languages: "🌍 Languages",
      education: "🎓 Education",
      certificates: "🏅 Certifications",
    },
    labels: {
      present: "Present",
    },
  },
  fr: {
    sections: {
      professional: "💼 Expériences Professionnelles",
      projects: "🚀 Projets Clés",
      community: "🤝 Engagement Communautaire",
      skills: "⚙ Compétences",
      languages: "🌍 Langues",
      education: "🎓 Formation",
      certificates: "🏅 Certifications",
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
export const extractResultsSnippet = (value: string): string => {
  const text = value.trim();
  if (!text) return "";

  const markers = ["Results:", "Result:", "Résultats:", "Résultat:"];
  for (const marker of markers) {
    const index = text.toLowerCase().indexOf(marker.toLowerCase());
    if (index >= 0) {
      return text.slice(index + marker.length).trim();
    }
  }

  return text;
};
