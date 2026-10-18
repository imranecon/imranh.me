export interface SocialLink {
  label: string;
  href: string;
}

export interface HeroData {
  name: string;
  affiliation: string;
  bio: string;
  cvUrl?: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    email: string;
  };
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface ResearchItem {
  id: string;
  year: string;
  title: string;
  authors: string;
  status: string;
  url: string;
  abstract: string;
}

export interface PolicyItem {
  id: string;
  title: string;
  tags: string[];
  description: string;
}

export interface TeachingItem {
  id: string;
  badge: string;
  title: string;
  description: string;
}

export interface WritingItem {
  id: string;
  title: string;
  url: string;
}

export interface WritingData {
  intro: string;
  articles: WritingItem[];
}

export interface PortfolioData {
  hero: HeroData;
  education: EducationItem[];
  research: ResearchItem[];
  policy: PolicyItem[];
  teaching: TeachingItem[];
  writing: WritingData;
}
