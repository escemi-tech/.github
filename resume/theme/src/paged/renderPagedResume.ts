import type {
  Certificate,
  CommunityEntry,
  Education,
  ExperienceEntry,
  ProjectEntry,
  Language,
  ResumeSchema,
  SkillGroup,
} from "../types/resume";
import {
  displayUrl,
  emphasize,
  formatDateRange,
  getStrings,
  sanitize,
  selectFeatured,
  splitExperiences,
} from "../utils/resumeHelpers";
import { safeUrl } from "../core";
import { escapeHtml } from "./escapeHtml";

type RenderPagedResumeOptions = {
  locale?: string;
};

const truncateText = (value: string, maxChars: number): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
};

const chunkArray = <T,>(items: T[], size: number): T[][] => {
  if (size <= 0) return [items];
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks.length ? chunks : [[]];
};

const extractResultsSnippet = (value: string): string => {
  const text = value.trim();
  if (!text) return "";

  const markers = ["Results:", "Result:", "Résultats:", "Résultat:"];
  for (const marker of markers) {
    const index = text.toLowerCase().indexOf(marker.toLowerCase());
    if (index >= 0) {
      return text.slice(index + marker.length).trim();
    }
  }

  return text;
};

const joinDefined = (...tokens: Array<string | null | undefined>) =>
  tokens
    .map((token) => (token ? token.trim() : ""))
    .filter(Boolean)
    .join(" ");

const renderList = (items: string[], className: string) => {
  if (!items.length) return "";
  return `
<ul class="${className}">
${items.map((item) => `  <li>${item}</li>`).join("\n")}
</ul>`;
};

const renderSection = (
  title: string,
  body: string,
  options: { forceBreakBefore?: boolean } = {},
) => {
  const className = joinDefined(
    "section",
    options.forceBreakBefore ? "section--break" : undefined,
  );
  if (!body.trim()) return "";
  return `
<section class="${className}">
  <h2 class="section__title">${escapeHtml(title)}</h2>
  ${body}
</section>`;
};

const renderSkillGroups = (skills: SkillGroup[]) => {
  const groups = skills
    .filter((group) => sanitize(group.name) || (group.keywords ?? []).length)
    .slice(0, 4);
  if (!groups.length) return "";

  const body = groups
    .map((group) => {
      const name = escapeHtml(group.name || "");
      const keywords = (group.keywords ?? []).slice(0, 7).map((keyword) => escapeHtml(keyword));
      const keywordHtml = keywords.length
        ? keywords.map((keyword) => `<span class="chip">${keyword}</span>`).join("")
        : "";

      return `
  <div class="kv">
    <div class="kv__key">${name}</div>
    <div class="kv__value">${keywordHtml}</div>
  </div>`;
    })
    .join("\n");

  return `<div class="stack stack--sm">${body}\n</div>`;
};

const renderLanguages = (languages: Language[]) => {
  const entries = languages
    .slice(0, 3)
    .map((entry) => {
      const language = sanitize(entry.language);
      const fluency = sanitize(entry.fluency);
      if (!language && !fluency) return null;
      return `<div class="kv"><div class="kv__key">${escapeHtml(language)}</div><div class="kv__value">${escapeHtml(fluency)}</div></div>`;
    })
    .filter(Boolean);

  if (!entries.length) return "";
  return `<div class="stack stack--xs">${entries.join("\n")}\n</div>`;
};

const renderEducation = (education: Education[], locale: string) => {
  const entries = education
    .slice(0, 2)
    .map((entry) => {
      const institution = sanitize(entry.institution);
      const area = sanitize(entry.area);
      const studyType = sanitize(entry.studyType);
      const range = formatDateRange(entry.startDate, entry.endDate, locale);
      if (!institution && !area && !studyType) return null;

      const titleText = truncateText(joinDefined(studyType, area), 48);
      const institutionText = truncateText(institution, 40);

      return `
  <div class="entry">
    <div class="entry__header">
      <div class="entry__title">${escapeHtml(titleText)}</div>
      <div class="entry__meta">${escapeHtml(range || "")}</div>
    </div>
    <div class="entry__subtitle">${escapeHtml(institutionText)}</div>
  </div>`;
    })
    .filter(Boolean);

  if (!entries.length) return "";
  return `<div class="stack stack--sm">${entries.join("\n")}\n</div>`;
};

const renderCertificates = (certificates: Certificate[], locale: string) => {
  const entries = certificates
    .slice(0, 2)
    .map((entry) => {
      const name = sanitize(entry.name);
      const issuer = sanitize(entry.issuer);
      const date = sanitize(entry.date);
      const dateLabel = date ? formatDateRange(date, date, locale) : null;
      if (!name && !issuer) return null;

      const nameText = truncateText(name, 44);
      const issuerText = truncateText(issuer, 34);

      return `
  <div class="entry">
    <div class="entry__header">
      <div class="entry__title">${escapeHtml(nameText)}</div>
      <div class="entry__meta">${escapeHtml(dateLabel || "")}</div>
    </div>
    <div class="entry__subtitle">${escapeHtml(issuerText)}</div>
  </div>`;
    })
    .filter(Boolean);

  if (!entries.length) return "";
  return `<div class="stack stack--sm">${entries.join("\n")}\n</div>`;
};

