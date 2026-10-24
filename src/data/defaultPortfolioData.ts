import { PortfolioData } from "@/types/portfolio";

export const defaultPortfolioData: PortfolioData = {
  hero: {
    name: "Imran Hossain",
    affiliation: "Research Associate, BRAC Institute of Governance and Development (BIGD), BRAC University",
    bio: "I study development economics, with interests in applied microeconomics, political economy, poverty, inequality and education in Bangladesh. I design surveys, run fieldwork and analyse household data. I am applying to PhD programmes in economics.",
    cvUrl: "/imranh_cv.pdf",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/imranh47/",
      github: "https://github.com/ImranH47",
      twitter: "https://x.com/ImranH_47/",
      email: "imranh.econ@gmail.com",
    },
  },
  education: [
    {
      id: "edu-1",
      degree: "MS in Mathematics",
      institution: "Ahsanullah University of Science and Technology",
      period: "2025–present",
    },
    {
      id: "edu-2",
      degree: "BSc in Economics",
      institution: "Jahangirnagar University",
      period: "2024",
    },
  ],
  research: [
    {
      id: "crop-diversification",
      year: "2026",
      title: "Does Crop Diversification Improve Rural Household Income in Bangladesh?",
      authors: "Imran Hossain",
      status: "Working paper",
      url: "/papers/crop-diversification.pdf",
      abstract:
        "This paper examines whether shifting away from mono-cropping toward high-value horticultural and seasonal crop diversification enhances per capita household income and resilience against climatic shocks in rural Bangladesh. Utilizing nationally representative household survey microdata, we employ instrumental variable (IV) and panel fixed-effects estimation to address potential endogeneity in agricultural portfolio selection. The empirical findings suggest significant positive income effects, particularly pronounced among marginal and smallholder farm households facing credit constraints.",
    },
    {
      id: "institutional-quality",
      year: "2024",
      title: "Does Institutional Quality Matter for Financial Development? Evidence from Six Asian Emerging Economies",
      authors: "Samia Islam, Mohammad Obaidullah, Imran Hossain, Ann Naser Nabil",
      status: "Presented at the 7th SANEM Annual Economists' Conference",
      url: "/papers/institutional-quality.pdf",
      abstract:
        "Investigating the empirical relationship between governance quality and financial system deepening across six emerging Asian economies. Using dynamic panel econometrics (System GMM and Pooled Mean Group estimators) over a multi-decade panel, the study demonstrates that rule of law, regulatory quality, and control of corruption exert statistically robust long-run multiplier effects on private sector credit allocation and equity market capitalization.",
    },
  ],
  policy: [
    {
      id: "policy-1",
      title: "Family Card Programme: PMT evaluation",
      tags: ["Targeting", "Survey design", "Fieldwork"],
      description:
        "Evaluating the proxy means test scoring system: designed the questionnaire, trained enumerators, coordinated fieldwork and drafted the report.",
    },
    {
      id: "policy-2",
      title: "UPGP intergenerational panel",
      tags: ["Panel data", "Poverty"],
      description:
        "Data management for a panel following BRAC Ultra-Poor Graduation Programme households across generations.",
    },
    {
      id: "policy-3",
      title: "No Means No adaptation for an RCT",
      tags: ["Gender", "RCT"],
      description:
        "Helped adapt a self-defence curriculum for adolescent girls for a randomised evaluation.",
    },
  ],
  teaching: [
    {
      id: "teaching-1",
      badge: "2026",
      title: "A Backbencher's Guide to Econometrics",
      description:
        "A plain-language introductory econometrics booklet, printed on a not-for-profit basis and used by over 100 students and 20 university teachers in Bangladesh.",
    },
    {
      id: "teaching-2",
      badge: "In progress",
      title: "Bangla translation of Good Economics for Hard Times",
      description: "By Abhijit V. Banerjee and Esther Duflo.",
    },
  ],
  writing: {
    intro:
      "Between 2024 and 2026, I wrote over a hundred research-driven features for The Business Standard.",
    articles: [
      {
        id: "writing-1",
        title: "The PhD landscape in Bangladesh: A reality check",
        url: "https://www.tbsnews.net/features/panorama/phd-landscape-bangladesh-reality-check-1090906",
      },
      {
        id: "writing-2",
        title: "How crypto thrives in Bangladesh's legal grey zone",
        url: "https://www.tbsnews.net/features/panorama/how-crypto-thrives-bangladeshs-legal-grey-zone-1137576",
      },
      {
        id: "writing-3",
        title: "What about our own adolescents?",
        url: "https://www.tbsnews.net/features/panorama/what-about-our-own-adolescents-1124121",
      },
      {
        id: "writing-4",
        title: "Online moral police forces cracking down on interfaith relationships",
        url: "https://www.tbsnews.net/features/panorama/online-moral-police-forces-cracking-down-interfaith-relationships-1056001",
      },
      {
        id: "writing-5",
        title: "Dhaka's buried past: Archaeological excavation unveils new history",
        url: "https://www.tbsnews.net/features/panorama/dhakas-buried-past-archaeological-excavation-unveils-new-history-988176",
      },
    ],
  },
};
