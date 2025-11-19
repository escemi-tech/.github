import React from "react";
import PropTypes from "prop-types";
import HeroDomain from "./components/hero/HeroDomain.tsx";
import SidebarDomain from "./components/sidebar/SidebarDomain.tsx";
import ExperienceDomain from "./components/experience/ExperienceDomain.tsx";
import ContinuationDomain from "./components/continuation/ContinuationDomain.tsx";
import {
  selectFeatured,
  getStrings,
  extractBaseline,
  stripBaseline,
  splitExperiences,
} from "./utils/resumeHelpers.js";

function Resume({ resume, locale = "en" }) {
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

  const extraSections = [
    {
      label: strings.sections.professional,
      icon: "💼",
      entries: timeline,
      type: "experience",
    },
    {
      label: strings.sections.projects,
      icon: "🚀",
      entries: visibleProjects,
      type: "projects",
    },
    {
      label: strings.sections.community,
      icon: "🎤",
      entries: visibleVolunteer,
      type: "community",
    },
  ].filter((section) => section.entries?.length);

  return (
    <div className="resume-root space-y-5">
      <section className="page page-first">
        <div className="page-shell bg-gradient-to-br from-white via-slate-50 to-white text-slate-900">
          <HeroDomain basics={basics} summary={summary} metrics={metrics} />

          <div className="mt-2.5 grid grid-cols-[215px_minmax(0,1fr)] gap-3.5 px-4 pb-4">
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
}

Resume.propTypes = {
  resume: PropTypes.shape({
    basics: PropTypes.object,
    work: PropTypes.arrayOf(PropTypes.object),
    education: PropTypes.arrayOf(PropTypes.object),
    skills: PropTypes.arrayOf(PropTypes.object),
    languages: PropTypes.arrayOf(PropTypes.object),
    projects: PropTypes.arrayOf(PropTypes.object),
    volunteer: PropTypes.arrayOf(PropTypes.object),
    certificates: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  locale: PropTypes.string,
};

export default Resume;
