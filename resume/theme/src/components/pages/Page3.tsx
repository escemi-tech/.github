import type { ResumeSchema } from "../../types/resume";
import { Section } from "../Section";
import { ProjectsGrid } from "../Cards";

type ProjectEntry = NonNullable<ResumeSchema["projects"]>[number];

type Page3Props = {
  projects: ProjectEntry[];
  locale: string;
  presentLabel: string;
  projectsTitle: string;
};

export function Page3({ projects, locale, presentLabel, projectsTitle }: Page3Props) {
  return (
    <section className="page page--projects">
      <Section title={projectsTitle}>
        <ProjectsGrid projects={projects} locale={locale} presentLabel={presentLabel} />
      </Section>
    </section>
  );
}
