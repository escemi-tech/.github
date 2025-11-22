export type ResumeStrings = {
  sections: {
    impact: string;
    professional: string;
    projects: string;
    community: string;
    skills: string;
    languages: string;
    education: string;
    certificates: string;
  };
  labels: {
    present: string;
  };
};

export type BasicsProfile = {
  network?: string;
  url?: string;
};

export type BasicsLocation = {
  city?: string;
  region?: string;
};

export type Basics = {
  name?: string;
  label?: string;
  summary?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  location?: BasicsLocation;
  profiles?: BasicsProfile[];
};

export type SkillGroup = {
  name?: string;
  keywords?: string[];
};

export type Language = {
  language?: string;
  fluency?: string;
};

export type Education = {
  studyType?: string;
  area?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
};

export type Certificate = {
  name?: string;
  issuer?: string;
  date?: string;
};

export type ExperienceEntry = {
  id?: string;
  name?: string;
  organization?: string;
  entity?: string;
  client?: string;
  title?: string;
  position?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  summary?: string;
  highlights?: string[];
  keywords?: string[];
  url?: string;
};

export type ProjectEntry = {
  id?: string;
  name?: string;
  entity?: string;
  organization?: string;
  roles?: string[];
  keywords?: string[];
  highlights?: string[];
  description?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  url?: string;
};

export type CommunityEntry = {
  id?: string;
  organization?: string;
  name?: string;
  position?: string;
  summary?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
  location?: string;
  url?: string;
};

export type ExtraSection =
  | {
      type: "experience";
      label: string;
      icon: string;
      entries: ExperienceEntry[];
    }
  | {
      type: "projects";
      label: string;
      icon: string;
      entries: ProjectEntry[];
    }
  | {
      type: "community";
      label: string;
      icon: string;
      entries: CommunityEntry[];
    };

export type ResumeSchema = {
  basics?: Basics;
  work?: ExperienceEntry[];
  education?: Education[];
  skills?: SkillGroup[];
  languages?: Language[];
  projects?: ProjectEntry[];
  volunteer?: CommunityEntry[];
  certificates?: Certificate[];
};

export type RenderOptions = {
  locale?: string;
  dir?: "ltr" | "rtl";
  title?: string;
};
