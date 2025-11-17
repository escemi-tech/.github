import React from "react";
import PropTypes from "prop-types";
import styledComponents from "styled-components";

// Handle double-default export in styled-components v6
const styled = styledComponents.default || styledComponents;

/**
 * ESCEMI Resume Theme - React Edition
 * Two-column layout with CV Coach enhancements
 * Optimized for senior technical profiles (CTO, Lead Dev, Architect)
 */

// ===== UTILITY FUNCTIONS =====

/**
 * CV Coach: Extract baseline/signature numbers from summary
 * e.g., "16 years · 15+ teams · 20+ projects"
 */
function extractBaseline(summary) {
  if (!summary) return null;
  const lines = summary.split("\n");
  const firstLine = lines[0].trim();

  // Check if first line looks like a baseline (contains · or numbers with context)
  if (firstLine.match(/\d+.*·.*\d+/)) {
    return firstLine;
  }

  return null;
}

/**
 * CV Coach: Get summary without baseline
 */
function getSummaryWithoutBaseline(summary) {
  if (!summary) return "";

  const lines = summary.split("\n");
  const firstLine = lines[0].trim();

  // If first line is a baseline, remove it
  if (firstLine.match(/\d+.*·.*\d+/)) {
    return lines.slice(1).join("\n").trim();
  }

  return summary;
}

/**
 * CV Coach: Emphasize metrics in text
 * Highlights numbers, percentages, and time comparisons
 */
function emphasizeMetrics(text) {
  if (!text) return text;

  // Time comparisons: "2-4 hours to 15-30 minutes"
  text = text.replace(
    /(\d+(?:-\d+)?\s+[a-z]+\s+to\s+\d+(?:-\d+)?\s+[a-z]+)/gi,
    "<em>$1</em>",
  );
  text = text.replace(
    /(\d+(?:\.\d+)?\s*[a-z]+\s*→\s*\d+(?:\.\d+)?\s*[a-z]+)/gi,
    "<em>$1</em>",
  );

  // Percentages with +/-/~
  text = text.replace(/([+\-~]\d+(?:\.\d+)?%)/g, "<em>$1</em>");

  // Plain percentages
  text = text.replace(/(\d+(?:\.\d+)?%)/g, "<em>$1</em>");

  // Numbers with K/M/B multipliers
  text = text.replace(/(\d+(?:\.\d+)?[KMB])/g, "<strong>$1</strong>");

  // Numbers with +
  text = text.replace(/(\d+\+)/g, "<strong>$1</strong>");

  // Currency symbols
  text = text.replace(/([€$£])(\d+)/g, "$1<strong>$2</strong>");

  return text;
}

/**
 * Security: Safe URL helper
 */
function safeUrl(url) {
  if (!url) return "#";

  try {
    const parsed = new URL(url);
    if (["http:", "https:", "mailto:"].includes(parsed.protocol)) {
      return url;
    }
  } catch {
    // Invalid URL
  }

  return "#";
}

// ===== STYLED COMPONENTS =====

const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2.5rem;
  min-height: 100vh;
  font-family: var(--resume-font-sans);
  font-size: 10pt;
  line-height: 1.6;
  color: var(--color-text-primary);

  @media print {
    min-height: auto;
  }
`;

const Sidebar = styled.aside`
  background: var(--color-sidebar);
  color: #ffffff;
  padding: 40px 30px;

  /* Avoid breaking left column sections */
  page-break-inside: avoid;
`;

const MainContent = styled.main`
  background: var(--color-main);
  padding: 60px 50px;
`;

// ===== HEADER COMPONENTS =====

const ProfilePhoto = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--escemi-secondary);
  margin: 0 auto 30px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(28, 49, 68, 0.15);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
`;

const Name = styled.h1`
  font-size: 28pt;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: var(--escemi-primary);
  letter-spacing: -0.5px;
  line-height: 1.1;
`;

const JobTitle = styled.div`
  font-size: 11pt;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.4;
`;

