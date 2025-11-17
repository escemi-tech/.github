import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Section, safeUrl } from "./core.js";

/**
 * Sidebar Resume Theme
 * Two-column layout with dark sidebar and light main content
 */

const BRAND = {
  font: "var(--resume-font-sans, 'Source Sans Pro', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif)",
  primary: "var(--resume-color-primary, #1c3144)",
  secondary: "var(--resume-color-secondary, #ecb807)",
  sidebar: "var(--resume-color-sidebar, #132030)",
  sidebarText: "var(--resume-color-sidebar-text, #f4f6fb)",
  mainBg: "var(--resume-color-main, #f7f9fc)",
  text: "var(--resume-color-text, #1f2933)",
  muted: "var(--resume-color-muted, #4c5a67)",
  border: "var(--resume-color-border, #d5dce3)",
  highlight: "var(--resume-color-highlight, rgba(236, 184, 7, 0.15))",
};

const WORK_FIRST_PAGE_LIMIT = 2;

const Document = styled.div`
  width: 210mm;
  margin: 0 auto;
  padding: 24px 0 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media print {
    width: 100%;
    padding: 0;
    gap: 0;
  }
`;

const Page = styled.div`
  background: ${BRAND.mainBg};
  min-height: 297mm;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);

  @media print {
    box-shadow: none;
    min-height: auto;
  }
`;

const FirstPage = styled(Page)``;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 270px 1fr;
  min-height: 297mm;
  font-family: ${BRAND.font};
  font-size: 11pt;
  line-height: 1.6;
  color: ${BRAND.text};

  @media print {
    min-height: auto;
    background: #ffffff;
  }
`;

const Sidebar = styled.aside`
  background: ${BRAND.sidebar};
  color: ${BRAND.sidebarText};
  padding: 48px 34px;
  border-right: 6px solid ${BRAND.secondary};
`;

const MainContent = styled.main`
  background: ${BRAND.mainBg};
  padding: 60px 55px;
`;

const SecondPage = styled(Page)`
  padding: 65px 80px 70px;
  page-break-before: always;
`;

const ProfilePhoto = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 8px solid ${BRAND.secondary};
  margin: 0 auto 40px;
  background: #ffffff;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Name = styled.h1`
  font-size: 42pt;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: ${BRAND.primary};
  letter-spacing: 0.5px;

  span {
    font-weight: 300;
    color: ${BRAND.text};
  }
`;

const JobTitle = styled.div`
  font-size: 17pt;
  color: ${BRAND.primary};
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  font-weight: 600;
`;

const Hero = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 30px 35px;
  box-shadow: 0 20px 45px rgba(28, 49, 68, 0.08);
  margin-bottom: 35px;
`;

const HeroHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`;

const HeroBaseline = styled.p`
  font-size: 13pt;
  color: ${BRAND.muted};
  margin: 4px 0 0 0;
`;

const SignatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const SignatureTile = styled.div`
  background: ${BRAND.highlight};
  border: 1px solid ${BRAND.secondary};
  color: ${BRAND.primary};
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 10pt;
  font-weight: 600;
  text-align: center;
`;

const PitchList = styled.ul`
  list-style: none;
  margin: 24px 0 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PitchItem = styled.li`
  position: relative;
  padding-left: 22px;
  color: ${BRAND.text};
  line-height: 1.5;

  &:before {
    content: "▹";
    position: absolute;
    left: 0;
    top: 0;
    color: ${BRAND.secondary};
    font-size: 16px;
  }
`;

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
`;

const ImpactCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid ${BRAND.border};
  padding: 18px;
  min-height: 120px;
`;

const ImpactLabel = styled.div`
  font-size: 9pt;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${BRAND.muted};
`;

const ImpactValue = styled.div`
  font-size: 20pt;
  font-weight: 700;
  color: ${BRAND.primary};
  margin: 5px 0;
`;

const ImpactDescription = styled.p`
  font-size: 10pt;
  color: ${BRAND.text};
  margin: 0;
`;

const SidebarSection = styled(Section)`
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 14pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.25);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  font-size: 10.5pt;

  svg {
    margin-right: 12px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  a {
    color: ${BRAND.sidebarText};
    text-decoration: none;
    word-break: break-word;
    font-weight: 600;

    &:hover {
      color: ${BRAND.secondary};
    }
  }

  span {
    color: ${BRAND.sidebarText};
    opacity: 0.95;
  }
`;

