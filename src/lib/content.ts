// Central content types + static fallback data.
//
// Everything here is used when Firestore is not yet configured (or empty),
// so the site always works. Once Firebase is connected and documents exist,
// the live Firestore data takes over automatically. See src/lib/data.ts.

export type Profile = {
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
  about: string[];
  email: string;
  phone: string;
  location: string;
  photoUrl: string | null;
  cvUrl: string;
  languages: string[];
  certifications: string[];
  software: string[];
  specialisms: string[];
  links: { label: string; url: string }[];
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
  order: number;
};

export type Education = {
  id: string;
  title: string;
  school: string;
  period: string;
  order: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  pdfUrl: string | null;
  details: string;
  learned: string;
  challenges: string;
  tags: string[];
  year: string;
  order: number;
};

export type Reference = {
  id: string;
  name: string;
  detail: string;
  contact: string;
  order: number;
};

// ---------------------------------------------------------------------------
// Static fallback content (from Greta's CV)
// ---------------------------------------------------------------------------

export const profileFallback: Profile = {
  name: "Greta Darguzyte",
  title: "Architectural Technologist",
  subtitle: "Fire Engineering Graduate",
  tagline:
    "Architectural Technologist specialising in fire safety compliance — turning building regulations into buildable, certified design.",
  about: [
    "Architectural Technologist with over three years' experience delivering building projects to current Irish building regulations. Completing a Fire Engineering degree (graduating Aug/Sept 2026) and specialising in fire safety compliance — preparing Fire Safety Certificate (FSC) and Disability Access Certificate (DAC) applications.",
    "I'm originally from Lithuania and moved here at a young age, growing up in Portlaoise before attending SETU in Carlow. I've always had an interest in the construction industry and how everything around me is built.",
    "Since working at MCOH Architects in Portlaoise I've been drawn to FSC and DAC work, and I'm now pursuing a career in fire safety with the support of my background in architectural design. I'm strong in technical drawing, tender documentation and consultant co-ordination.",
  ],
  email: "gretadarguzyte15@gmail.com",
  phone: "085 833 4084",
  location: "97 The Hill, Loughrea, Galway. H62 ET71",
  photoUrl: null,
  cvUrl: "/Greta_Darguzyte_CV.pdf",
  languages: ["English — Fluent", "Lithuanian — Fluent"],
  certifications: [
    "BSc Architectural Technology",
    "NZEB Fundamental Awareness",
  ],
  software: ["Revit", "AutoCAD", "SketchUp", "Lumion", "MS Office"],
  specialisms: [
    "FSC & DAC applications",
    "Building regulations",
    "Tender documentation",
    "Project co-ordination",
  ],
  links: [],
};

export const experienceFallback: Experience[] = [
  {
    id: "mcoh",
    role: "Architectural Technologist",
    company: "MCOH Architects, Portlaoise",
    period: "May 2023 – Present",
    bullets: [
      "Prepare and compile Fire Safety Certificate (FSC) and Disability Access Certificate (DAC) applications to current building regulations — current area of specialisation.",
      "Produce detailed technical drawings, supporting projects from concept to construction.",
      "Develop tender sets and supporting documentation for project procurement.",
      "Co-ordinate with engineers and consultants to resolve design and compliance issues.",
    ],
    order: 1,
  },
  {
    id: "g4s",
    role: "Customer Service · Traffic Management",
    company: "G4S, Kildare Village",
    period: "Oct 2021 – Apr 2023",
    bullets: [
      "Assisted visitors with security queries and complaints; worked within a large team alongside management and the public.",
    ],
    order: 2,
  },
];

export const educationFallback: Education[] = [
  {
    id: "fire",
    title: "Degree in Fire Engineering",
    school: "South East Technological University, Waterford",
    period: "Graduating 2026",
    order: 1,
  },
  {
    id: "arch",
    title: "BSc Architectural Technology",
    school: "South East Technological University, Carlow",
    period: "2020 – 2024",
    order: 2,
  },
];

export const referencesFallback: Reference[] = [
  {
    id: "susan",
    name: "Susan Harte",
    detail: "MCOH Architects, Portlaoise",
    contact: "085 781 0688",
    order: 1,
  },
  {
    id: "dorota",
    name: "Dorota Szydlowska",
    detail: "G4S Security, Kildare Village",
    contact: "086 464 5458 · Dorota.szydlowska@ie.g4s.com",
    order: 2,
  },
];

// Placeholder projects — replace these from the admin page (or Firebase Console).
export const projectsFallback: Project[] = [
  {
    id: "sample-fsc",
    title: "Fire Safety Certificate — Commercial Fit-out",
    description:
      "Compiled a full FSC application for a commercial unit: fire strategy, means of escape drawings, and compliance schedule to TGD Part B.",
    category: "Fire Safety Compliance",
    imageUrl: null,
    pdfUrl: null,
    details:
      "A full Fire Safety Certificate application for a commercial unit. I prepared the fire strategy, means-of-escape drawings, and a compliance schedule mapped to Technical Guidance Document Part B, then co-ordinated with the fire engineer through the assessment.",
    learned:
      "How to translate TGD Part B requirements into clear, assessable drawings, and how to structure a compliance schedule that reviewers can follow quickly.",
    challenges:
      "Resolving travel-distance and compartmentation queries where the existing layout didn't obviously comply — worked through alternative approaches with the fire engineer.",
    tags: ["FSC", "TGD Part B", "Revit"],
    year: "2025",
    order: 1,
  },
  {
    id: "sample-dac",
    title: "Disability Access Certificate — Retail",
    description:
      "Prepared a DAC application demonstrating compliance with TGD Part M, including accessible routes and level-access detailing.",
    category: "Accessibility Compliance",
    imageUrl: null,
    pdfUrl: null,
    details:
      "A Disability Access Certificate application for a retail unit, demonstrating compliance with TGD Part M — accessible routes, sanitary facilities, and level-access detailing — supported by a full drawing set and compliance report.",
    learned:
      "The detail level Part M compliance demands, and how accessibility decisions ripple through the wider layout and detailing.",
    challenges:
      "Achieving level access and compliant sanitary provision within a constrained existing footprint.",
    tags: ["DAC", "TGD Part M", "AutoCAD"],
    year: "2024",
    order: 2,
  },
  {
    id: "sample-tender",
    title: "Tender Documentation — Residential Scheme",
    description:
      "Developed a full tender set for a residential project: technical drawings, specifications and supporting documentation.",
    category: "Technical Drawing",
    imageUrl: null,
    pdfUrl: null,
    details:
      "Produced a complete tender package for a residential scheme — technical drawings, specifications, and supporting documentation — taking the project from concept through to a procurement-ready set.",
    learned:
      "How a coherent tender set reduces contractor queries, and the value of consistency across drawings and specifications.",
    challenges:
      "Keeping the drawing set and specifications aligned as the design developed toward tender.",
    tags: ["Tender", "SketchUp", "Lumion"],
    year: "2024",
    order: 3,
  },
];
