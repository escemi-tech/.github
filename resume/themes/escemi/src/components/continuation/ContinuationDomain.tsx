/* eslint-disable n/no-missing-import */
import React from "react";
import type { ReactNode } from "react";
import SectionHeading from "../shared/SectionHeading.jsx";
import ProjectCard from "./ProjectCard.jsx";
import CommunityCard from "./CommunityCard.jsx";
import ExperiencePanel from "../shared/ExperiencePanel.jsx";
import { experienceKey } from "../../utils/resumeHelpers.js";
import type { ExtraSection, ResumeStrings } from "../../types/resume";

type ContinuationDomainProps = {
  sections: ExtraSection[];
  locale: string;
  strings: ResumeStrings;
};

const ContinuationDomain = ({
  sections,
  locale,
  strings,
}: ContinuationDomainProps) => {
  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="page">
      <div className="page-shell bg-white text-slate-900">
        <div className="px-6 py-6 space-y-6">
          {sections.map((section) => (
            <section key={section.label} className="space-y-3">
              <SectionHeading icon={section.icon} label={section.label} tone="muted" />
              {renderSection(section, locale, strings)}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

function renderSection(
  section: ExtraSection,
  locale: string,
  strings: ResumeStrings,
): ReactNode {
  if (section.type === "projects") {
    return (
      <div className="project-grid">
        {section.entries.map((entry, index) => (
          <React.Fragment key={`${section.label}-${experienceKey(entry, index)}`}>
            <ProjectCard project={entry} locale={locale} strings={strings} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (section.type === "community") {
    return (
      <div className="community-grid">
        {section.entries.map((entry, index) => (
          <React.Fragment key={`${section.label}-${experienceKey(entry, index)}`}>
            <CommunityCard item={entry} locale={locale} strings={strings} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {section.entries.map((entry, index) => (
        <React.Fragment key={`${section.label}-${experienceKey(entry, index)}`}>
          <ExperiencePanel
            item={entry}
            locale={locale}
            strings={strings}
            variant="timeline"
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export default ContinuationDomain;