const Icon = styled.span`
  display: inline-block;
  width: 16px;
  margin-right: 12px;
  flex-shrink: 0;
  color: ${BRAND.secondary};
`;

const EducationItem = styled.div`
  margin-bottom: 25px;

  h3 {
    font-size: 11pt;
    font-weight: 600;
    margin: 0 0 5px 0;
    color: ${BRAND.sidebarText};
  }

  .dates {
    font-size: 10pt;
    margin-bottom: 8px;
    opacity: 0.85;
  }

  ul {
    margin: 5px 0 0 0;
    padding-left: 18px;
    font-size: 10pt;

    li {
      margin: 3px 0;
      color: ${BRAND.sidebarText};
    }
  }
`;

const SkillsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin: 8px 0;
    padding-left: 15px;
    position: relative;
    font-size: 10pt;
    font-weight: 600;

    &:before {
      content: "▪";
      position: absolute;
      left: 0;
      color: ${BRAND.secondary};
    }
  }
`;

const ProfilesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin: 10px 0;
    font-size: 10pt;
    display: flex;
    flex-direction: column;
    gap: 2px;

    a {
      color: ${BRAND.sidebarText};
      text-decoration: none;
      font-weight: 600;

      &:hover {
        color: ${BRAND.secondary};
      }
    }

    span {
      font-size: 9pt;
      color: rgba(255, 255, 255, 0.75);
    }
  }
`;

const MainSection = styled(Section)`
  margin-bottom: var(--resume-spacing-section, 40px);
  padding-bottom: 10px;
`;

const MainSectionTitle = styled.h2`
  font-size: 16pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 25px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid ${BRAND.secondary};
  color: ${BRAND.primary};
`;

const ProfileText = styled.p`
  text-align: justify;
  line-height: 1.8;
  color: ${BRAND.text};
`;

const WorkItem = styled.div`
  margin-bottom: 30px;
  position: relative;
  padding-left: 25px;

  &:before {
    content: "";
    position: absolute;
    left: 4px;
    top: 8px;
    width: 10px;
    height: 10px;
    background: ${BRAND.secondary};
    border-radius: 50%;
  }

  &:after {
    content: "";
    position: absolute;
    left: 8px;
    top: 20px;
    width: 2px;
    height: calc(100% - 10px);
    background: ${BRAND.border};
  }

  &:last-child:after {
    display: none;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const WorkTitle = styled.h3`
  font-size: 12pt;
  font-weight: 700;
  margin: 0;
  color: ${BRAND.primary};
`;

const WorkCompany = styled.div`
  font-size: 11pt;
  color: ${BRAND.muted};
  margin-bottom: 10px;

  a {
    color: ${BRAND.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: ${BRAND.secondary};
    }
  }
`;

const WorkDate = styled.div`
  font-size: 10pt;
  color: ${BRAND.muted};
  white-space: nowrap;
  text-align: right;
`;

const WorkDescription = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 20px;
  color: ${BRAND.text};

  li {
    margin: 6px 0;
    text-align: justify;
    line-height: 1.7;
  }
`;

const ReferenceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
`;

const AdditionalExperienceList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const AdditionalCard = styled.div`
  border: 1px solid ${BRAND.border};
  border-radius: 14px;
  padding: 15px 18px;
  background: #fff;

  h3 {
    margin: 0 0 4px 0;
    font-size: 12pt;
    color: ${BRAND.primary};
  }

  .dates {
    font-size: 10pt;
    color: ${BRAND.muted};
    margin-bottom: 8px;
  }

  p {
    margin: 0;
    font-size: 10pt;
    line-height: 1.5;
  }
`;

const VolunteerItem = styled.div`
  margin-bottom: 20px;
  padding-left: 18px;
  border-left: 3px solid ${BRAND.secondary};

  h3 {
    margin: 0;
    font-size: 12pt;
    color: ${BRAND.primary};
  }

  .org {
    font-size: 10pt;
    color: ${BRAND.muted};
  }

  ul {
    margin: 8px 0 0 16px;
    padding: 0;
  }

  li {
    margin: 4px 0;
  }
`;

const InterestsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    background: ${BRAND.highlight};
    border: 1px solid ${BRAND.secondary};
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 9.5pt;
    color: ${BRAND.primary};
  }
`;

