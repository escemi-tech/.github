import { safeUrl } from "../../core";
import HighlightList from "../shared/HighlightList";
import { displayUrl, formatDateRange } from "../../utils/resumeHelpers";
import type { ProjectEntry, ResumeStrings } from "../../types/resume";

type ProjectCardProps = {
  project: ProjectEntry;
  locale: string;
  strings: ResumeStrings;
};

const ProjectCard = ({ project, locale, strings }: ProjectCardProps) => {
  const dateRange = formatDateRange(
    project.startDate,
    project.endDate,
    locale,
    strings.labels.present,
  );
  const typeLabel = project.type
    ? project.type
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
  const meta = [dateRange, typeLabel].filter(Boolean).join(" · ");
  const roleBadges = (project.roles || []).slice(0, 3);
  const keywordBadges = (project.keywords || []).slice(0, 6);
  const highlights = (project.highlights || []).slice(0, 3);

  return (
    <article className="project-card">
      <header className="project-card__header">
        <div>
          <h3 className="project-card__title">{project.name}</h3>
          {project.entity && (
            <p className="project-card__subtitle">{project.entity}</p>
          )}
        </div>
        {roleBadges.length > 0 && (
          <div className="project-card__badges">
            {roleBadges.map((role, index) => (
              <span key={`project-role-${index}`} className="project-chip">
                {role}
              </span>
            ))}
          </div>
        )}
      </header>
      {meta && <p className="project-card__meta">{meta}</p>}
      {project.description && (
        <p className="project-card__summary">{project.description}</p>
      )}
      <HighlightList
        items={highlights}
        tone="light"
        dense
        limit={2}
        className="project-card__highlights"
      />
      {keywordBadges.length > 0 && (
        <div className="project-card__keywords">
          {keywordBadges.map((keyword, index) => (
            <span
              key={`project-keyword-${index}`}
              className="project-chip project-chip--ghost"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
      {project.url && (
        <footer className="project-card__footer">
          <a
            href={safeUrl(project.url)}
            target="_blank"
            rel="noreferrer noopener"
            className="project-card__link"
          >
            {displayUrl(project.url)}
          </a>
        </footer>
      )}
    </article>
  );
};

export default ProjectCard;
