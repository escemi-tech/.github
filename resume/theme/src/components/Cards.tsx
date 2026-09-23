import type { ReactNode } from "react";
import type { CommunityEntry, ProjectEntry } from "../types/resume";
import { formatDateRange } from "../utils/resumeHelpers";
import { renderEmphasizedText } from "../utils/text";
import { sanitize } from "../utils/text";
import { displayUrl } from "../utils/url";
import { safeUrl } from "../utils/url";
import { Bullets } from "./Bullets";

type CardProps = {
  variant?: "project" | "community";
  title: string;
  meta?: string | null;
  subtitle?: string;
  summaryContent?: ReactNode;
  linkHref?: string | null;
  linkLabel?: string | null;
  badges?: string[];
  keywords?: string[];
  highlights?: string[];
  footerLeft?: string;
};

function Card({
  variant = "project",
  title,
  meta,
  subtitle,
  summaryContent,
  linkHref,
  linkLabel,
  badges = [],
  keywords = [],
  highlights = [],
  footerLeft,
}: CardProps) {
  const className =
    variant === "community" ? "card card--community" : "card card--project";

  if (variant === "project") {
    return (
      <article className={className}>
        <header className="card__header card__header--project">
          <div className="card__heading">
            <div className="card__title">{title}</div>
            <div className="card__subtitle">{subtitle || ""}</div>
          </div>

          {badges.length ? (
            <div className="card__badges">
              {badges.map((badge) => (
                <span className="card-chip" key={badge}>
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {meta ? <div className="card__meta">{meta}</div> : null}

        {summaryContent ? (
          <p className="card__summary">
            <span>{summaryContent}</span>
          </p>
        ) : null}

        {highlights.length ? (
          <div className="card__highlights">
            <Bullets highlights={highlights} preferResults={false} />
          </div>
        ) : null}

        {keywords.length ? (
          <div className="card__keywords">
            {keywords.map((keyword) => (
              <span className="card-chip card-chip--ghost" key={keyword}>
                {keyword}
              </span>
            ))}
          </div>
        ) : null}

        {linkHref && linkLabel ? (
          <footer className="card__footer">
            <a className="card__link" href={linkHref}>
              {linkLabel}
            </a>
          </footer>
        ) : null}
      </article>
    );
  }

  if (variant === "community") {
    return (
      <article className={className}>
        <header className="card__header card__header--community">
          <div className="card__heading">
            <div className="card__title">{title}</div>
            {subtitle ? <div className="card__subtitle">{subtitle}</div> : null}
          </div>
          {meta ? <span className="card__badge">{meta}</span> : null}
        </header>

        {summaryContent ? (
          <p className="card__summary">
            <span>{summaryContent}</span>
          </p>
        ) : null}

        {highlights.length ? (
          <div className="card__highlights">
            <Bullets highlights={highlights} preferResults={false} />
          </div>
        ) : null}

        {footerLeft || (linkHref && linkLabel) ? (
          <footer className="card__footer card__footer--community">
            <span className="card__footerLeft">{footerLeft || ""}</span>
            {linkHref && linkLabel ? (
              <a className="card__link" href={linkHref}>
                {linkLabel}
              </a>
            ) : null}
          </footer>
        ) : null}
      </article>
    );
  }

  return (
    <article className={className}>
      <div className="card__header">
        <div className="card__title">{title}</div>
        <div className="card__meta">{meta || ""}</div>
      </div>
      <div className="card__subtitle">{subtitle || ""}</div>
      {summaryContent ? (
        <p className="card__summary">
          <span>{summaryContent}</span>
        </p>
      ) : null}
      {linkHref && linkLabel ? (
        <div className="card__footer">
          <a className="card__link" href={linkHref}>
            {linkLabel}
          </a>
        </div>
      ) : null}
    </article>
  );
}

type TwoColGridProps = {
  children: ReactNode;
};

function TwoColGrid({ children }: TwoColGridProps) {
  return <div className="grid grid--2">{children}</div>;
}

export function ProjectsGrid({
  projects,
  locale,
  presentLabel,
}: {
  projects: ProjectEntry[];
  locale: string;
  presentLabel: string;
}) {
  const cards = projects
    .map((entry) => {
      const name = sanitize(entry.name);
      const org = sanitize(entry.organization || entry.entity);
      const range = formatDateRange(
        entry.startDate,
        entry.endDate,
        locale,
        presentLabel,
      );
      const typeLabel = sanitize(entry.type)
        ? sanitize(entry.type)
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "";
      const meta = [range, typeLabel].filter(Boolean).join(" · ");
      const summary = sanitize(entry.description);
      const roleBadges = (entry.roles ?? [])
        .map((r) => sanitize(r))
        .filter(Boolean)
        .slice(0, 3);
      const keywordBadges = (entry.keywords ?? [])
        .map((k) => sanitize(k))
        .filter(Boolean)
        .slice(0, 6);
      const highlights = (entry.highlights ?? []).slice(0, 2);
      const href = safeUrl(entry.url);
      const label = displayUrl(entry.url);

      if (!name && !org && !summary) return null;

      return (
        <Card
          key={entry.id || `${name}-${org}-${range || ""}`}
          variant="project"
          title={name}
          meta={meta}
          subtitle={org}
          summaryContent={summary ? renderEmphasizedText(summary) : null}
          badges={roleBadges}
          keywords={keywordBadges}
          highlights={highlights}
          linkHref={label && href !== "#" ? href : null}
          linkLabel={label && href !== "#" ? label : null}
        />
      );
    })
    .filter(Boolean);

  if (!cards.length) return null;
  return <TwoColGrid>{cards}</TwoColGrid>;
}

export function CommunityGrid({
  items,
  locale,
  presentLabel,
}: {
  items: CommunityEntry[];
  locale: string;
  presentLabel: string;
}) {
  const cards = items
    .map((entry) => {
      const org = sanitize(entry.organization || entry.name);
      const role = sanitize(entry.position);
      const range = formatDateRange(
        entry.startDate,
        entry.endDate,
        locale,
        presentLabel,
      );
      const summary = sanitize(entry.summary);
      const location = sanitize(entry.location);
      const highlights = (entry.highlights ?? []).slice(0, 2);
      const href = safeUrl(entry.url);
      const label = displayUrl(entry.url);

      if (!org && !role && !summary) return null;

      return (
        <Card
          key={entry.id || `${org}-${role}-${range || ""}`}
          variant="community"
          title={org}
          meta={range}
          subtitle={role}
          summaryContent={summary ? renderEmphasizedText(summary) : null}
          highlights={highlights}
          footerLeft={location}
          linkHref={label && href !== "#" ? href : null}
          linkLabel={label && href !== "#" ? label : null}
        />
      );
    })
    .filter(Boolean);

  if (!cards.length) return null;
  return <TwoColGrid>{cards}</TwoColGrid>;
}