const ReferenceCard = styled.div`
  padding: 15px 20px;
  border: 1px solid ${BRAND.border};
  border-radius: 12px;
  background: #fff;

  h3 {
    font-size: 12pt;
    font-weight: 700;
    margin: 0 0 5px 0;
    color: ${BRAND.primary};
  }

  .title {
    font-size: 10pt;
    color: ${BRAND.muted};
    margin-bottom: 8px;
  }

  .contact {
    font-size: 9pt;
    color: ${BRAND.muted};
    margin: 3px 0;
  }
`;

function formatDate(value) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(start, end) {
  if (!start) {
    return undefined;
  }

  const startLabel = formatDate(start);
  const endLabel = end ? formatDate(end) : "Present";
  return `${startLabel} – ${endLabel}`;
}

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
      content: "▪";
      position: absolute;
      left: 0;
      color: ${BRAND.secondary};
    }
  }
`;

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    languages = [],
    references = [],
    projects = [],
    awards = [],
    interests = [],
    volunteer = [],
  } = resume;

  const meta = resume.meta || {};
  const signatureNumbers = basics.signatureNumbers || [];
  const pitch = basics.pitch || [];
  const impact = meta.impact || [];
  const additionalExperience = meta.additionalExperience || [];

  // Split name into first and last for styling
  const nameParts = basics.name ? basics.name.split(" ") : [];
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts[nameParts.length - 1];
  const workFirstPage = work.slice(0, WORK_FIRST_PAGE_LIMIT);
  const workSecondPage = work.slice(WORK_FIRST_PAGE_LIMIT);
  const showSecondPage =
    workSecondPage.length > 0 ||
    projects.length > 0 ||
    volunteer.length > 0 ||
    additionalExperience.length > 0 ||
    awards.length > 0 ||
    references.length > 0 ||
    interests.length > 0;

  return (
    <Document>
      <FirstPage>
        <Layout>
          {/* Left Sidebar */}
          <Sidebar>
            {/* Profile Photo */}
            {basics.image && (
              <ProfilePhoto>
                <img src={basics.image} alt={basics.name} />
              </ProfilePhoto>
            )}

            {/* Contact Section */}
            {(basics.phone ||
              basics.email ||
              basics.location ||
              basics.url) && (
              <SidebarSection>
                <SidebarTitle>CONTACT</SidebarTitle>
                {basics.phone && (
                  <ContactItem>
                    <Icon>📞</Icon>
                    <span>{basics.phone}</span>
                  </ContactItem>
                )}
                {basics.email && (
                  <ContactItem>
                    <Icon>✉️</Icon>
                    <a href={safeUrl(`mailto:${basics.email}`)}>
                      {basics.email}
                    </a>
                  </ContactItem>
                )}
                {basics.location && (
                  <ContactItem>
                    <Icon>📍</Icon>
                    <span>
                      {[
                        basics.location.address,
                        basics.location.city,
                        basics.location.region,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </ContactItem>
                )}
                {basics.url && (
                  <ContactItem>
                    <Icon>🌐</Icon>
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

            {Array.isArray(basics.profiles) && basics.profiles.length > 0 && (
              <SidebarSection>
                <SidebarTitle>PROFILES</SidebarTitle>
                <ProfilesList>
                  {basics.profiles.map((profile, index) => (
                    <li key={`${profile.network}-${index}`}>
                      {profile.url ? (
                        <a
                          href={safeUrl(profile.url)}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {profile.username || profile.url}
                        </a>
                      ) : (
                        <span>{profile.username}</span>
                      )}
                      {profile.network && <span>{profile.network}</span>}
                    </li>
                  ))}
                </ProfilesList>
              </SidebarSection>
            )}

            {/* Education Section */}
            {education.length > 0 && (
              <SidebarSection>
                <SidebarTitle>EDUCATION</SidebarTitle>
                {education.map((edu, index) => (
                  <EducationItem key={index}>
                    <div className="dates">
                      {edu.startDate && edu.endDate
                        ? `${new Date(edu.startDate).getFullYear()} - ${new Date(
                            edu.endDate,
                          ).getFullYear()}`
                        : ""}
                    </div>
                    <h3>{edu.institution}</h3>
                    {edu.studyType && edu.area && (
                      <ul>
                        <li>
                          {edu.studyType} of {edu.area}
                        </li>
                        {edu.score && <li>GPA: {edu.score}</li>}
                      </ul>
                    )}
                  </EducationItem>
                ))}
              </SidebarSection>
            )}

            {/* Skills Section */}
            {skills.length > 0 && (
              <SidebarSection>
                <SidebarTitle>SKILLS</SidebarTitle>
                <SkillsList>
                  {skills.flatMap((skillGroup) =>
                    (skillGroup.keywords || []).map((skill, idx) => (
                      <li key={`${skillGroup.name}-${idx}`}>{skill}</li>
                    )),
                  )}
                </SkillsList>
              </SidebarSection>
            )}

            {/* Languages Section */}
            {languages.length > 0 && (
              <SidebarSection>
                <SidebarTitle>LANGUAGES</SidebarTitle>
                <LanguagesList>
                  {languages.map((lang, index) => (
                    <li key={index}>
                      {lang.language}
                      {lang.fluency && ` (${lang.fluency})`}
                    </li>
                  ))}
                </LanguagesList>
              </SidebarSection>
            )}
          </Sidebar>

          {/* Right Main Content */}
          <MainContent>
            <Hero>
              <HeroHeader>
                <div>
                  <Name>
                    {firstName && <span>{firstName} </span>}
                    {lastName}
                  </Name>
                  {basics.label && <JobTitle>{basics.label}</JobTitle>}
                  {basics.baseline && (
                    <HeroBaseline>{basics.baseline}</HeroBaseline>
                  )}
                </div>
                {signatureNumbers.length > 0 && (
                  <SignatureGrid>
                    {signatureNumbers.map((item, index) => (
                      <SignatureTile key={index}>{item}</SignatureTile>
                    ))}
                  </SignatureGrid>
                )}
              </HeroHeader>

              {pitch.length > 0 && (
                <PitchList>
                  {pitch.map((line, index) => (
                    <PitchItem key={index}>{line}</PitchItem>
                  ))}
                </PitchList>
              )}
            </Hero>

            {impact.length > 0 && (
              <ImpactGrid>
                {impact.map((metric, index) => (
                  <ImpactCard key={index}>
                    <ImpactLabel>{metric.label}</ImpactLabel>
                    <ImpactValue>{metric.value}</ImpactValue>
                    {metric.description && (
                      <ImpactDescription>
                        {metric.description}
                      </ImpactDescription>
                    )}
                  </ImpactCard>
                ))}
              </ImpactGrid>
            )}

            {/* Profile/Summary Section */}
            {basics.summary && (
              <MainSection>
                <MainSectionTitle>Profile</MainSectionTitle>
                <ProfileText>{basics.summary}</ProfileText>
              </MainSection>
            )}

            {/* Work Experience Section */}
            {workFirstPage.length > 0 && (
              <MainSection>
                <MainSectionTitle>WORK EXPERIENCE</MainSectionTitle>
                {workFirstPage.map((job, index) => (
                  <WorkItem key={index}>
                    <WorkHeader>
                      <div>
                        <WorkTitle>{job.name}</WorkTitle>
                        <WorkCompany>{job.position}</WorkCompany>
                      </div>
                      {job.startDate && (
                        <WorkDate>
                          {formatDateRange(job.startDate, job.endDate)}
                        </WorkDate>
                      )}
                    </WorkHeader>
                    {job.summary && (
                      <p style={{ marginBottom: "10px", color: "#4a4a4a" }}>
                        {job.summary}
                      </p>
                    )}
                    {job.highlights && job.highlights.length > 0 && (
                      <WorkDescription>
                        {job.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </WorkDescription>
                    )}
                  </WorkItem>
                ))}
              </MainSection>
            )}

            {/* Projects Section */}
          </MainContent>
        </Layout>
      </FirstPage>

      {showSecondPage && (
        <SecondPage>
          {workSecondPage.length > 0 && (
            <MainSection>
              <MainSectionTitle>WORK EXPERIENCE (CONT.)</MainSectionTitle>
              {workSecondPage.map((job, index) => (
                <WorkItem key={index}>
                  <WorkHeader>
                    <div>
                      <WorkTitle>{job.name}</WorkTitle>
                      <WorkCompany>{job.position}</WorkCompany>
                    </div>
                    {job.startDate && (
                      <WorkDate>
                        {formatDateRange(job.startDate, job.endDate)}
                      </WorkDate>
                    )}
                  </WorkHeader>
                  {job.summary && (
                    <p style={{ marginBottom: "10px", color: BRAND.text }}>
                      {job.summary}
                    </p>
                  )}
                  {job.highlights && job.highlights.length > 0 && (
                    <WorkDescription>
                      {job.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </WorkDescription>
                  )}
                </WorkItem>
              ))}
            </MainSection>
          )}

          {projects.length > 0 && (
            <MainSection>
              <MainSectionTitle>PROJECTS</MainSectionTitle>
              {projects.map((project, index) => (
                <WorkItem key={index}>
                  <WorkHeader>
                    <div>
                      <WorkTitle>{project.name}</WorkTitle>
                      {project.url && (
                        <WorkCompany>
                          <a
                            href={safeUrl(project.url)}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {project.url}
                          </a>
                        </WorkCompany>
                      )}
                    </div>
                    {project.startDate && (
                      <WorkDate>
                        {formatDateRange(project.startDate, project.endDate)}
                      </WorkDate>
                    )}
                  </WorkHeader>
                  {project.description && (
                    <p style={{ marginBottom: "10px", color: BRAND.text }}>
                      {project.description}
                    </p>
                  )}
                  {project.highlights && project.highlights.length > 0 && (
                    <WorkDescription>
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </WorkDescription>
                  )}
                </WorkItem>
              ))}
            </MainSection>
          )}

          {volunteer.length > 0 && (
            <MainSection>
              <MainSectionTitle>COMMUNITY</MainSectionTitle>
              {volunteer.map((item, index) => (
                <VolunteerItem key={index}>
                  <h3>{item.organization}</h3>
                  <div className="org">
                    {item.position}
                    {item.startDate &&
                      ` · ${formatDateRange(item.startDate, item.endDate)}`}
                  </div>
                  {item.summary && <p>{item.summary}</p>}
                  {item.highlights && (
                    <ul>
                      {item.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </VolunteerItem>
              ))}
            </MainSection>
          )}

          {additionalExperience.length > 0 && (
            <MainSection>
              <MainSectionTitle>ADDITIONAL EXPERIENCE</MainSectionTitle>
              <AdditionalExperienceList>
                {additionalExperience.map((extra, index) => (
                  <AdditionalCard key={index}>
                    <h3>{extra.name}</h3>
                    {extra.dates && <div className="dates">{extra.dates}</div>}
                    {extra.summary && <p>{extra.summary}</p>}
                  </AdditionalCard>
                ))}
              </AdditionalExperienceList>
            </MainSection>
          )}

          {awards.length > 0 && (
            <MainSection>
              <MainSectionTitle>AWARDS & HONORS</MainSectionTitle>
              {awards.map((award, index) => (
                <div
                  key={index}
                  style={{ marginBottom: "20px", paddingLeft: "25px" }}
                >
                  <WorkTitle>{award.title}</WorkTitle>
                  <WorkCompany>
                    {award.awarder}
                    {award.date && ` · ${formatDate(award.date)}`}
                  </WorkCompany>
                  {award.summary && (
                    <p style={{ marginTop: "8px", color: BRAND.text }}>
                      {award.summary}
                    </p>
                  )}
                </div>
              ))}
            </MainSection>
          )}

          {interests.length > 0 && (
            <MainSection>
              <MainSectionTitle>INTERESTS</MainSectionTitle>
              <InterestsList>
                {interests.map((interest, index) => (
                  <li key={index}>{interest.name}</li>
                ))}
              </InterestsList>
            </MainSection>
          )}

          {references.length > 0 && (
            <MainSection>
              <MainSectionTitle>REFERENCES</MainSectionTitle>
              <ReferenceGrid>
                {references.map((ref, index) => (
                  <ReferenceCard key={index}>
                    <h3>{ref.name}</h3>
                    {ref.reference && (
                      <div className="title">{ref.reference}</div>
                    )}
                    {ref.contact && (
                      <div className="contact">{ref.contact}</div>
                    )}
                  </ReferenceCard>
                ))}
              </ReferenceGrid>
            </MainSection>
          )}
        </SecondPage>
      )}
    </Document>
  );
}

Resume.propTypes = {
  resume: PropTypes.shape({
    basics: PropTypes.object,
    work: PropTypes.arrayOf(PropTypes.object),
    education: PropTypes.arrayOf(PropTypes.object),
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        level: PropTypes.string,
        keywords: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
    languages: PropTypes.arrayOf(
      PropTypes.shape({
        language: PropTypes.string,
        fluency: PropTypes.string,
      }),
    ),
    references: PropTypes.arrayOf(PropTypes.object),
    projects: PropTypes.arrayOf(PropTypes.object),
    awards: PropTypes.arrayOf(PropTypes.object),
    interests: PropTypes.arrayOf(PropTypes.object),
    volunteer: PropTypes.arrayOf(PropTypes.object),
    meta: PropTypes.object,
  }).isRequired,
};

export default Resume;
