"use client";

// Admin write helpers. Used only by the protected /admin page.
// Reads happen through src/lib/data.ts; these functions perform writes.

import {
  doc,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import type { Profile, Project, Experience, Education, Reference } from "./content";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured.");
  return db;
}

export async function saveProfile(profile: Partial<Profile>) {
  await setDoc(doc(requireDb(), "profile", "main"), profile, { merge: true });
}

// Generic collection item save. `id` empty → auto-generated document id.
async function saveItem(
  col: string,
  id: string,
  data: Record<string, unknown>,
) {
  const database = requireDb();
  const target = id
    ? doc(database, col, id)
    : doc(collection(database, col));
  await setDoc(target, data, { merge: true });
  return target.id;
}

export function saveProject(id: string, data: Omit<Project, "id">) {
  return saveItem("projects", id, data);
}
export function saveExperience(id: string, data: Omit<Experience, "id">) {
  return saveItem("experience", id, data);
}
export function saveEducation(id: string, data: Omit<Education, "id">) {
  return saveItem("education", id, data);
}
export function saveReference(id: string, data: Omit<Reference, "id">) {
  return saveItem("references", id, data);
}

export async function deleteItem(col: string, id: string) {
  await deleteDoc(doc(requireDb(), col, id));
}

// Upload a file to Storage and return its public download URL.
// Uses a resumable upload so large files (big PDFs) are reliable and can
// report progress. `onProgress` receives a whole-number percentage (0–100).
export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  if (!storage) throw new Error("Firebase Storage is not configured.");
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise<string>((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        if (onProgress) {
          const pct = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          onProgress(pct);
        }
      },
      (error) => reject(error),
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref));
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}
