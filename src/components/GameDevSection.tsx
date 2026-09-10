"use client";

import { useState } from "react";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";

const theBoot = projects.find((p) => p.slug === "the-boot")!;
const gameEngine = projects.find((p) => p.slug === "game-engine")!;

type MediaMode = "thumb" | "video" | "play";

function GameCard({ project }: { project: Project }) {
  const [mode, setMode] = useState<MediaMode>("thumb");

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col">
      <div className="relative w-full bg-[#1a3326]/5" style={{ paddingTop: "56.25%" }}>
        {mode === "thumb" && project.youtubeId && (
          <button
            onClick={() => setMode("video")}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`Watch ${project.title} trailer`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
              alt={`${project.title} trailer thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-[#1a3326]/20 group-hover:bg-[#1a3326]/35 transition-colors">
              <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-[#1a3326] text-xl shadow-md group-hover:scale-105 transition-transform">
                ▶
              </span>
            </span>
          </button>
        )}

        {mode === "video" && project.youtubeId && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${project.title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}

        {mode === "play" && project.playUrl && (
          <iframe
            src={project.playUrl}
            title={`Play ${project.title}`}
            allow="autoplay; fullscreen; gamepad"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>

      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#b8dccb]/40 text-[#2a6a4a]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t}
            </span>
          ))}
        </div>

        <h3 className="text-2xl font-light text-[#1a3326]" style={{ fontFamily: "var(--font-display)" }}>
          {project.title}
        </h3>

        <p className="text-[11px] leading-relaxed text-[#1a3326]/55 flex-1" style={{ fontFamily: "var(--font-mono)" }}>
          {project.oneliner}
        </p>

        {project.mediaNote && (
          <p className="text-[10px] leading-relaxed italic text-[#1a3326]/40" style={{ fontFamily: "var(--font-mono)" }}>
            {project.mediaNote}
          </p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
          {project.playUrl && mode !== "play" && (
            <button
              onClick={() => setMode("play")}
              className="text-[10px] tracking-[0.15em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors cursor-pointer"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              play in browser →
            </button>
          )}
          {project.links?.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.15em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {l.label} ↗
            </a>
          ))}
          <Link
            href={`/work/${project.slug}`}
            className="text-[10px] tracking-[0.15em] uppercase text-[#1a3326]/40 hover:text-[#1a3326] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            case study →
          </Link>
        </div>

        {mode === "play" && (
          <p className="text-[10px] text-[#1a3326]/35 pt-1" style={{ fontFamily: "var(--font-mono)" }}>
            Unity WebGL build — give it a moment to load.
          </p>
        )}
      </div>
    </div>
  );
}

export default function GameDevSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8">
      <p className="text-xs tracking-[0.25em] uppercase text-[#7a9e8a] mb-8" style={{ fontFamily: "var(--font-mono)" }}>
        [ game dev ]
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <GameCard project={theBoot} />
        <GameCard project={gameEngine} />
      </div>
    </section>
  );
}
