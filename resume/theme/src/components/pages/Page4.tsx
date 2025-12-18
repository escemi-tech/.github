import type { ResumeSchema } from "../../types/resume";
import { Section } from "../Section";
import { CommunityGrid, ProjectsGrid } from "../Cards";

type ProjectEntry = NonNullable<ResumeSchema["projects"]>[number];
type VolunteerEntry = NonNullable<ResumeSchema["volunteer"]>[number];

type Page4Props = {
  projects: ProjectEntry[];
  communityItems: VolunteerEntry[];
  locale: string;
  presentLabel: string;
  projectsTitle: string;
  communityTitle: string;
};

export function Page4({
  projects,
  communityItems,
  locale,
  presentLabel,
  projectsTitle,
  communityTitle,
}: Page4Props) {
  return (
    <section className="page page--projects">
      <Section title={projectsTitle}>
        <ProjectsGrid projects={projects} locale={locale} presentLabel={presentLabel} />
      </Section>
      <Section title={communityTitle}>
        <CommunityGrid items={communityItems} locale={locale} presentLabel={presentLabel} />
      </Section>
    </section>
  );
}
