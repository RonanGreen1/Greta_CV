// One-time: apply a CORS policy to the Firebase Storage bucket so the browser
// admin editor can upload files (photos, CV, project PDFs/ZIPs).
//
// Why this is needed: browser uploads send a CORS preflight (OPTIONS) request.
// A fresh Firebase Storage bucket has no CORS rules, so the preflight is
// rejected and Chrome reports "blocked by CORS / no HTTP ok status".
//
// Usage:
//   1. Firebase Console → Project settings (gear) → Service accounts
//      → "Generate new private key" → save the downloaded JSON somewhere safe.
//   2. Run:
//        GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json" \
//          node scripts/set-cors.mjs
//
// This only needs to be run once per bucket.

import { Storage } from "@google-cloud/storage";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BUCKET = process.env.FIREBASE_STORAGE_BUCKET || "gretacv-2c91a.firebasestorage.app";

const here = dirname(fileURLToPath(import.meta.url));
const cors = JSON.parse(await readFile(join(here, "cors.json"), "utf8"));

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    "\nMissing GOOGLE_APPLICATION_CREDENTIALS.\n" +
      "Download a service account key from Firebase Console → Project settings\n" +
      "→ Service accounts → Generate new private key, then run:\n\n" +
      '  GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json" node scripts/set-cors.mjs\n',
  );
  process.exit(1);
}

const storage = new Storage();
await storage.bucket(BUCKET).setCorsConfiguration(cors);
console.log(`✓ CORS policy applied to gs://${BUCKET}`);
console.log("Uploads from the browser admin editor will now work.");
