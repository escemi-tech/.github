import type { ResumeSchema } from "../../types/resume";
import { Section } from "../Section";
import { Hero } from "../Hero";
import { CertificatesList, EducationList, LanguagesList, SkillGroups } from "../Sidebar";
import { ExperienceSpotlight } from "../Experience";

type WorkEntry = NonNullable<ResumeSchema["work"]>[number];

type HeroContactItem = {
  icon: string;
  label: string;
  href?: string;
};

type Page1Props = {
  imageSrc?: string;
  name: string;
  title: string;
  summary?: string;
  metrics?: string[];
  contactItems: HeroContactItem[];
  profileItems: HeroContactItem[];
  skills: ResumeSchema["skills"];
  languages: ResumeSchema["languages"];
  education: ResumeSchema["education"];
  certificates: ResumeSchema["certificates"];
  spotlightEntries: WorkEntry[];
  locale: string;
  presentLabel: string;
  skillsTitle: string;
  languagesTitle: string;
  educationTitle: string;
  certificatesTitle: string;
  professionalTitle: string;
};

export function Page1({
  imageSrc,
  name,
  title,
  summary,
  metrics,
  contactItems,
  profileItems,
  skills,
  languages,
  education,
  certificates,
  spotlightEntries,
  locale,
  presentLabel,
  skillsTitle,
  languagesTitle,
  educationTitle,
  certificatesTitle,
  professionalTitle,
}: Page1Props) {
  return (
    <section className="page page--first">
      <Hero
        imageSrc={imageSrc}
        name={name}
        label={title}
        metrics={metrics}
        summary={summary}
        contactItems={contactItems}
        profileItems={profileItems}
      />
      <div className="first-page__grid">
        <aside className="sidebar">
          <Section title={skillsTitle} className="section--skills">
            <SkillGroups skills={skills || []} />
          </Section>
          <Section title={languagesTitle} className="section--languages">
            <LanguagesList languages={languages || []} />
          </Section>
          <Section title={educationTitle} className="section--education">
            <EducationList education={education || []} locale={locale} />
          </Section>
          <Section title={certificatesTitle} className="section--certificates">
            <CertificatesList certificates={certificates || []} locale={locale} />
          </Section>
        </aside>
        <div className="main">
          <Section title={professionalTitle} className="section--professional">
            <div className="professional-spotlight">
              <ExperienceSpotlight
                entries={(spotlightEntries || []).slice(0, 1)}
                locale={locale}
                presentLabel={presentLabel}
                includeSummary={true}
              />
              <ExperienceSpotlight
                entries={(spotlightEntries || []).slice(1, 2)}
                locale={locale}
                presentLabel={presentLabel}
                includeSummary={true}
              />
            </div>
          </Section>
        </div>
      </div>
    </section>
  );
}
