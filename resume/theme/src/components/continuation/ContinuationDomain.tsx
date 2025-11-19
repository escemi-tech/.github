import { Fragment, type ReactNode } from "react";
import SectionHeading from "../shared/SectionHeading";
import ProjectCard from "./ProjectCard";
import CommunityCard from "./CommunityCard";
import ExperiencePanel from "../shared/ExperiencePanel";
import { experienceKey } from "../../utils/resumeHelpers";
import type { ExtraSection, ResumeStrings } from "../../types/resume";

const PROJECTS_PER_PAGE = 4;
const EXPERIENCE_SHARE_THRESHOLD = 3;

type ContinuationDomainProps = {
  sections: ExtraSection[];
  locale: string;
  strings: ResumeStrings;
};

const chunkArray = <T,>(items: T[], size: number): T[][] => {
  if (size <= 0 || items.length <= size) {
    return [items];
  }

  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const paginateSections = (sections: ExtraSection[]): ExtraSection[] =>
  sections.flatMap((section) => {
    if (section.type !== "projects" || section.entries.length <= PROJECTS_PER_PAGE) {
      return [section];
    }

    const projectChunks = chunkArray(section.entries, PROJECTS_PER_PAGE);
    return projectChunks.map((chunk, chunkIndex) => ({
      ...section,
      entries: chunk,
      label:
        chunkIndex === 0
          ? section.label
          : `${section.label} (${chunkIndex + 1})`,
    }));
  });

type SectionPage = ExtraSection[];

const groupSectionsIntoPages = (sections: ExtraSection[]): SectionPage[] => {
  const pages: SectionPage[] = [];

  for (let index = 0; index < sections.length; index += 1) {
    const current = sections[index];
    const next = sections[index + 1];
    const nextNext = sections[index + 2];

    if (current.type === "projects" && next?.type === "community") {
      pages.push([current, next]);
      index += 1;
      continue;
    }

    // Allow lightweight timelines to reuse the same page as the following section.
    if (
      current.type === "experience" &&
      current.entries.length <= EXPERIENCE_SHARE_THRESHOLD &&
      next
    ) {
      if (next.type === "projects" && nextNext?.type === "community") {
        pages.push([current, next, nextNext]);
        index += 2;
      } else {
        pages.push([current, next]);
        index += 1;
      }
      continue;
    }

    pages.push([current]);
  }

  return pages;
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
  const pagedSections = paginateSections(sections);
  const sectionPages = groupSectionsIntoPages(pagedSections);

  if (sectionPages.length === 0) {
    return null;
  }

  return (
    <>
      {sectionPages.map((pageSections, pageIndex) => (
        <section
          key={`continuation-page-${pageIndex}`}
          className="page"
        >
          <div className="page-shell bg-white text-slate-900">
            <div className="continuation-page">
              {pageSections.map((section, sectionIndex) => (
                <div
                  key={`${section.type}-${section.label}-${pageIndex}-${sectionIndex}`}
                  className={getSectionBodyClass(section)}
                >
                  <SectionHeading
                    icon={section.icon}
                    label={section.label}
                    tone="muted"
                  />
                  {renderSection(section, locale, strings)}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
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
