import { Fragment } from "react";
import SidebarCard from "./SidebarCard";
import { formatDateRange } from "../../utils/resumeHelpers";
import type {
  SkillGroup,
  Language,
  Education,
  Certificate,
  ResumeStrings,
} from "../../types/resume";

type SidebarDomainProps = {
  skills: SkillGroup[];
  languages: Language[];
  education: Education[];
  certificates: Certificate[];
  locale: string;
  strings: ResumeStrings;
};

const SidebarDomain = ({
  skills,
  languages,
  education,
  certificates,
  locale,
  strings,
}: SidebarDomainProps) => (
  <aside className="flex flex-col gap-2.5">
    {skills.length > 0 && (
      <SidebarCard title={strings.sections.skills} icon="⚙️">
        {skills.map((group, index) => (
          <div key={`skill-${index}`} className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-800">{group.name}</p>
            <p className="skill-line">
              {(group.keywords || []).map((keyword, idx, list) => (
                <Fragment key={`skill-keyword-${index}-${idx}`}>
                  {keyword}
                  {idx < list.length - 1 && <span aria-hidden>{" • "}</span>}
                </Fragment>
              ))}
            </p>
          </div>
        ))}
      </SidebarCard>
    )}

    {languages.length > 0 && (
      <SidebarCard title={strings.sections.languages} icon="🌐">
        <div className="sidebar-grid">
          {languages.map((lang, idx) => (
            <div key={`lang-${idx}`} className="sidebar-grid__item flex justify-between gap-2">
              <span className="sidebar-grid__label">{lang.language}</span>
              {lang.fluency && (
                <span className="sidebar-grid__meta">{lang.fluency}</span>
              )}
            </div>
          ))}
        </div>
      </SidebarCard>
    )}

    {education.length > 0 && (
      <SidebarCard title={strings.sections.education} icon="🎓">
        {education.map((edu, idx) => (
          <div key={`edu-${idx}`} className="space-y-1">
            <p className="text-[0.75rem] uppercase tracking-[0.2em] text-slate-400">
              {formatDateRange(edu.startDate, edu.endDate, locale, strings.labels.present)}
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {[edu.studyType, edu.area].filter(Boolean).join(" · ")}
            </p>
            <p className="text-xs text-slate-500">{edu.institution}</p>
          </div>
        ))}
      </SidebarCard>
    )}

    {certificates.length > 0 && (
      <SidebarCard title={strings.sections.certificates} icon="🏅">
        <div className="sidebar-grid sidebar-grid--tight">
          {certificates.map((cert, idx) => (
            <div key={`cert-${idx}`} className="sidebar-grid__item space-y-0.5">
              <p className="sidebar-grid__label">{cert.name}</p>
              <p className="sidebar-grid__meta">
                {cert.issuer}
                {cert.date && ` · ${new Date(cert.date).getFullYear()}`}
              </p>
            </div>
          ))}
        </div>
      </SidebarCard>
    )}
  </aside>
);

export default SidebarDomain;
