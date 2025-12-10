import { Fragment } from "react";
import SectionHeading from "../shared/SectionHeading";
import ExperiencePanel from "../shared/ExperiencePanel";
import { experienceKey } from "../../utils/resumeHelpers";
import type { ExperienceEntry, ResumeStrings } from "../../types/resume";

type ExperienceDomainProps = {
  entries: ExperienceEntry[];
  locale: string;
  strings: ResumeStrings;
  dense?: boolean;
  highlightLimit?: number;
};

const ExperienceDomain = ({
  entries,
  locale,
  strings,
  dense = false,
  highlightLimit,
}: ExperienceDomainProps) => (
  <main className="flex flex-col gap-3 divide-y divide-slate-200">
    {entries.length > 0 && (
      <section className="space-y-2.5 pb-3">
        <SectionHeading icon="▹" label={strings.sections.professional} />
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <Fragment key={experienceKey(entry, index)}>
              <ExperiencePanel
                item={entry}
                locale={locale}
                strings={strings}
                variant="showcase"
                dense={dense}
                highlightLimit={highlightLimit}
              />
            </Fragment>
          ))}
        </div>
      </section>
    )}
  </main>
);

export default ExperienceDomain;
