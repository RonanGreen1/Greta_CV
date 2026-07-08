"use client";

// Live data layer.
//
// usePortfolio() returns all site content. When Firebase is configured it
// subscribes to Firestore in real time, so edits made in the Firebase Console
// appear on the site instantly (no redeploy, no code changes). When Firebase
// is not configured, it returns the static fallback from content.ts.
//
// Firestore data model (all optional — anything missing uses the fallback):
//   profile/main            → a single document with the Profile fields
//   experience/{autoId}     → { role, company, period, bullets[], order }
//   education/{autoId}      → { title, school, period, order }
//   projects/{autoId}       → { title, description, category, imageUrl, tags[], year, order }
//   references/{autoId}     → { name, detail, contact, order }

import { useEffect, useState } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db, isFirebaseEnabled } from "./firebase";
import {
  profileFallback,
  experienceFallback,
  educationFallback,
  projectsFallback,
  referencesFallback,
  type Profile,
  type Experience,
  type Education,
  type Project,
  type Reference,
} from "./content";

export type Portfolio = {
  profile: Profile;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  references: Reference[];
  loading: boolean;
  source: "firestore" | "static";
};

function byOrder<T extends { order?: number }>(a: T, b: T) {
  return (a.order ?? 0) - (b.order ?? 0);
}

export function usePortfolio(): Portfolio {
  const [profile, setProfile] = useState<Profile>(profileFallback);
  const [experience, setExperience] = useState<Experience[]>(experienceFallback);
  const [education, setEducation] = useState<Education[]>(educationFallback);
  const [projects, setProjects] = useState<Project[]>(projectsFallback);
  const [references, setReferences] = useState<Reference[]>(referencesFallback);
  const [loading, setLoading] = useState<boolean>(isFirebaseEnabled);

  useEffect(() => {
    if (!isFirebaseEnabled || !db) return;

    const unsubscribers: Array<() => void> = [];

    // profile/main — merge onto fallback so partial docs still render.
    unsubscribers.push(
      onSnapshot(doc(db, "profile", "main"), (snap) => {
        if (snap.exists()) {
          setProfile({ ...profileFallback, ...(snap.data() as Partial<Profile>) });
        }
        setLoading(false);
      }),
    );

    unsubscribers.push(
      onSnapshot(collection(db, "experience"), (snap) => {
        if (!snap.empty) {
          setExperience(
            snap.docs
              .map((d) => ({ id: d.id, ...(d.data() as Omit<Experience, "id">) }))
              .sort(byOrder),
          );
        }
      }),
    );

    unsubscribers.push(
      onSnapshot(collection(db, "education"), (snap) => {
        if (!snap.empty) {
          setEducation(
            snap.docs
              .map((d) => ({ id: d.id, ...(d.data() as Omit<Education, "id">) }))
              .sort(byOrder),
          );
        }
      }),
    );

    unsubscribers.push(
      onSnapshot(collection(db, "projects"), (snap) => {
        if (!snap.empty) {
          setProjects(
            snap.docs
              .map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }))
              .sort(byOrder),
          );
        }
      }),
    );

    unsubscribers.push(
      onSnapshot(collection(db, "references"), (snap) => {
        if (!snap.empty) {
          setReferences(
            snap.docs
              .map((d) => ({ id: d.id, ...(d.data() as Omit<Reference, "id">) }))
              .sort(byOrder),
          );
        }
      }),
    );

    return () => unsubscribers.forEach((u) => u());
  }, []);

  return {
    profile,
    experience,
    education,
    projects,
    references,
    loading,
    source: isFirebaseEnabled ? "firestore" : "static",
  };
}
