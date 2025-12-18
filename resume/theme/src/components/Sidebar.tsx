import type { Certificate, Education, Language, SkillGroup } from "../types/resume";
import { formatDateRange } from "../utils/resumeHelpers";
import { sanitize } from "../utils/text";
import { renderEmojiText } from "../utils/emoji";
import { joinDefined } from "../utils/text";

export function SkillGroups({ skills }: { skills: SkillGroup[] }) {
  const groups = skills
    .filter((group) => sanitize(group.name) || (group.keywords ?? []).length)
    .slice(0, 4);

  if (!groups.length) return null;

  return (
    <div className="stack stack--sm">
      {groups.map((group, index) => {
        const keywords = (group.keywords ?? []).slice(0, 7);
        return (
          <div className="kv" key={`${group.name || "skills"}-${index}`}>
            <div className="kv__key">{renderEmojiText(group.name || "")}</div>
            <div className="kv__value">
              {keywords.map((keyword) => (
                <span className="chip" key={keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LanguagesList({ languages }: { languages: Language[] }) {
  const entries = languages
    .slice(0, 3)
    .map((entry) => {
      const language = sanitize(entry.language);
      const fluency = sanitize(entry.fluency);
      if (!language && !fluency) return null;
      return { language, fluency };
    })
    .filter(Boolean) as Array<{ language: string; fluency: string }>;

  if (!entries.length) return null;

  return (
    <div className="stack stack--xs">
      {entries.map((entry, index) => (
        <div className="kv" key={`${entry.language}-${index}`}>
          <div className="kv__key">{entry.language}</div>
          <div className="kv__value">{entry.fluency}</div>
        </div>
      ))}
    </div>
  );
}

export function EducationList({ education, locale }: { education: Education[]; locale: string }) {
  const entries = education
    .slice(0, 2)
    .map((entry) => {
      const institution = sanitize(entry.institution);
      const area = sanitize(entry.area);
      const studyType = sanitize(entry.studyType);
      const range = formatDateRange(entry.startDate, entry.endDate, locale);
      if (!institution && !area && !studyType) return null;

      const titleText = joinDefined(studyType, area);
      const institutionText = institution;

      return {
        titleText,
        institutionText,
        range,
      };
    })
    .filter(Boolean) as Array<{ titleText: string; institutionText: string; range: string | null }>;

  if (!entries.length) return null;

  return (
    <div className="stack stack--sm">
      {entries.map((entry, index) => (
        <div className="entry" key={`${entry.titleText}-${index}`}>
          <div className="entry__header">
            <div className="entry__title">{entry.titleText}</div>
            <div className="entry__meta">{entry.range || ""}</div>
          </div>
          <div className="entry__subtitle">{entry.institutionText}</div>
        </div>
      ))}
    </div>
  );
}

export function CertificatesList({ certificates, locale }: { certificates: Certificate[]; locale: string }) {
  const entries = certificates
    .slice(0, 2)
    .map((entry) => {
      const name = sanitize(entry.name);
      const issuer = sanitize(entry.issuer);
      const date = sanitize(entry.date);
      const dateLabel = date ? formatDateRange(date, date, locale) : null;
      if (!name && !issuer) return null;

      const nameText = name;
      const issuerText = issuer;

      return {
        nameText,
        issuerText,
        dateLabel,
      };
    })
    .filter(Boolean) as Array<{ nameText: string; issuerText: string; dateLabel: string | null }>;

  if (!entries.length) return null;

  return (
    <div className="stack stack--sm">
      {entries.map((entry, index) => (
        <div className="entry" key={`${entry.nameText}-${index}`}>
          <div className="entry__header">
            <div className="entry__title">{entry.nameText}</div>
            <div className="entry__meta">{entry.dateLabel || ""}</div>
          </div>
          <div className="entry__subtitle">{entry.issuerText}</div>
        </div>
      ))}
    </div>
  );
}
