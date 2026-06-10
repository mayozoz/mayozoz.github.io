"use client";

import Link from "next/link";
import { staticProjects } from "@/data/projects";

const tagColors: Record<string, string> = {
  "ai production": "bg-[#e8b4c0]/30 text-[#9a5a6a]",
  "game dev": "bg-[#b8dccb]/40 text-[#2a6a4a]",
  web: "bg-[#c8ebe6]/50 text-[#2a5a5a]",
  ios: "bg-[#f5dde3]/60 text-[#8a4a5a]",
  "3d": "bg-[#dceee6]/50 text-[#3a6a4a]",
  systems: "bg-[#e0dff5]/50 text-[#4a4a8a]",
};

function ProjectCard({ project }: { project: (typeof staticProjects)[number] }) {
  return (
    <Link
      href={project.externalUrl ?? `/work/${project.slug}`}
      target={project.externalUrl ? "_blank" : undefined}
      rel={project.externalUrl ? "noopener noreferrer" : undefined}
      className="group glass rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
    >
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span
            key={t}
            className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full ${tagColors[t] ?? "bg-[#dceee6]/40 text-[#1a3326]/50"}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3
          className="text-xl font-light leading-tight text-[#1a3326] group-hover:text-[#2a6a4a] transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>
        {project.period && (
          <span className="text-[9px] tracking-wide text-[#1a3326]/35" style={{ fontFamily: "var(--font-mono)" }}>
            {project.period}
          </span>
        )}
      </div>
      <p className="text-[11px] leading-relaxed text-[#1a3326]/55 flex-1" style={{ fontFamily: "var(--font-mono)" }}>
        {project.oneliner}
      </p>
      <span className="text-[10px] tracking-[0.15em] uppercase text-[#7a9e8a] group-hover:text-[#1a3326] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
        read more →
      </span>
    </Link>
  );
}

export default function ProjectGrid() {
  const experience = staticProjects.filter((p) => p.category === "experience");
  const projects = staticProjects.filter((p) => p.category === "projects");

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col gap-12">
      {experience.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-[#7a9e8a] mb-8" style={{ fontFamily: "var(--font-mono)" }}>
            [ experience ]
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {experience.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-[#7a9e8a] mb-8" style={{ fontFamily: "var(--font-mono)" }}>
            [ projects ]
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </div>
      )}
    </section>
  );
}