// CV Coach: Baseline/Signature styling
const Baseline = styled.div`
  font-size: 11pt;
  font-weight: 600;
  font-style: italic;
  color: var(--escemi-primary);
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: var(--color-accent-light);
  border-left: 4px solid var(--escemi-secondary);
  border-radius: 0 4px 4px 0;
  page-break-inside: avoid;
`;

const Summary = styled.div`
  font-size: 10pt;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-top: 0.75rem;
`;

// ===== SIDEBAR COMPONENTS =====

const SidebarSection = styled.section`
  margin-bottom: 40px;
  page-break-inside: avoid;
`;

const SidebarTitle = styled.h2`
  font-size: 11pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* Keep section title with content */
  page-break-after: avoid;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  font-size: 9pt;
  line-height: 1.5;

  a {
    color: #ffffff;
    text-decoration: none;
    word-break: break-all;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Icon = styled.span`
  margin-right: 0.5rem;
  font-size: 10pt;
  flex-shrink: 0;
`;

// ===== SKILLS & EDUCATION COMPONENTS =====

const SkillCategory = styled.div`
  margin-bottom: 1.25rem;
  page-break-inside: avoid;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 4px;
  border-left: 3px solid var(--escemi-secondary);
`;

const SkillCategoryTitle = styled.div`
  font-size: 9.5pt;
  font-weight: 700;
  color: var(--escemi-secondary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const SkillList = styled.div`
  font-size: 9pt;
  line-height: 1.6;

  div {
    margin-bottom: 0.25rem;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 20px;
  page-break-inside: avoid;

  .dates {
    font-size: 9pt;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
    font-style: italic;
  }

  h3 {
    font-size: 10pt;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: var(--escemi-secondary);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 9pt;
    line-height: 1.6;

    li {
      margin: 4px 0;
      padding-left: 15px;
      position: relative;

      &:before {
        content: "▸";
        position: absolute;
        left: 0;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
`;

const LanguagesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin: 8px 0;
    padding-left: 15px;
    position: relative;
    font-size: 10pt;

    &:before {
      content: "▸";
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

// ===== MAIN CONTENT COMPONENTS =====

const MainSection = styled.section`
  margin-bottom: 2rem;
  page-break-inside: avoid;
`;

const MainSectionTitle = styled.h2`
  font-size: 13pt;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--escemi-primary);
  color: var(--escemi-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* Keep section title with content */
  page-break-after: avoid;
`;

const ExperienceItem = styled.article`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);

  /* Prevent breaking experience items across pages */
  page-break-inside: avoid;
  page-break-before: auto;

  &:last-child {
    border-bottom: none;
  }
`;

const ExperienceHeader = styled.div`
  margin-bottom: 0.75rem;
  page-break-after: avoid;
`;

const Position = styled.h3`
  font-size: 12pt;
  font-weight: 700;
  color: var(--escemi-primary);
  margin-bottom: 0.3rem;
  line-height: 1.3;
`;

const Company = styled.div`
  font-size: 10.5pt;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
`;

const DateLocation = styled.div`
  font-size: 9pt;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
  font-style: italic;
`;

const ExperienceSummary = styled.div`
  font-size: 9.5pt;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
  line-height: 1.6;
  font-style: italic;
`;

const Highlights = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0.75rem;

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.6rem;
    font-size: 9.5pt;
    line-height: 1.6;
    color: var(--color-text-secondary);

    /* Avoid breaking highlights in the middle */
    page-break-inside: avoid;
    orphans: 2;
    widows: 2;

    &:before {
      content: "▸";
      position: absolute;
      left: 0;
      color: var(--escemi-secondary);
      font-weight: 700;
      font-size: 11pt;
    }

    /* CV Coach: Metric emphasis */
    em {
      background: var(--results-bg);
      color: var(--results-border);
      font-weight: 700;
      font-style: normal;
      padding: 2px 4px;
      border-radius: 2px;
    }

    strong {
      color: var(--escemi-primary);
      font-weight: 700;
      padding: 2px 4px;
      background: var(--challenge-bg);
      border-radius: 2px;
    }
  }
`;

// ===== MAIN COMPONENT =====

function Resume({ resume }) {
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

  // CV Coach: Extract baseline from summary
  const baseline = extractBaseline(basics.summary);
  const summaryWithoutBaseline = getSummaryWithoutBaseline(basics.summary);

  return (
    <Layout>
      {/* ===== LEFT SIDEBAR ===== */}
      <Sidebar>
        {/* Profile Photo */}
        {basics.image && (
          <ProfilePhoto>
            <img src={basics.image} alt={basics.name || "Profile"} />
          </ProfilePhoto>
        )}

        {/* Contact Section */}
        {(basics.phone || basics.email || basics.location || basics.url) && (
          <SidebarSection>
            <SidebarTitle>
              <span>📍</span> Contact
            </SidebarTitle>
            {basics.location && (
              <ContactItem>
                <Icon>📍</Icon>
                <span>
                  {[basics.location.city, basics.location.region]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </ContactItem>
            )}
            {basics.email && (
              <ContactItem>
                <Icon>✉️</Icon>
                <a href={safeUrl(`mailto:${basics.email}`)}>{basics.email}</a>
              </ContactItem>
            )}
            {basics.phone && (
              <ContactItem>
                <Icon>📞</Icon>
                <span>{basics.phone}</span>
              </ContactItem>
            )}
            {basics.url && (
              <ContactItem>
                <Icon>🔗</Icon>
                <a
                  href={safeUrl(basics.url)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {basics.url.replace(/^https?:\/\//, "")}
                </a>
              </ContactItem>
            )}
          </SidebarSection>
        )}

        {/* Profiles */}
        {basics.profiles && basics.profiles.length > 0 && (
          <SidebarSection>
            <SidebarTitle>
              <span>🔗</span> Links
            </SidebarTitle>
            {basics.profiles.map((profile, index) => (
              <ContactItem key={index}>
                <Icon>→</Icon>
                <a
                  href={safeUrl(profile.url)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {profile.network}
                </a>
              </ContactItem>
            ))}
          </SidebarSection>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <SidebarSection>
            <SidebarTitle>
              <span>⚙️</span> Skills
            </SidebarTitle>
            {skills.map((skillGroup, index) => (
              <SkillCategory key={index}>
                <SkillCategoryTitle>
                  {skillGroup.name === "Core Tech" && "🎯"}
                  {skillGroup.name === "DevOps & Cloud" && "☁️"}
                  {skillGroup.name === "Methods & Leadership" && "🧠"}
                  {skillGroup.name === "Méthodes & Leadership" && "🧠"}{" "}
                  {skillGroup.name}
                </SkillCategoryTitle>
                <SkillList>
                  {(skillGroup.keywords || []).map((skill, idx) => (
                    <div key={idx}>{skill}</div>
                  ))}
                </SkillList>
              </SkillCategory>
            ))}
          </SidebarSection>
        )}

        {/* Languages Section */}
        {languages.length > 0 && (
          <SidebarSection>
            <SidebarTitle>
              <span>🌍</span> Languages
            </SidebarTitle>
            <LanguagesList>
              {languages.map((lang, index) => (
                <li key={index}>
                  {lang.language}
                  {lang.fluency && ` - ${lang.fluency}`}
                </li>
              ))}
            </LanguagesList>
          </SidebarSection>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <SidebarSection>
            <SidebarTitle>
              <span>🎓</span> Education
            </SidebarTitle>
            {education.map((edu, index) => (
              <EducationItem key={index}>
                {edu.startDate && edu.endDate && (
                  <div className="dates">
                    {new Date(edu.startDate).getFullYear()} -{" "}
                    {new Date(edu.endDate).getFullYear()}
                  </div>
                )}
                <h3>
                  {edu.studyType}
                  {edu.area && ` - ${edu.area}`}
                </h3>
                <ul>
                  <li>{edu.institution}</li>
                </ul>
              </EducationItem>
            ))}
          </SidebarSection>
        )}

        {/* Certifications */}
        {certificates.length > 0 && (
          <SidebarSection>
            <SidebarTitle>
              <span>💡</span> Certifications
            </SidebarTitle>
            {certificates.map((cert, index) => (
              <EducationItem key={index}>
                {cert.date && (
                  <div className="dates">
                    {new Date(cert.date).getFullYear()}
                  </div>
                )}
                <h3>{cert.name}</h3>
                <ul>
                  <li>{cert.issuer}</li>
                </ul>
              </EducationItem>
            ))}
          </SidebarSection>
        )}
      </Sidebar>

      {/* ===== RIGHT MAIN CONTENT ===== */}
      <MainContent>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <Name>{basics.name}</Name>
          {basics.label && <JobTitle>{basics.label}</JobTitle>}

          {/* CV Coach: Baseline with signature numbers */}
          {baseline && <Baseline>{baseline}</Baseline>}

          {/* Summary without baseline */}
          {summaryWithoutBaseline && (
            <Summary>{summaryWithoutBaseline}</Summary>
          )}
        </div>

        {/* Work Experience Section */}
        {work.length > 0 && (
          <MainSection>
            <MainSectionTitle>
              <span>📈</span> Professional Experience
            </MainSectionTitle>
            {work.map((job, index) => (
              <ExperienceItem key={index}>
                <ExperienceHeader>
                  <Position>{job.position}</Position>
                  <Company>{job.name}</Company>
                  <DateLocation>
                    {job.startDate && (
                      <>
                        {new Date(job.startDate).toLocaleDateString("en", {
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {job.endDate
                          ? new Date(job.endDate).toLocaleDateString("en", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Present"}
                      </>
                    )}
                    {job.location && ` • ${job.location}`}
                  </DateLocation>
                </ExperienceHeader>
                {job.summary && (
                  <ExperienceSummary>{job.summary}</ExperienceSummary>
                )}
                {job.highlights && job.highlights.length > 0 && (
                  <Highlights>
                    {job.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: emphasizeMetrics(highlight),
                        }}
                      />
                    ))}
                  </Highlights>
                )}
              </ExperienceItem>
            ))}
          </MainSection>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <MainSection>
            <MainSectionTitle>
              <span>🚀</span> Key Projects
            </MainSectionTitle>
            {projects.map((project, index) => (
              <ExperienceItem key={index}>
                <ExperienceHeader>
                  <Position>{project.name}</Position>
                  {project.entity && <Company>{project.entity}</Company>}
                  <DateLocation>
                    {project.startDate && (
                      <>
                        {new Date(project.startDate).toLocaleDateString("en", {
                          month: "short",
                          year: "numeric",
                        })}
                        {project.endDate &&
                          ` - ${new Date(project.endDate).toLocaleDateString(
                            "en",
                            {
                              month: "short",
                              year: "numeric",
                            },
                          )}`}
                      </>
                    )}
                  </DateLocation>
                </ExperienceHeader>
                {project.description && (
                  <ExperienceSummary>{project.description}</ExperienceSummary>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <Highlights>
                    {project.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: emphasizeMetrics(highlight),
                        }}
                      />
                    ))}
                  </Highlights>
                )}
              </ExperienceItem>
            ))}
          </MainSection>
        )}

        {/* Volunteer Work Section */}
        {volunteer.length > 0 && (
          <MainSection>
            <MainSectionTitle>
              <span>💡</span> Volunteer Work
            </MainSectionTitle>
            {volunteer.map((vol, index) => (
              <ExperienceItem key={index}>
                <ExperienceHeader>
                  <Position>{vol.position}</Position>
                  <Company>{vol.organization}</Company>
                  <DateLocation>
                    {vol.startDate && (
                      <>
                        {new Date(vol.startDate).toLocaleDateString("en", {
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {vol.endDate
                          ? new Date(vol.endDate).toLocaleDateString("en", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Present"}
                      </>
                    )}
                  </DateLocation>
                </ExperienceHeader>
                {vol.summary && (
                  <ExperienceSummary>{vol.summary}</ExperienceSummary>
                )}
                {vol.highlights && vol.highlights.length > 0 && (
                  <Highlights>
                    {vol.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: emphasizeMetrics(highlight),
                        }}
                      />
                    ))}
                  </Highlights>
                )}
              </ExperienceItem>
            ))}
          </MainSection>
        )}
      </MainContent>
    </Layout>
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
};

export default Resume;