const renderHighlights = (
  highlights: string[] = [],
  options: {
    maxItems?: number;
    maxChars?: number;
    preferResults?: boolean;
  } = {},
) => {
  const maxItems = options.maxItems ?? 3;
  const maxChars = options.maxChars ?? 140;
  const preferResults = options.preferResults ?? true;

  const items = highlights
    .map((highlight) => sanitize(highlight))
    .filter(Boolean)
    .map((highlight) => (preferResults ? extractResultsSnippet(highlight) : highlight))
    .map((highlight) => truncateText(highlight, maxChars))
    .filter(Boolean)
    .slice(0, maxItems)
    .map((highlight) => emphasize(escapeHtml(highlight)));

  return renderList(items, "bullets");
};

const renderExperienceEntries = (
  entries: ExperienceEntry[],
  locale: string,
  presentLabel: string,
  options: {
    maxHighlightsPerEntry?: number;
    maxSummaryChars?: number;
    includeSummary?: boolean;
    highlightMaxChars?: number;
    preferResultsHighlights?: boolean;
  } = {},
) => {
  const maxHighlightsPerEntry = options.maxHighlightsPerEntry ?? 4;
  const maxSummaryChars = options.maxSummaryChars ?? 240;
  const includeSummary = options.includeSummary ?? true;
  const highlightMaxChars = options.highlightMaxChars ?? 140;
  const preferResultsHighlights = options.preferResultsHighlights ?? true;

  const blocks = entries
    .map((entry) => {
      const title = joinDefined(entry.position || entry.title, entry.name);
      const org = joinDefined(entry.organization || entry.entity || entry.client, entry.location);
      const range = formatDateRange(entry.startDate, entry.endDate, locale, presentLabel);
      const summary = truncateText(sanitize(entry.summary), maxSummaryChars);
      const url = safeUrl(entry.url);
      const urlLabel = displayUrl(entry.url);

      const headerLine = joinDefined(title, range ? `· ${range}` : undefined);

      const highlights = renderHighlights(entry.highlights ?? [], {
        maxItems: maxHighlightsPerEntry,
        maxChars: highlightMaxChars,
        preferResults: preferResultsHighlights,
      });
      const summaryHtml = includeSummary && summary
        ? `<p class="entry__summary">${emphasize(escapeHtml(summary))}</p>`
        : "";
      const linkHtml = urlLabel && url !== "#" ? `<a class="entry__link" href="${escapeHtml(url)}">${escapeHtml(urlLabel)}</a>` : "";

      if (!headerLine && !org && !summary && !highlights.trim()) return null;

      return `
  <article class="entry entry--experience">
    <header class="entry__header">
      <div class="entry__title">${escapeHtml(headerLine)}</div>
      <div class="entry__subtitle">${escapeHtml(org)}</div>
      ${linkHtml}
    </header>
    ${summaryHtml}
    ${highlights}
  </article>`;
    })
    .filter(Boolean);

  if (!blocks.length) return "";
  return `<div class="stack stack--md">${blocks.join("\n")}\n</div>`;
};

const renderExperienceTimelineCompact = (
  entries: ExperienceEntry[],
  locale: string,
  presentLabel: string,
) => {
  const blocks = entries
    .map((entry) => {
      const title = joinDefined(entry.position || entry.title, entry.name);
      const org = joinDefined(entry.organization || entry.entity || entry.client, entry.location);
      const range = formatDateRange(entry.startDate, entry.endDate, locale, presentLabel);

      if (!title && !org && !range) return null;

      return `
  <article class="entry entry--compact">
    <div class="entry__row">
      <div class="entry__title">${escapeHtml(title)}</div>
      <div class="entry__meta">${escapeHtml(range || "")}</div>
    </div>
    <div class="entry__subtitle">${escapeHtml(org)}</div>
  </article>`;
    })
    .filter(Boolean);

  if (!blocks.length) return "";

  return `<div class="experience-columns">${blocks.join("\n")}\n</div>`;
};

const renderProjects = (projects: ProjectEntry[], locale: string, presentLabel: string) => {
  const blocks = projects
    .map((entry) => {
      const name = sanitize(entry.name);
      const org = sanitize(entry.organization || entry.entity);
      const range = formatDateRange(entry.startDate, entry.endDate, locale, presentLabel);
      const summary = truncateText(sanitize(entry.description), 120);
      const url = safeUrl(entry.url);
      const urlLabel = displayUrl(entry.url);

      if (!name && !org && !summary) return null;

      return `
  <article class="card">
    <div class="card__header">
      <div class="card__title">${escapeHtml(name)}</div>
      <div class="card__meta">${escapeHtml(range || "")}</div>
    </div>
    <div class="card__subtitle">${escapeHtml(org)}</div>
    ${summary ? `<p class="card__summary">${emphasize(escapeHtml(summary))}</p>` : ""}
    ${urlLabel && url !== "#" ? `<div class="card__footer"><a class="card__link" href="${escapeHtml(url)}">${escapeHtml(urlLabel)}</a></div>` : ""}
  </article>`;
    })
    .filter(Boolean);

  if (!blocks.length) return "";
  return `<div class="grid grid--2">${blocks.join("\n")}\n</div>`;
};

