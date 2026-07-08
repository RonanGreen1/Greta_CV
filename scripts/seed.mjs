// One-time seed script.
//
// Loads Greta's CV content into Firestore so it can be edited from the
// Firebase Console. Safe to re-run — it overwrites the same documents.
//
// Run with:  npm run seed
// (Requires Firestore to be created and write access — see README / instructions.)

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Missing Firebase config. Run with:  node --env-file=.env.local scripts/seed.mjs",
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const profile = {
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
  certifications: ["BSc Architectural Technology", "NZEB Fundamental Awareness"],
  software: ["Revit", "AutoCAD", "SketchUp", "Lumion", "MS Office"],
  specialisms: [
    "FSC & DAC applications",
    "Building regulations",
    "Tender documentation",
    "Project co-ordination",
  ],
};

const experience = [
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

const education = [
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

const references = [
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

const projects = [
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

async function seed() {
  console.log("Seeding profile…");
  await setDoc(doc(db, "profile", "main"), profile);

  for (const item of experience) {
    const { id, ...rest } = item;
    await setDoc(doc(collection(db, "experience"), id), rest);
  }
  console.log("Seeded experience.");

  for (const item of education) {
    const { id, ...rest } = item;
    await setDoc(doc(collection(db, "education"), id), rest);
  }
  console.log("Seeded education.");

  for (const item of references) {
    const { id, ...rest } = item;
    await setDoc(doc(collection(db, "references"), id), rest);
  }
  console.log("Seeded references.");

  for (const item of projects) {
    const { id, ...rest } = item;
    await setDoc(doc(collection(db, "projects"), id), rest);
  }
  console.log("Seeded projects.");

  console.log("\n✅ Done. Your CV content is now in Firestore and editable from the Console.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
