"use client";

// Password-protected editor. Sign in with the email/password you create in
// Firebase Console → Authentication. Everything you change here saves to
// Firestore and appears on the live site immediately.

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth, isFirebaseEnabled } from "@/lib/firebase";
import { usePortfolio } from "@/lib/data";
import {
  saveProfile,
  saveProject,
  saveExperience,
  saveEducation,
  saveReference,
  deleteItem,
  uploadFile,
} from "@/lib/admin";
import type { Profile, Project, Experience, Education, Reference } from "@/lib/content";

// ---------- small helpers ----------
const linesToArr = (s: string) =>
  s.split("\n").map((l) => l.trim()).filter(Boolean);
const arrToLines = (a: string[] = []) => a.join("\n");
const csvToArr = (s: string) =>
  s.split(",").map((l) => l.trim()).filter(Boolean);
const arrToCsv = (a: string[] = []) => a.join(", ");

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!auth) {
      setChecked(true);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecked(true);
    });
  }, []);

  if (!isFirebaseEnabled) {
    return (
      <Shell>
        <p className="text-sm text-muted">
          Firebase isn&apos;t configured yet. Add your keys to{" "}
          <code>.env.local</code> and restart.
        </p>
      </Shell>
    );
  }

  if (!checked) {
    return (
      <Shell>
        <p className="text-sm text-muted">Loading…</p>
      </Shell>
    );
  }

  if (!user) return <Login />;

  return <Dashboard user={user} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Site editor</h1>
        <a href="/" className="text-sm text-muted hover:text-accent">
          ← Back to site
        </a>
      </div>
      {children}
    </main>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Wrong email or password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <form onSubmit={submit} className="max-w-sm space-y-4">
        <p className="text-sm text-muted">
          Sign in with the account you created in Firebase Authentication.
        </p>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </Shell>
  );
}

