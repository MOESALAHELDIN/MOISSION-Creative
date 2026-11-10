export interface OrgTeam {
  team: string;
  roles: string;
  responsibilities: string;
}

export interface OrgDept {
  name: string;
  teams: OrgTeam[];
}

export const ORG_DEPARTMENTS: OrgDept[] = [
  { name: 'Strategy & Research', teams: [
    { team: 'Leadership', roles: 'Strategy Director (Moe, hands-on)', responsibilities: 'Business case and design-value statement; problem statement and "How Might We" framing' },
    { team: 'Brand Strategy', roles: 'Brand Strategist, Naming Specialist', responsibilities: 'Brand strategy on a page, stakeholder interviews, brand audit, positioning and architecture, brand platform, naming strategy' },
    { team: 'Research & Insights', roles: 'Market Research Analyst, UX Researcher', responsibilities: 'Competitor and market analysis, audience research, personas, journey maps' }
  ]},
  { name: 'Creative', teams: [
    { team: 'Leadership', roles: 'Creative Director (Moe, hands-on)', responsibilities: 'Creative brief, executive summary, final presentation deck' },
    { team: 'Art Direction', roles: 'Art Director, Typographer', responsibilities: 'Moodboards, visual territories, imagery and illustration direction, typography system' },
    { team: 'Brand Identity', roles: 'Senior Brand Designer, Brand Designer', responsibilities: 'Concept routes, logo suite, colour system, brand book' },
    { team: 'Graphic & Verbal', roles: 'Graphic Designer, Copywriter / Verbal Identity Lead', responsibilities: 'Graphic elements and layout system, collateral mockups, tagline, messaging, tone of voice' },
    { team: 'Motion & Sound', roles: 'Motion Designer, Sound Designer', responsibilities: 'Motion and sonic identity guidelines' },
    { team: 'Production', roles: 'Production Designer', responsibilities: 'Final asset library in all formats, colour modes and sizes' }
  ]},
  { name: 'Digital Experience', teams: [
    { team: 'Leadership', roles: 'Digital Lead (Moe, hands-on)', responsibilities: 'Owns the digital deliverables and their quality' },
    { team: 'UX/UI & Design Systems', roles: 'UX/UI Designer, Design Systems Designer', responsibilities: 'UI/UX files, wireframes, prototypes, design system and tokens, contrast and responsive specifications' },
    { team: 'Accessibility & Handoff', roles: 'Accessibility Specialist, Design Technologist', responsibilities: 'WCAG 2.2 conformance review, developer handoff specifications' }
  ]},
  { name: 'Client Services', teams: [
    { team: 'Leadership', roles: 'Account Director', responsibilities: 'Proposal / statement of work, decision log and stakeholder alignment' },
    { team: 'Project Management', roles: 'Project Manager', responsibilities: 'Project charter, plan and work breakdown, RACI, communication plan, revision and change logs, risk brief, sign-off, closeout and lessons learned' },
    { team: 'Brand Stewardship', roles: 'Brand Manager, Brand Analyst', responsibilities: 'Implementation toolkit and onboarding, brand governance and maintenance, brand-usage rules, brand evaluation and KPI plan' }
  ]},
  { name: 'Studio Operations', teams: [
    { team: 'Leadership', roles: 'Design Operations Manager', responsibilities: 'Source-file handover and asset structure, font and stock licence register, design maturity assessment' },
    { team: 'Finance & Administration', roles: 'Studio Manager / Finance Manager', responsibilities: 'Budget, fee schedule, invoicing and payment milestones' },
    { team: 'Production Support', roles: 'Producer, Prepress Operator', responsibilities: 'Production specifications and print-ready files, third-party licences and releases' }
  ]},
  { name: 'Legal & IP', teams: [
    { team: 'Leadership', roles: 'Legal Counsel', responsibilities: 'Design services agreement, confidentiality / NDA' },
    { team: 'Contracts & Licensing', roles: 'Legal Counsel', responsibilities: 'Usage-rights licences, brand licensing rules with Brand Stewardship' },
    { team: 'IP & Trademark', roles: 'IP Attorney, Trademark Attorney', responsibilities: 'IP ownership clause, trademark clearance and filings, industrial design registration' }
  ]}
];
