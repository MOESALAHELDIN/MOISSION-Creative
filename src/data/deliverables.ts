export interface DeliverableItem {
  no: string;
  category: string;
  deliverable: string;
  matrixRole: string;
  owner: string;
  ownerRole: string;
  department: string;
  support?: string;
}

export const DELIVERABLES: DeliverableItem[] = [
  {
    "no": "1",
    "category": "Executive",
    "deliverable": "Executive summary / one-page project overview",
    "matrixRole": "Creative Director",
    "owner": "Elena Marchetti",
    "ownerRole": "Creative Director",
    "department": "Creative & Design",
    "support": "Maya Clark"
  },
  {
    "no": "2",
    "category": "Executive",
    "deliverable": "Project charter: objectives, scope, success criteria, sign-off",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Maya Clark"
  },
  {
    "no": "3",
    "category": "Executive",
    "deliverable": "Business case and design-value statement (ROI, risk, benefit)",
    "matrixRole": "Strategy Director",
    "owner": "Julian Voss",
    "ownerRole": "Chief Brand Officer",
    "department": "Brand & Strategy",
    "support": "Omar Farouk"
  },
  {
    "no": "4",
    "category": "Executive",
    "deliverable": "Brand strategy on a page (purpose, positioning, values)",
    "matrixRole": "Brand Strategist",
    "owner": "Simon well",
    "ownerRole": "Brand Strategist",
    "department": "Brand & Strategy",
    "support": "Julian Voss"
  },
  {
    "no": "5",
    "category": "Executive",
    "deliverable": "Phased roadmap and rollout plan",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Julian Voss"
  },
  {
    "no": "6",
    "category": "Executive",
    "deliverable": "Decision log and stakeholder alignment record",
    "matrixRole": "Account Director",
    "owner": "Camille Laurent",
    "ownerRole": "Account Director",
    "department": "Client Services & Operations",
    "support": "Maya Clark"
  },
  {
    "no": "7",
    "category": "Executive",
    "deliverable": "Final presentation deck for leadership",
    "matrixRole": "Creative Director",
    "owner": "Elena Marchetti",
    "ownerRole": "Creative Director",
    "department": "Creative & Design",
    "support": "Camille Laurent"
  },
  {
    "no": "8",
    "category": "Executive",
    "deliverable": "Risk summary and mitigation brief",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Maya Clark"
  },
  {
    "no": "9",
    "category": "Strategic & Research",
    "deliverable": "Stakeholder interview summary",
    "matrixRole": "Brand Strategist",
    "owner": "Simon well",
    "ownerRole": "Brand Strategist",
    "department": "Brand & Strategy",
    "support": "Camille Laurent"
  },
  {
    "no": "10",
    "category": "Strategic & Research",
    "deliverable": "Brand audit: inventory of brand elements and consumer perception",
    "matrixRole": "Brand Strategist",
    "owner": "Simon well",
    "ownerRole": "Brand Strategist",
    "department": "Brand & Strategy",
    "support": "Hana Lindqvist"
  },
  {
    "no": "11",
    "category": "Strategic & Research",
    "deliverable": "Competitor and market analysis",
    "matrixRole": "Market Research Analyst",
    "owner": "Hana Lindqvist",
    "ownerRole": "Market Research Analyst",
    "department": "Brand & Strategy",
    "support": "Simon well"
  },
  {
    "no": "12",
    "category": "Strategic & Research",
    "deliverable": "User/audience research report, personas, journey maps",
    "matrixRole": "UX Researcher",
    "owner": "Amera Osei",
    "ownerRole": "UX Researcher",
    "department": "Brand & Strategy",
    "support": "Hana Lindqvist"
  },
  {
    "no": "13",
    "category": "Strategic & Research",
    "deliverable": "Problem statement and \"How Might We\" framing",
    "matrixRole": "Strategy Director",
    "owner": "Julian Voss",
    "ownerRole": "Chief Brand Officer",
    "department": "Brand & Strategy",
    "support": "Simon well"
  },
  {
    "no": "14",
    "category": "Strategic & Research",
    "deliverable": "Positioning statement and brand architecture",
    "matrixRole": "Brand Strategist",
    "owner": "Simon well",
    "ownerRole": "Brand Strategist",
    "department": "Brand & Strategy",
    "support": "Julian Voss"
  },
  {
    "no": "15",
    "category": "Strategic & Research",
    "deliverable": "Brand platform: essence, personality, relationship, symbology, cultural expression",
    "matrixRole": "Brand Strategist",
    "owner": "Simon well",
    "ownerRole": "Brand Strategist",
    "department": "Brand & Strategy",
    "support": "Julian Voss"
  },
  {
    "no": "16",
    "category": "Strategic & Research",
    "deliverable": "Naming strategy and shortlist",
    "matrixRole": "Naming Specialist / Verbal Identity Lead",
    "owner": "Theo Marlowe",
    "ownerRole": "Verbal Identity Lead",
    "department": "Brand & Strategy",
    "support": "Simon well"
  },
  {
    "no": "17",
    "category": "Creative",
    "deliverable": "Creative brief",
    "matrixRole": "Creative Director",
    "owner": "Elena Marchetti",
    "ownerRole": "Creative Director",
    "department": "Creative & Design",
    "support": "Camille Laurent"
  },
  {
    "no": "18",
    "category": "Creative",
    "deliverable": "Moodboards and visual territories",
    "matrixRole": "Art Director",
    "owner": "Isabela Cruz",
    "ownerRole": "Art Director",
    "department": "Creative & Design",
    "support": "Kofi Adeyemi"
  },
  {
    "no": "19",
    "category": "Creative",
    "deliverable": "Concept routes and sketches",
    "matrixRole": "Senior Brand Designer",
    "owner": "Kofi Adeyemi",
    "ownerRole": "Identity Designer",
    "department": "Creative & Design",
    "support": "Isabela Cruz"
  },
  {
    "no": "20",
    "category": "Creative",
    "deliverable": "Logo suite (primary, secondary, icon, lockups, clear-space and minimum-size rules)",
    "matrixRole": "Senior Brand Designer",
    "owner": "Kofi Adeyemi",
    "ownerRole": "Identity Designer",
    "department": "Creative & Design",
    "support": "Mina Park"
  },
  {
    "no": "21",
    "category": "Creative",
    "deliverable": "Colour system (primary, secondary, tints, print and screen values)",
    "matrixRole": "Brand Designer",
    "owner": "Mina Park",
    "ownerRole": "Brand Designer & Typographer",
    "department": "Creative & Design",
    "support": "Kofi Adeyemi"
  },
  {
    "no": "22",
    "category": "Creative",
    "deliverable": "Typography system (typefaces, hierarchy, licences)",
    "matrixRole": "Typographer / Brand Designer",
    "owner": "Mina Park",
    "ownerRole": "Brand Designer & Typographer",
    "department": "Creative & Design",
    "support": "Sana Haddad"
  },
  {
    "no": "23",
    "category": "Creative",
    "deliverable": "Imagery, illustration and iconography direction",
    "matrixRole": "Art Director",
    "owner": "Isabela Cruz",
    "ownerRole": "Art Director",
    "department": "Creative & Design",
    "support": "Tomas Berg"
  },
  {
    "no": "24",
    "category": "Creative",
    "deliverable": "Graphic elements, patterns and grid/layout system",
    "matrixRole": "Graphic Designer",
    "owner": "Tomas Berg",
    "ownerRole": "Graphic Designer",
    "department": "Creative & Design",
    "support": "Mina Park"
  },
  {
    "no": "25",
    "category": "Creative",
    "deliverable": "Verbal identity: tagline, messaging, tone of voice",
    "matrixRole": "Copywriter / Verbal Identity Lead",
    "owner": "Theo Marlowe",
    "ownerRole": "Verbal Identity Lead",
    "department": "Brand & Strategy",
    "support": "Nora Quinn"
  },
  {
    "no": "26",
    "category": "Creative",
    "deliverable": "Motion and sonic identity guidelines",
    "matrixRole": "Motion Designer / Sound Designer",
    "owner": "Declan Ruiz",
    "ownerRole": "Motion & Sound Designer",
    "department": "Creative & Design",
    "support": "Isabela Cruz"
  },
  {
    "no": "27",
    "category": "Creative",
    "deliverable": "Brand book / brand guidelines",
    "matrixRole": "Senior Brand Designer",
    "owner": "Kofi Adeyemi",
    "ownerRole": "Identity Designer",
    "department": "Creative & Design",
    "support": "Sana Haddad"
  },
  {
    "no": "28",
    "category": "Creative",
    "deliverable": "Collateral and application mockups (stationery, packaging, signage, social, presentation templates)",
    "matrixRole": "Graphic Designer",
    "owner": "Tomas Berg",
    "ownerRole": "Graphic Designer",
    "department": "Creative & Design",
    "support": "Dana Whitfield"
  },
  {
    "no": "29",
    "category": "Creative",
    "deliverable": "Final asset library (all formats, colour modes, sizes)",
    "matrixRole": "Production Designer",
    "owner": "Dana Whitfield",
    "ownerRole": "Production Manager",
    "department": "Digital & Production",
    "support": "Tomas Berg"
  },
  {
    "no": "30",
    "category": "Operational",
    "deliverable": "Proposal / statement of work with defined deliverables",
    "matrixRole": "Account Director",
    "owner": "Camille Laurent",
    "ownerRole": "Account Director",
    "department": "Client Services & Operations",
    "support": "Ines Duarte"
  },
  {
    "no": "31",
    "category": "Operational",
    "deliverable": "Project plan, timeline and work breakdown structure",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Victor Almeida"
  },
  {
    "no": "32",
    "category": "Operational",
    "deliverable": "RACI / roles and approval chain",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Maya Clark"
  },
  {
    "no": "33",
    "category": "Operational",
    "deliverable": "Communication plan and meeting cadence",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Camille Laurent"
  },
  {
    "no": "34",
    "category": "Operational",
    "deliverable": "Revision rounds and feedback log",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Camille Laurent"
  },
  {
    "no": "35",
    "category": "Operational",
    "deliverable": "Change request log",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Ines Duarte"
  },
  {
    "no": "36",
    "category": "Operational",
    "deliverable": "Budget, fee schedule, invoicing and payment milestones",
    "matrixRole": "Studio Manager / Finance Manager",
    "owner": "Omar Farouk",
    "ownerRole": "Finance Controller",
    "department": "Business & Growth",
    "support": "Ines Duarte"
  },
  {
    "no": "37",
    "category": "Operational",
    "deliverable": "Production specifications and print-ready/preflighted files",
    "matrixRole": "Production Designer / Prepress Operator",
    "owner": "Dana Whitfield",
    "ownerRole": "Production Manager",
    "department": "Digital & Production",
    "support": "Sana Haddad"
  },
  {
    "no": "38",
    "category": "Operational",
    "deliverable": "Source files handover (AI, PSD, Figma) and file-naming/asset structure",
    "matrixRole": "Design Operations Manager",
    "owner": "Victor Almeida",
    "ownerRole": "Design Operations Manager",
    "department": "Client Services & Operations",
    "support": "Dana Whitfield"
  },
  {
    "no": "39",
    "category": "Operational",
    "deliverable": "Implementation toolkit and client team onboarding/training",
    "matrixRole": "Brand Manager",
    "owner": "Lucia Ferrante",
    "ownerRole": "Brand Manager",
    "department": "Measurement & Governance",
    "support": "Sana Haddad"
  },
  {
    "no": "40",
    "category": "Operational",
    "deliverable": "Acceptance sign-off and closeout report",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Camille Laurent"
  },
  {
    "no": "41",
    "category": "Operational",
    "deliverable": "Lessons-learned report and project archive",
    "matrixRole": "Project Manager",
    "owner": "Marcus Bell",
    "ownerRole": "Project Manager",
    "department": "Client Services & Operations",
    "support": "Victor Almeida"
  },
  {
    "no": "42",
    "category": "Legal",
    "deliverable": "Design services agreement",
    "matrixRole": "Legal Counsel",
    "owner": "Hannah Cole",
    "ownerRole": "Legal Counsel",
    "department": "Legal & IP",
    "support": "Ines Duarte"
  },
  {
    "no": "43",
    "category": "Legal",
    "deliverable": "IP ownership clause: assignment or work-made-for-hire",
    "matrixRole": "IP Attorney",
    "owner": "Esther Nakamura",
    "ownerRole": "IP & Trademark Attorney",
    "department": "Legal & IP",
    "support": "Hannah Cole"
  },
  {
    "no": "44",
    "category": "Legal",
    "deliverable": "Usage-rights licence (scope, duration, territory, media)",
    "matrixRole": "IP Attorney",
    "owner": "Esther Nakamura",
    "ownerRole": "IP & Trademark Attorney",
    "department": "Legal & IP",
    "support": "Hannah Cole"
  },
  {
    "no": "45",
    "category": "Legal",
    "deliverable": "Font and stock-asset licence register (EULAs)",
    "matrixRole": "Design Operations Manager",
    "owner": "Victor Almeida",
    "ownerRole": "Design Operations Manager",
    "department": "Client Services & Operations",
    "support": "Esther Nakamura"
  },
  {
    "no": "46",
    "category": "Legal",
    "deliverable": "Third-party licences and releases (imagery, music, model/property)",
    "matrixRole": "Legal Counsel / Producer",
    "owner": "Hannah Cole",
    "ownerRole": "Legal Counsel",
    "department": "Legal & IP",
    "support": "Dana Whitfield"
  },
  {
    "no": "47",
    "category": "Legal",
    "deliverable": "Trademark clearance report",
    "matrixRole": "Trademark Attorney",
    "owner": "Esther Nakamura",
    "ownerRole": "IP & Trademark Attorney",
    "department": "Legal & IP",
    "support": "Hannah Cole"
  },
  {
    "no": "48",
    "category": "Legal",
    "deliverable": "Trademark registration filings (national and Madrid System)",
    "matrixRole": "Trademark Attorney",
    "owner": "Esther Nakamura",
    "ownerRole": "IP & Trademark Attorney",
    "department": "Legal & IP",
    "support": "Hannah Cole"
  },
  {
    "no": "49",
    "category": "Legal",
    "deliverable": "Industrial design registration (Hague System)",
    "matrixRole": "IP Attorney",
    "owner": "Esther Nakamura",
    "ownerRole": "IP & Trademark Attorney",
    "department": "Legal & IP",
    "support": "Hannah Cole"
  },
  {
    "no": "50",
    "category": "Legal",
    "deliverable": "Confidentiality / NDA",
    "matrixRole": "Legal Counsel",
    "owner": "Hannah Cole",
    "ownerRole": "Legal Counsel",
    "department": "Legal & IP",
    "support": "Ines Duarte"
  },
  {
    "no": "51",
    "category": "Legal",
    "deliverable": "Brand-usage and licensing rules for partners and co-branding",
    "matrixRole": "Brand Manager / Legal Counsel",
    "owner": "Lucia Ferrante",
    "ownerRole": "Brand Manager",
    "department": "Measurement & Governance",
    "support": "Hannah Cole"
  },
  {
    "no": "52",
    "category": "Digital & Accessibility",
    "deliverable": "UI/UX design files, wireframes and prototypes",
    "matrixRole": "UX/UI Designer",
    "owner": "Leo Tanaka",
    "ownerRole": "Web/UX Lead",
    "department": "Digital & Production",
    "support": "Karim Nasser"
  },
  {
    "no": "53",
    "category": "Digital & Accessibility",
    "deliverable": "Design system / component library and design tokens",
    "matrixRole": "Design Systems Designer",
    "owner": "Karim Nasser",
    "ownerRole": "Design Systems & Technology Lead",
    "department": "Digital & Production",
    "support": "Leo Tanaka"
  },
  {
    "no": "54",
    "category": "Digital & Accessibility",
    "deliverable": "Accessibility conformance review (WCAG 2.2)",
    "matrixRole": "Accessibility Specialist",
    "owner": "Selin Yildiz",
    "ownerRole": "Accessibility Specialist",
    "department": "Digital & Production",
    "support": "Leo Tanaka"
  },
  {
    "no": "55",
    "category": "Digital & Accessibility",
    "deliverable": "Colour-contrast and responsive/breakpoint specifications",
    "matrixRole": "UX/UI Designer",
    "owner": "Leo Tanaka",
    "ownerRole": "Web/UX Lead",
    "department": "Digital & Production",
    "support": "Selin Yildiz"
  },
  {
    "no": "56",
    "category": "Digital & Accessibility",
    "deliverable": "Usability testing report",
    "matrixRole": "UX Researcher",
    "owner": "Amera Osei",
    "ownerRole": "UX Researcher",
    "department": "Brand & Strategy",
    "support": "Leo Tanaka"
  },
  {
    "no": "57",
    "category": "Digital & Accessibility",
    "deliverable": "Developer handoff specifications",
    "matrixRole": "Design Technologist / UX/UI Designer",
    "owner": "Karim Nasser",
    "ownerRole": "Design Systems & Technology Lead",
    "department": "Digital & Production",
    "support": "Leo Tanaka"
  },
  {
    "no": "58",
    "category": "Measurement & Governance",
    "deliverable": "Brand evaluation framework (input elements, output dimensions, indicators)",
    "matrixRole": "Brand Analyst",
    "owner": "Jonas Weber",
    "ownerRole": "Brand Analyst",
    "department": "Measurement & Governance",
    "support": "Simon well"
  },
  {
    "no": "59",
    "category": "Measurement & Governance",
    "deliverable": "KPI baseline and post-launch measurement plan",
    "matrixRole": "Brand Analyst",
    "owner": "Jonas Weber",
    "ownerRole": "Brand Analyst",
    "department": "Measurement & Governance",
    "support": "Hana Lindqvist"
  },
  {
    "no": "60",
    "category": "Measurement & Governance",
    "deliverable": "Brand governance model and approval workflow",
    "matrixRole": "Brand Manager",
    "owner": "Lucia Ferrante",
    "ownerRole": "Brand Manager",
    "department": "Measurement & Governance",
    "support": "Maya Clark"
  },
  {
    "no": "61",
    "category": "Measurement & Governance",
    "deliverable": "Brand maintenance and update plan",
    "matrixRole": "Brand Manager",
    "owner": "Lucia Ferrante",
    "ownerRole": "Brand Manager",
    "department": "Measurement & Governance",
    "support": "Sana Haddad"
  },
  {
    "no": "62",
    "category": "Measurement & Governance",
    "deliverable": "Design maturity assessment",
    "matrixRole": "Design Operations Manager",
    "owner": "Victor Almeida",
    "ownerRole": "Design Operations Manager",
    "department": "Client Services & Operations",
    "support": "Maya Clark"
  }
];
