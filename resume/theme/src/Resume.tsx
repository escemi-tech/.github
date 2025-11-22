import HeroDomain from "./components/hero/HeroDomain";
import SidebarDomain from "./components/sidebar/SidebarDomain";
import ExperienceDomain from "./components/experience/ExperienceDomain";
import ContinuationDomain from "./components/continuation/ContinuationDomain";
import {
  selectFeatured,
  getStrings,
  extractBaseline,
  stripBaseline,
  splitExperiences,
} from "./utils/resumeHelpers";
import type { ExtraSection, ResumeSchema, ResumeStrings } from "./types/resume";

type ResumeProps = {
  resume: ResumeSchema;
  locale?: string;
};

function buildExtraSections(
  strings: ResumeStrings,
  visibleProjects: ResumeSchema["projects"],
  visibleVolunteer: ResumeSchema["volunteer"],
  timeline: ReturnType<typeof splitExperiences>["timeline"],
): ExtraSection[] {
  return [
    {
      label: strings.sections.professional,
      icon: "💼",
      entries: timeline,
      type: "experience" as const,
    },
    {
      label: strings.sections.projects,
      icon: "🚀",
      entries: visibleProjects ?? [],
      type: "projects" as const,
    },
    {
      label: strings.sections.community,
      icon: "🎤",
      entries: visibleVolunteer ?? [],
      type: "community" as const,
    },
  ].filter((section) => section.entries?.length) as ExtraSection[];
}

const Resume = ({ resume, locale = "en" }: ResumeProps) => {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    languages = [],
    projects = [],
    volunteer = [],
    certificates = [],
  } = resume;

  const visibleWork = selectFeatured(work);
  const visibleProjects = selectFeatured(projects);
  const visibleVolunteer = selectFeatured(volunteer);
  const strings = getStrings(locale);

  const baseline = extractBaseline(basics.summary);
  const summary = stripBaseline(basics.summary);
  const metrics = baseline
    ? baseline.split("·").map((token) => token.trim())
    : [];
  const { spotlight, timeline } = splitExperiences(visibleWork);

  const extraSections = buildExtraSections(
    strings,
    visibleProjects,
    visibleVolunteer,
    timeline,
  );

  return (
    <div className="resume-root space-y-5">
      <section className="page page-first">
        <div className="page-shell bg-gradient-to-br from-white via-slate-50 to-white text-slate-900">
          <HeroDomain basics={basics} summary={summary} metrics={metrics} />

          <div className="page-first__body mt-2.5 grid grid-cols-[215px_minmax(0,1fr)] gap-3.5 px-4 pb-4">
            <SidebarDomain
              skills={skills}
              languages={languages}
              education={education}
              certificates={certificates}
              locale={locale}
              strings={strings}
            />
            <ExperienceDomain
              entries={spotlight}
              locale={locale}
              strings={strings}
              dense
              highlightLimit={4}
            />
          </div>
        </div>
      </section>

      <ContinuationDomain
        sections={extraSections}
        locale={locale}
        strings={strings}
      />
    </div>
  );
};

export default Resume;
