import type { ExperienceEntry } from "../types/resume";
import { formatDateRange } from "../utils/resumeHelpers";
import { emphasize } from "../utils/text";
import { sanitize } from "../utils/text";
import { displayUrl } from "../utils/url";
import { safeUrl } from "../utils/url";
import { escapeHtml } from "../utils/escapeHtml";
import { joinDefined } from "../utils/text";
import { Bullets } from "./Bullets";

type ExperienceSpotlightProps = {
  entries: ExperienceEntry[];
  locale: string;
  presentLabel: string;
  includeSummary?: boolean;
  preferResultsHighlights?: boolean;
};

export function ExperienceSpotlight({
  entries,
  locale,
  presentLabel,
  includeSummary = true,
  preferResultsHighlights = true,
}: ExperienceSpotlightProps) {
  const blocks = entries
    .map((entry, index) => {
      const title = joinDefined(entry.position || entry.title);
      const org = joinDefined(entry.organization || entry.entity || entry.client, entry.name);
      const location = sanitize(entry.location);
      const range = formatDateRange(entry.startDate, entry.endDate, locale, presentLabel);
      const summary = sanitize(entry.summary);
      const href = safeUrl(entry.url);
      const label = displayUrl(entry.url);
      const keywords = (entry.keywords ?? []).map((keyword) => sanitize(keyword)).filter(Boolean);

      const hasMetaRow = Boolean(range || location);

      const highlights = entry.highlights ?? [];

      if (!title && !org && !hasMetaRow && !summary && !highlights.length) return null;

      return (
        <article className="entry entry--experience" key={entry.id || `${title}-${org}-${index}`}>
          <header className="entry__header">
            {title ? <div className="entry__title">{title}</div> : null}
            {org || (label && href !== "#") ? (
              <div className="entry__subrow">
                <div className="entry__subtitle">{org}</div>
                {label && href !== "#" ? (
                  <a className="entry__link" href={href}>
                    {label}
                  </a>
                ) : null}
              </div>
            ) : null}
            {hasMetaRow ? (
              <div className="entry__metaRow">
                {range ? <div className="entry__meta">{range}</div> : null}
                {location ? <div className="entry__location">{location}</div> : null}
              </div>
            ) : null}
          </header>
          {includeSummary && summary ? (
            <p className="entry__summary" dangerouslySetInnerHTML={{ __html: emphasize(escapeHtml(summary)) }} />
          ) : null}
          <Bullets highlights={highlights} preferResults={preferResultsHighlights} />
          {keywords.length ? (
            <div className="entry__keywords" aria-label="Keywords">
              {keywords.map((keyword) => (
                <span className="chip" key={keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
        </article>
      );
    })
    .filter(Boolean);

  if (!blocks.length) return null;
  return <div className="stack stack--md">{blocks}</div>;
}

export function ExperienceTimelineCompact({
  entries,
  locale,
  presentLabel,
}: {
  entries: ExperienceEntry[];
  locale: string;
  presentLabel: string;
}) {
  const blocks = entries
    .map((entry, index) => {
      const title = joinDefined(entry.position || entry.title);
      const org = joinDefined(entry.organization || entry.entity || entry.client, entry.name);
      const location = sanitize(entry.location);
      const range = formatDateRange(entry.startDate, entry.endDate, locale, presentLabel);
      const href = safeUrl(entry.url);
      const label = displayUrl(entry.url);
      const summary = sanitize(entry.summary);
      const keywords = (entry.keywords ?? []).map((keyword) => sanitize(keyword)).filter(Boolean);

      // Keep Page 2 compact but visually identical: same structure as spotlight.
      const highlights = entry.highlights ?? [];

      if (!title && !org && !location && !range) return null;

      return (
        <article className="entry entry--experience" key={entry.id || `${title}-${org}-${index}`}>
          <header className="entry__header">
            {title ? <div className="entry__title">{title}</div> : null}
            {org || (label && href !== "#") ? (
              <div className="entry__subrow">
                <div className="entry__subtitle">{org}</div>
                {label && href !== "#" ? (
                  <a className="entry__link" href={href}>
                    {label}
                  </a>
                ) : null}
              </div>
            ) : null}
            {range || location ? (
              <div className="entry__metaRow">
                {range ? <div className="entry__meta">{range}</div> : null}
                {location ? <div className="entry__location">{location}</div> : null}
              </div>
            ) : null}
          </header>

          {summary ? (
            <p className="entry__summary" dangerouslySetInnerHTML={{ __html: emphasize(escapeHtml(summary)) }} />
          ) : null}
          <Bullets highlights={highlights} preferResults={true} />

          {keywords.length ? (
            <div className="entry__keywords" aria-label="Keywords">
              {keywords.map((keyword) => (
                <span className="chip" key={keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
        </article>
      );
    })
    .filter(Boolean);

  if (!blocks.length) return null;

  return <div className="experience-columns">{blocks}</div>;
}