const renderCommunity = (items: CommunityEntry[], locale: string, presentLabel: string) => {
  const blocks = items
    .map((entry) => {
      const org = sanitize(entry.organization || entry.name);
      const role = sanitize(entry.position);
      const range = formatDateRange(entry.startDate, entry.endDate, locale, presentLabel);
      const summary = truncateText(sanitize(entry.summary), 220);
      const url = safeUrl(entry.url);
      const urlLabel = displayUrl(entry.url);

      if (!org && !role && !summary) return null;

      return `
  <article class="card">
    <div class="card__header">
      <div class="card__title">${escapeHtml(org)}</div>
      <div class="card__meta">${escapeHtml(range || "")}</div>
    </div>
    <div class="card__subtitle">${escapeHtml(role)}</div>
    ${summary ? `<p class="card__summary">${emphasize(escapeHtml(summary))}</p>` : ""}
    ${urlLabel && url !== "#" ? `<div class="card__footer"><a class="card__link" href="${escapeHtml(url)}">${escapeHtml(urlLabel)}</a></div>` : ""}
  </article>`;
    })
    .filter(Boolean);

  if (!blocks.length) return "";
  return `<div class="grid grid--2">${blocks.join("\n")}\n</div>`;
};

export function renderPagedResume(resume: ResumeSchema, options: RenderPagedResumeOptions = {}): string {
  const locale = options.locale || "en";
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
  const location = joinDefined(basics.location?.city, basics.location?.region);
  const email = sanitize(basics.email);
  const phone = sanitize(basics.phone);
  const websiteHref = safeUrl(basics.url);
  const websiteLabel = displayUrl(basics.url);

  // Intentionally omit long narrative summary in Phase 1 to keep a stable 4-page layout.

  const contactBits = [
    email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : null,
    phone ? `<a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>` : null,
    websiteLabel && websiteHref !== "#" ? `<a href="${escapeHtml(websiteHref)}">${escapeHtml(websiteLabel)}</a>` : null,
    location ? `<span>${escapeHtml(location)}</span>` : null,
  ].filter(Boolean);

  const header = `
<header class="hero">
  <div class="hero__profile">
    <div class="hero__name">${escapeHtml(name)}</div>
    <div class="hero__title">${escapeHtml(title)}</div>
  </div>
  ${contactBits.length ? `<div class="hero__contact">${contactBits.join("<span class=\"sep\">·</span>")}</div>` : ""}
</header>`;

  const sidebarBody = [
    renderSection(strings.sections.skills, renderSkillGroups(skills)),
    renderSection(strings.sections.languages, renderLanguages(languages)),
    renderSection(strings.sections.education, renderEducation(education, locale)),
    renderSection(strings.sections.certificates, renderCertificates(certificates, locale)),
  ]
    .filter(Boolean)
    .join("\n");

  const firstPageMain = renderSection(
    strings.sections.professional,
    renderExperienceEntries(spotlight.slice(0, 2), locale, strings.labels.present, {
      maxHighlightsPerEntry: 1,
      highlightMaxChars: 90,
      maxSummaryChars: 0,
      includeSummary: false,
    }),
  );

  const runningHeader = `
<div class="running-header" aria-hidden="true">
  <div class="running-header__name">${escapeHtml(name)}</div>
  <div class="running-header__title">${escapeHtml(title)}</div>
</div>`;

  const firstPage = `
<section class="page page--first" data-page="1">
  ${runningHeader}
  ${header}
  <div class="first-page__grid">
    <aside class="sidebar">${sidebarBody}</aside>
    <div class="main">${firstPageMain}</div>
  </div>
</section>`;

  const experiencePage = `
<section class="page page--experience" data-page="2">
  ${renderSection(
    strings.sections.professional,
    renderExperienceTimelineCompact(timeline, locale, strings.labels.present),
  )}
</section>`;

  const projectsPage1 = `
<section class="page page--projects" data-page="3">
  ${renderSection(
    strings.sections.projects,
    renderProjects(visibleProjects.slice(0, 4), locale, strings.labels.present),
  )}
</section>`;

  const projectsPage2 = `
<section class="page page--projects" data-page="4">
  ${renderSection(
    strings.sections.projects,
    renderProjects(visibleProjects.slice(4, 6), locale, strings.labels.present),
  )}
  ${renderSection(
    strings.sections.community,
    renderCommunity(visibleCommunity.slice(0, 2), locale, strings.labels.present),
  )}
</section>`;

  return `
<div class="resume-root">
  <article class="resume">
    ${firstPage}
    ${experiencePage}
    ${projectsPage1}
    ${projectsPage2}
  </article>
</div>`;
}
