# Greta Darguzyte — Portfolio

Personal portfolio site for **Greta Darguzyte**, Architectural Technologist & Fire
Engineering graduate. Built with Next.js + Tailwind CSS, with **live content from
Firebase Firestore** so the site can be updated without touching code.

- **Works immediately** using built-in CV content (no Firebase needed to run).
- **Goes live** with Firestore once you add your Firebase config — then you edit
  your profile, projects, experience, etc. straight from the Firebase Console.
- **Free to host** on Vercel.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. You'll see the full site using the built-in content
from `src/lib/content.ts`.

---

## 2. Connect Firebase (live updates)

1. Go to the [Firebase Console](https://console.firebase.google.com/) and open (or
   create) your project.
2. Add a **Web app** (`</>` icon) if you don't have one. Copy the config values.
3. In **Build → Firestore Database**, click **Create database**.
4. Copy `.env.example` to `.env.local` and paste your values:

   ```bash
   cp .env.example .env.local
   ```

5. Restart `npm run dev`. The site now reads live from Firestore and updates in
   real time as you change data.

### Firestore data model

Everything is optional — anything missing falls back to the built-in content.

| Collection / Document      | Fields                                                        |
| -------------------------- | ------------------------------------------------------------ |
| `profile/main` (one doc)   | `name`, `title`, `subtitle`, `tagline`, `about` (array of paragraphs), `email`, `phone`, `location`, `photoUrl`, `cvUrl`, `languages[]`, `certifications[]`, `software[]`, `specialisms[]` |
| `projects/{id}`            | `title`, `description`, `category`, `imageUrl`, `pdfUrl`, `details`, `learned`, `challenges`, `tags[]`, `year`, `order` |
| `experience/{id}`          | `role`, `company`, `period`, `bullets[]`, `order`            |
| `education/{id}`           | `title`, `school`, `period`, `order`                         |
| `references/{id}`          | `name`, `detail`, `contact`, `order`                         |

## Editing the site (no code)

The site has a built-in editor at **`/admin`** (there's also an "Edit site" link in
the footer). Sign in with a Firebase account and you can change your profile,
upload a profile photo, add/edit/delete projects (with cover image + project PDF),
and update experience, education and references. Changes save to Firestore and
appear on the live site immediately.

### One-time setup for the editor

1. **Authentication** — Firebase Console → **Build → Authentication → Get started**
   → enable **Email/Password**. Then **Users → Add user** and create your login
   (email + password). This is the account you sign in with at `/admin`.
2. **Storage** — Firebase Console → **Build → Storage → Get started** (accept the
   default bucket). This holds uploaded photos and PDFs.

### Seeding the starter content

Run once to load the CV content into Firestore:

```bash
npm run seed
```

### Security rules (public reads, signed-in writes)

Once your content is seeded and you've created your Auth user, lock things down so
anyone can *view* the site but only *you* (signed in) can edit.

**Firestore → Rules:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;                 // public portfolio
      allow write: if request.auth != null; // only signed-in admin
    }
  }
}
```

**Storage → Rules:**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;                  // photos/PDFs are public
      allow write: if request.auth != null; // only signed-in admin uploads
    }
  }
}
```

> Note: `npm run seed` writes directly and needs write access. Run it *before*
> switching Firestore rules to the signed-in-only version above (or temporarily
> allow writes while seeding).


---

## 3. Deploy to Vercel (free)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), **Add New → Project**, and import the repo.
3. In the project's **Settings → Environment Variables**, add the same six
   `NEXT_PUBLIC_FIREBASE_*` values from your `.env.local`.
4. Click **Deploy**. Done — you get a free `*.vercel.app` URL.

Any future `git push` to the main branch redeploys automatically. Content edits in
Firestore appear live **without** a redeploy.

---

## Updating the CV PDF

The downloadable CV lives at `public/Greta_Darguzyte_CV.pdf`. Replace that file (keep
the name) and redeploy, or point `cvUrl` on `profile/main` to a hosted PDF URL.
