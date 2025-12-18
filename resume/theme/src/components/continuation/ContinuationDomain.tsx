import { Fragment, type ReactNode } from "react";
import SectionHeading from "../shared/SectionHeading";
import ProjectCard from "./ProjectCard";
import CommunityCard from "./CommunityCard";
import ExperiencePanel from "../shared/ExperiencePanel";
import { experienceKey } from "../../utils/resumeHelpers";
import type { ExtraSection, ResumeStrings } from "../../types/resume";

type ContinuationDomainProps = {
  sections: ExtraSection[];
  locale: string;
  strings: ResumeStrings;
};

const getSectionBodyClass = (section: ExtraSection) =>
  [
    "continuation-body",
    section.type === "projects" ? "continuation-body--projects" : null,
  ]
    .filter(Boolean)
    .join(" ");

const ContinuationDomain = ({
  sections,
  locale,
  strings,
}: ContinuationDomainProps) => {
  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="resume-continuation">
      {sections.map((section, index) => (
        <div
          key={`${section.type}-${section.label}-${index}`}
          className={getSectionBodyClass(section)}
        >
          <SectionHeading icon={section.icon} label={section.label} tone="muted" />
          {renderSection(section, locale, strings)}
        </div>
      ))}
    </section>
  );
};

function renderSection(
  section: ExtraSection,
  locale: string,
  strings: ResumeStrings,
): ReactNode {
  const timelineHighlightLimit = 2;

  if (section.type === "projects") {
    return (
      <div className="project-grid">
        {section.entries.map((entry, index) => (
          <Fragment key={`${section.label}-${experienceKey(entry, index)}`}>
            <ProjectCard project={entry} locale={locale} strings={strings} />
          </Fragment>
        ))}
      </div>
    );
  }

  if (section.type === "community") {
    return (
      <div className="community-grid">
        {section.entries.map((entry, index) => (
          <Fragment key={`${section.label}-${experienceKey(entry, index)}`}>
            <CommunityCard item={entry} locale={locale} strings={strings} />
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {section.entries.map((entry, index) => (
        <Fragment key={`${section.label}-${experienceKey(entry, index)}`}>
          <ExperiencePanel
            item={entry}
            locale={locale}
            strings={strings}
            variant="timeline"
            highlightLimit={timelineHighlightLimit}
          />
        </Fragment>
      ))}
    </div>
  );
}

export default ContinuationDomain;
