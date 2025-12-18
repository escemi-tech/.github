import type { ResumeSchema } from "../../types/resume";
import { Section } from "../Section";
import { ExperienceTimelineCompact } from "../Experience";
import { RunningHeader } from "../RunningHeader";

type WorkEntry = NonNullable<ResumeSchema["work"]>[number];

type Page2Props = {
  name: string;
  title: string;
  timelineEntries: WorkEntry[];
  locale: string;
  presentLabel: string;
  professionalTitle: string;
};

export function Page2({ name, title, timelineEntries, locale, presentLabel, professionalTitle }: Page2Props) {
  return (
    <section className="page page--experience">
      <RunningHeader name={name} title={title} />
      <Section title={professionalTitle} className="section--professional">
        <ExperienceTimelineCompact entries={timelineEntries} locale={locale} presentLabel={presentLabel} />
      </Section>
    </section>
  );
}
