import type { ResumeSchema } from "../types/resume";
import { extractBaseline, getStrings, selectFeatured, splitExperiences, stripBaseline } from "../utils/resumeHelpers";
import { sanitize } from "../utils/text";
import { displayUrl } from "../utils/url";
import { safeUrl } from "../utils/url";
import { Page1 } from "./pages/Page1";
import { Page2 } from "./pages/Page2";
import { Page3 } from "./pages/Page3";
import { Page4 } from "./pages/Page4";
import { joinDefined } from "../utils/text";

type PagedResumeDocumentProps = {
  resume: ResumeSchema;
  locale: string;
};

export function PagedResumeDocument({ resume, locale }: PagedResumeDocumentProps) {
  const strings = getStrings(locale);

  const basics = resume.basics || {};
  const skills = resume.skills || [];
  const languages = resume.languages || [];
  const education = resume.education || [];
  const certificates = resume.certificates || [];

  const visibleWork = selectFeatured(resume.work || []);
  const { spotlight, timeline } = splitExperiences(visibleWork);

  const visibleProjects = selectFeatured(resume.projects || []);
  const visibleCommunity = selectFeatured(resume.volunteer || []);

  const name = sanitize(basics.name);
  const title = sanitize(basics.label);
  const imageSrc = sanitize(basics.image);

  const baseline = extractBaseline(basics.summary);
  const summary = sanitize(stripBaseline(basics.summary));
  const metrics = baseline ? baseline.split("·").map((token) => token.trim()) : [];

  const location = joinDefined(basics.location?.city, basics.location?.region);
  const email = sanitize(basics.email);
  const phone = sanitize(basics.phone);
  const websiteHref = safeUrl(basics.url);
  const websiteLabel = displayUrl(basics.url);

  const contactItems: Array<{ icon: string; label: string; href?: string }> = [];
  if (location) contactItems.push({ icon: "📍", label: location });
  if (email) contactItems.push({ icon: "✉️", label: email, href: `mailto:${email}` });
  if (phone) contactItems.push({ icon: "📞", label: phone, href: `tel:${phone}` });
  if (websiteLabel && websiteHref !== "#") {
    contactItems.push({ icon: "🔗", label: websiteLabel, href: websiteHref });
  }

  const profileItems: Array<{ icon: string; label: string; href?: string }> = (basics.profiles || [])
    .filter((profile) => Boolean(profile?.url))
    .map((profile) => {
      const url = String(profile.url);
      const href = safeUrl(url);
      const label = profile.network
        ? `${profile.network} · ${displayUrl(url)}`
        : displayUrl(url);

      return { icon: "☍", label, href: href === "#" ? undefined : href };
    });

  return (
    <div className="resume-root">
      <article className="resume">
        <Page1
          imageSrc={imageSrc}
          name={name}
          title={title}
          summary={summary}
          metrics={metrics}
          contactItems={contactItems}
          profileItems={profileItems}
          skills={skills}
          languages={languages}
          education={education}
          certificates={certificates}
          spotlightEntries={spotlight.slice(0, 2)}
          locale={locale}
          presentLabel={strings.labels.present}
          skillsTitle={strings.sections.skills}
          languagesTitle={strings.sections.languages}
          educationTitle={strings.sections.education}
          certificatesTitle={strings.sections.certificates}
          professionalTitle={strings.sections.professional}
        />

        <Page2
          name={name}
          title={title}
          timelineEntries={timeline}
          locale={locale}
          presentLabel={strings.labels.present}
          professionalTitle={strings.sections.professional}
        />

        <Page3
          projects={visibleProjects.slice(0, 4)}
          locale={locale}
          presentLabel={strings.labels.present}
          projectsTitle={strings.sections.projects}
        />

        <Page4
          projects={visibleProjects.slice(4, 6)}
          communityItems={visibleCommunity.slice(0, 2)}
          locale={locale}
          presentLabel={strings.labels.present}
          projectsTitle={strings.sections.projects}
          communityTitle={strings.sections.community}
        />
      </article>
    </div>
  );
}