function Dashboard({ user }: { user: User }) {
  const { profile, projects, experience, education, references } = usePortfolio();

  return (
    <Shell>
      <div className="-mt-4 mb-8 flex items-center justify-between text-sm text-muted">
        <span>Signed in as {user.email}</span>
        <button
          onClick={() => auth && signOut(auth)}
          className="hover:text-accent"
        >
          Sign out
        </button>
      </div>

      <div className="space-y-10">
        <ProfileEditor profile={profile} />
        <ProjectsEditor projects={projects} />
        <ExperienceEditor items={experience} />
        <EducationEditor items={education} />
        <ReferencesEditor items={references} />
      </div>
    </Shell>
  );
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
function ProfileEditor({ profile }: { profile: Profile }) {
  const [form, setForm] = useState(profile);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => setForm(profile), [profile]);

  const set = (k: keyof Profile, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onPhoto(file: File) {
    setUploading(true);
    try {
      const url = await uploadFile(
        `profile/photo-${Date.now()}-${file.name}`,
        file,
      );
      set("photoUrl", url);
      await saveProfile({ photoUrl: url });
      setStatus("Photo updated ✓");
    } catch {
      setStatus("Photo upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function onCv(file: File) {
    setUploading(true);
    try {
      const url = await uploadFile(`cv/${file.name}`, file);
      set("cvUrl", url);
      await saveProfile({ cvUrl: url });
      setStatus("CV updated ✓");
    } catch {
      setStatus("CV upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setStatus("Saving…");
    try {
      await saveProfile({
        name: form.name,
        title: form.title,
        subtitle: form.subtitle,
        tagline: form.tagline,
        about: form.about,
        email: form.email,
        phone: form.phone,
        location: form.location,
        languages: form.languages,
        certifications: form.certifications,
        software: form.software,
        specialisms: form.specialisms,
      });
      setStatus("Saved ✓");
    } catch {
      setStatus("Save failed.");
    }
  }

  return (
    <Card title="About me & contact">
      <div className="flex items-center gap-4">
        {form.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.photoUrl}
            alt=""
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft text-accent">
            No photo
          </div>
        )}
        <label className={btnSecondary + " cursor-pointer"}>
          {uploading ? "Uploading…" : "Upload profile photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onPhoto(e.target.files[0])}
          />
        </label>
      </div>

      {uploading && <ProgressBar />}

      <Field label="Name">
        <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <Field label="Title">
        <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Subtitle">
        <input className={inputClass} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
      </Field>
      <Field label="Tagline">
        <textarea className={inputClass} rows={2} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
      </Field>
      <Field label="About (one paragraph per line)">
        <textarea
          className={inputClass}
          rows={6}
          value={arrToLines(form.about)}
          onChange={(e) => set("about", linesToArr(e.target.value))}
        />
      </Field>
      <Field label="Email">
        <input className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} />
      </Field>
      <Field label="Phone">
        <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </Field>
      <Field label="Location">
        <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} />
      </Field>
      <Field label="Specialisms (comma separated)">
        <input className={inputClass} value={arrToCsv(form.specialisms)} onChange={(e) => set("specialisms", csvToArr(e.target.value))} />
      </Field>
      <Field label="Software (comma separated)">
        <input className={inputClass} value={arrToCsv(form.software)} onChange={(e) => set("software", csvToArr(e.target.value))} />
      </Field>
      <Field label="Certifications (comma separated)">
        <input className={inputClass} value={arrToCsv(form.certifications)} onChange={(e) => set("certifications", csvToArr(e.target.value))} />
      </Field>
      <Field label="Languages (comma separated)">
        <input className={inputClass} value={arrToCsv(form.languages)} onChange={(e) => set("languages", csvToArr(e.target.value))} />
      </Field>

      <div className="flex items-center gap-4">
        <label className={btnSecondary + " cursor-pointer"}>
          {uploading ? "Uploading…" : "Replace CV PDF"}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onCv(e.target.files[0])}
          />
        </label>
        <span className="text-xs text-muted">Current: {form.cvUrl}</span>
      </div>

      <SaveRow status={status} onSave={save} />
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const emptyProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  category: "",
  imageUrl: null,
  pdfUrl: null,
  details: "",
  learned: "",
  challenges: "",
  tags: [],
  year: "",
  order: 99,
};

function ProjectsEditor({ projects }: { projects: Project[] }) {
  const [editing, setEditing] = useState<Project | "new" | null>(null);

  return (
    <Card title="Projects">
      <div className="space-y-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2"
          >
            <span className="text-sm">{p.title}</span>
            <div className="flex gap-3 text-sm">
              <button className="text-accent hover:underline" onClick={() => setEditing(p)}>
                Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => {
                  if (confirm(`Delete "${p.title}"?`)) deleteItem("projects", p.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className={btnSecondary + " mt-3"} onClick={() => setEditing("new")}>
        + Add project
      </button>

      {editing && (
        <ProjectForm
          initial={editing === "new" ? { id: "", ...emptyProject } : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
}

function ProjectForm({
  initial,
  onClose,
}: {
  initial: Project;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState<null | "imageUrl" | "pdfUrl">(null);
  const set = (k: keyof Project, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function onUpload(kind: "imageUrl" | "pdfUrl", file: File) {
    setUploading(kind);
    try {
      const url = await uploadFile(`projects/${Date.now()}-${file.name}`, file);
      set(kind, url);
      setStatus("Uploaded ✓ (remember to Save)");
    } catch {
      setStatus("Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setStatus("Saving…");
    try {
      const { id, ...data } = form;
      await saveProject(id, data);
      setStatus("Saved ✓");
      onClose();
    } catch {
      setStatus("Save failed.");
    }
  }

  return (
    <div className="mt-4 space-y-3 rounded-lg border border-accent/40 bg-background p-4">
      <Field label="Title">
        <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Category">
        <input className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)} />
      </Field>
      <Field label="Year">
        <input className={inputClass} value={form.year} onChange={(e) => set("year", e.target.value)} />
      </Field>
      <Field label="Short description (shown on card)">
        <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </Field>
      <Field label="Overview / details">
        <textarea className={inputClass} rows={4} value={form.details} onChange={(e) => set("details", e.target.value)} />
      </Field>
      <Field label="What I learned">
        <textarea className={inputClass} rows={3} value={form.learned} onChange={(e) => set("learned", e.target.value)} />
      </Field>
      <Field label="Challenges">
        <textarea className={inputClass} rows={3} value={form.challenges} onChange={(e) => set("challenges", e.target.value)} />
      </Field>
      <Field label="Tags (comma separated)">
        <input className={inputClass} value={arrToCsv(form.tags)} onChange={(e) => set("tags", csvToArr(e.target.value))} />
      </Field>
      <Field label="Order (lower shows first)">
        <input type="number" className={inputClass} value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
      </Field>

      <div className="flex flex-wrap gap-3">
        <label className={btnSecondary + " cursor-pointer"}>
          {uploading === "imageUrl"
            ? "Uploading…"
            : form.imageUrl
              ? "Replace image"
              : "Upload cover image"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload("imageUrl", e.target.files[0])} />
        </label>
        <label className={btnSecondary + " cursor-pointer"}>
          {uploading === "pdfUrl"
            ? "Uploading…"
            : form.pdfUrl
              ? "Replace file"
              : "Upload project file (PDF or ZIP)"}
          <input type="file" accept="application/pdf,.zip,application/zip" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload("pdfUrl", e.target.files[0])} />
        </label>
      </div>
      {uploading && <ProgressBar />}
      {form.pdfUrl && <p className="truncate text-xs text-muted">File: {form.pdfUrl}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button className={btnPrimary} onClick={save}>Save project</button>
        <button className="text-sm text-muted hover:text-accent" onClick={onClose}>Cancel</button>
        {status && <span className="text-sm text-muted">{status}</span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Experience / Education / References — simple CRUD
// ---------------------------------------------------------------------------
function ExperienceEditor({ items }: { items: Experience[] }) {
  const [editing, setEditing] = useState<Experience | "new" | null>(null);
  const blank: Experience = { id: "", role: "", company: "", period: "", bullets: [], order: 99 };
  return (
    <Card title="Experience">
      <ItemList
        items={items.map((i) => ({ id: i.id, label: `${i.role} — ${i.company}` }))}
        col="experience"
        onEdit={(id) => setEditing(items.find((i) => i.id === id)!)}
      />
      <button className={btnSecondary + " mt-3"} onClick={() => setEditing("new")}>+ Add experience</button>
      {editing && (
        <SimpleForm
          fields={[
            { key: "role", label: "Role" },
            { key: "company", label: "Company" },
            { key: "period", label: "Period" },
            { key: "bullets", label: "Bullets (one per line)", type: "lines" },
            { key: "order", label: "Order", type: "number" },
          ]}
          initial={editing === "new" ? blank : editing}
          onSave={(data) => saveExperience(data.id as string, data as unknown as Omit<Experience, "id">)}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
}

function EducationEditor({ items }: { items: Education[] }) {
  const [editing, setEditing] = useState<Education | "new" | null>(null);
  const blank: Education = { id: "", title: "", school: "", period: "", order: 99 };
  return (
    <Card title="Education">
      <ItemList
        items={items.map((i) => ({ id: i.id, label: i.title }))}
        col="education"
        onEdit={(id) => setEditing(items.find((i) => i.id === id)!)}
      />
      <button className={btnSecondary + " mt-3"} onClick={() => setEditing("new")}>+ Add education</button>
      {editing && (
        <SimpleForm
          fields={[
            { key: "title", label: "Title" },
            { key: "school", label: "School" },
            { key: "period", label: "Period" },
            { key: "order", label: "Order", type: "number" },
          ]}
          initial={editing === "new" ? blank : editing}
          onSave={(data) => saveEducation(data.id as string, data as unknown as Omit<Education, "id">)}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
}

function ReferencesEditor({ items }: { items: Reference[] }) {
  const [editing, setEditing] = useState<Reference | "new" | null>(null);
  const blank: Reference = { id: "", name: "", detail: "", contact: "", order: 99 };
  return (
    <Card title="References">
      <ItemList
        items={items.map((i) => ({ id: i.id, label: i.name }))}
        col="references"
        onEdit={(id) => setEditing(items.find((i) => i.id === id)!)}
      />
      <button className={btnSecondary + " mt-3"} onClick={() => setEditing("new")}>+ Add reference</button>
      {editing && (
        <SimpleForm
          fields={[
            { key: "name", label: "Name" },
            { key: "detail", label: "Detail" },
            { key: "contact", label: "Contact" },
            { key: "order", label: "Order", type: "number" },
          ]}
          initial={editing === "new" ? blank : editing}
          onSave={(data) => saveReference(data.id as string, data as unknown as Omit<Reference, "id">)}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
}

function ItemList({
  items,
  col,
  onEdit,
}: {
  items: { id: string; label: string }[];
  col: string;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((i) => (
        <div key={i.id} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2">
          <span className="text-sm">{i.label}</span>
          <div className="flex gap-3 text-sm">
            <button className="text-accent hover:underline" onClick={() => onEdit(i.id)}>Edit</button>
            <button
              className="text-red-600 hover:underline"
              onClick={() => confirm("Delete this item?") && deleteItem(col, i.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

type FieldDef = { key: string; label: string; type?: "text" | "number" | "lines" };

function SimpleForm({
  fields,
  initial,
  onSave,
  onClose,
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => Promise<unknown>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Record<string, unknown>>(initial);
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Saving…");
    try {
      await onSave(form);
      setStatus("Saved ✓");
      onClose();
    } catch {
      setStatus("Save failed.");
    }
  }

  return (
    <div className="mt-4 space-y-3 rounded-lg border border-accent/40 bg-background p-4">
      {fields.map((f) => (
        <Field key={f.key} label={f.label}>
          {f.type === "lines" ? (
            <textarea
              className={inputClass}
              rows={4}
              value={arrToLines((form[f.key] as string[]) ?? [])}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: linesToArr(e.target.value) }))}
            />
          ) : (
            <input
              type={f.type === "number" ? "number" : "text"}
              className={inputClass}
              value={String(form[f.key] ?? "")}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                }))
              }
            />
          )}
        </Field>
      ))}
      <div className="flex items-center gap-3 pt-2">
        <button className={btnPrimary} onClick={save}>Save</button>
        <button className="text-sm text-muted hover:text-accent" onClick={onClose}>Cancel</button>
        {status && <span className="text-sm text-muted">{status}</span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UI primitives
// ---------------------------------------------------------------------------
const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent";
const btnPrimary =
  "rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60";
const btnSecondary =
  "inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function ProgressBar() {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div className="h-full w-1/3 animate-progress rounded-full bg-accent" />
    </div>
  );
}

function SaveRow({ status, onSave }: { status: string; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button className={btnPrimary} onClick={onSave}>Save changes</button>
      {status && <span className="text-sm text-muted">{status}</span>}
    </div>
  );
}
