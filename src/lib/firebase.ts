// Firebase client initialisation.
//
// Reads config from NEXT_PUBLIC_* environment variables. These values are
// safe to expose in the browser (that's how Firebase web apps work); your
// data is protected by Firestore Security Rules, not by hiding the config.
//
// If the env vars are missing, isFirebaseEnabled is false and the app falls
// back to the static content in content.ts — so the site always works.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

let app: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;
let authInstance: Auth | undefined;

if (isFirebaseEnabled) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
  storageInstance = getStorage(app);
  authInstance = getAuth(app);
}

export const db = dbInstance;
export const storage = storageInstance;
export const auth = authInstance;
