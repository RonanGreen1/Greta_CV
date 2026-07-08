"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import { usePortfolio } from "@/lib/data";
import type { Project } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Home() {
  const { profile, experience, education, projects, references } = usePortfolio();
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <Nav name={profile.name} />

      <main id="top" className="mx-auto max-w-5xl px-6">
        {/* Hero */}
        <section className="flex flex-col items-center gap-8 py-16 md:flex-row md:items-center md:py-24">
          <Avatar name={profile.name} photoUrl={profile.photoUrl} />
          <div className="text-center md:text-left">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              {profile.subtitle}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-lg text-muted">{profile.title}</p>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-foreground/80 md:mx-0">
              {profile.tagline}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href="#contact"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Get in touch
              </a>
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                Download CV (PDF)
              </a>
            </div>
          </div>
        </section>

        {/* About */}
        <Section id="about" title="About me">
          <div className="space-y-4 text-base leading-relaxed text-foreground/80">
            {profile.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section id="projects" title="Selected work">
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={() => setSelected(p)} />
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section id="experience" title="Experience">
          <ol className="relative space-y-8 border-l border-border pl-6">
            {experience.map((job) => (
              <li key={job.id} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-accent" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-lg font-semibold">{job.role}</h3>
                  <span className="text-sm text-muted">{job.period}</span>
                </div>
                <p className="text-sm font-medium text-accent">{job.company}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/80">
                  {job.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>

        {/* Education */}
        <Section id="education" title="Education">
          <div className="grid gap-4 sm:grid-cols-2">
            {education.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{e.title}</h3>
                  <span className="text-xs text-muted">{e.period}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{e.school}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section id="skills" title="Skills & tools">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SkillGroup title="Specialisms" items={profile.specialisms} />
            <SkillGroup title="Software" items={profile.software} />
            <SkillGroup title="Certifications" items={profile.certifications} />
            <SkillGroup title="Languages" items={profile.languages} />
          </div>
        </Section>

        {/* Contact */}
        <Section id="contact" title="Get in touch">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-foreground/80">
                Interested in working together or want to know more? I&apos;d love
                to hear from you.
              </p>
              <ContactRow label="Email" value={profile.email} href={`mailto:${profile.email}`} />
              <ContactRow label="Phone" value={profile.phone} href={`tel:${profile.phone.replace(/\s/g, "")}`} />
              <ContactRow label="Location" value={profile.location} />
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                Download full CV (PDF)
              </a>
            </div>

            {references.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  References
                </h3>
                <div className="mt-3 space-y-4">
                  {references.map((r) => (
                    <div key={r.id}>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-sm text-muted">{r.detail}</p>
                      <p className="text-sm text-muted">{r.contact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      </main>

      <footer className="mt-16 border-t border-border py-8">
        <p className="text-center text-sm text-muted">
          © {new Date().getFullYear()} {profile.name} · {profile.title}
        </p>
        <p className="mt-2 text-center text-xs text-muted">
          <a href="/admin" className="hover:text-accent">
            Edit site
          </a>
        </p>
      </footer>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function Avatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={photoUrl}
        alt={name}
        className="h-40 w-40 shrink-0 rounded-full border-4 border-card object-cover shadow-md"
      />
    );
  }
  return (
    <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-accent-soft text-4xl font-bold text-accent shadow-md">
      {initials(name)}
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-14">
      <h2 className="mb-8 text-2xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function SkillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        {title}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full bg-card px-3 py-1 text-sm ring-1 ring-border"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-20 shrink-0 font-medium text-muted">{label}</span>
      {href ? (
        <a href={href} className="text-foreground hover:text-accent">
          {value}
        </a>
      ) : (
        <span className="text-foreground">{value}</span>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <article
      onClick={onOpen}
      className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card text-left transition-shadow hover:shadow-md"
    >
      <div className="aspect-video overflow-hidden">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-soft to-border">
            <span className="text-sm font-medium text-accent">
              {project.category}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            {project.category}
          </span>
          {project.year && (
            <span className="text-xs text-muted">{project.year}</span>
          )}
        </div>
        <h3 className="mt-1 text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded bg-background px-2 py-0.5 text-xs text-muted ring-1 ring-border"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <span className="mt-4 inline-block text-sm font-medium text-accent group-hover:underline">
          View details →
        </span>
      </div>
    </article>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted ring-1 ring-border hover:text-accent"
        >
          ✕
        </button>

        {project.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-56 w-full rounded-t-2xl object-cover"
          />
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {project.category}
            </span>
            {project.year && (
              <span className="text-xs text-muted">{project.year}</span>
            )}
          </div>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">
            {project.title}
          </h3>

          <div className="mt-5 space-y-5 text-sm leading-relaxed text-foreground/80">
            <ModalBlock title="Overview" body={project.details || project.description} />
            <ModalBlock title="What I learned" body={project.learned} />
            <ModalBlock title="Challenges" body={project.challenges} />
          </div>

          {project.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-background px-2 py-0.5 text-xs text-muted ring-1 ring-border"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {project.pdfUrl && (
            <a
              href={project.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              View project PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalBlock({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <div>
      <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">
        {title}
      </h4>
      <p>{body}</p>
    </div>
  );
}
