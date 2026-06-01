import Link from "next/link";
import ProjectGrid from "@/components/ProjectGrid";
import { LotusHero, GalleryScene, VideoCarousel } from "@/components/DynamicSections";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      {/* nav */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
        <span
          className="text-sm tracking-[0.2em] uppercase text-[#1a3326]/50"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          mayozoz
        </span>
        <div className="flex gap-6">
          {[
            { href: "#work", label: "work" },
            { href: "#models", label: "3d" },
            { href: "/about", label: "about" },
          ].map(({ href, label }) => (
            <a
              key={label}
              href={href}
              className="text-xs tracking-[0.2em] uppercase text-[#1a3326]/40 hover:text-[#1a3326] transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* hero */}
      <section className="w-full max-w-3xl mx-auto px-6 pt-10 pb-4 flex flex-col items-center text-center gap-2">
        <h1
          className="text-6xl md:text-8xl font-light leading-[1.0] text-[#1a3326]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mei Yi Yang
        </h1>

        {/* lotus — centered, fills max-w-3xl, linked to gallery */}
        <Link href="/gallery" className="w-full block mt-2">
          <LotusHero />
        </Link>

        <p
          className="text-xs leading-relaxed text-[#1a3326]/50 max-w-xs mt-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          CS-trained creative technologist. I hand-model 3D characters, build
          games from the ground up, and direct end-to-end AI production pipelines.
        </p>
        <div className="flex flex-wrap justify-center gap-5 pt-1">
          <a
            href="https://github.com/mayozoz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.15em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            github ↗
          </a>
          <a
            href="https://www.linkedin.com/in/meiyy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.15em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            linkedin ↗
          </a>
          <a
            href="mailto:mei.yang0508@gmail.com"
            className="text-[11px] tracking-[0.15em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            email ↗
          </a>
        </div>
      </section>

      {/* divider */}
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="h-px bg-[#1a3326]/8" />
      </div>

      {/* video carousel */}
      <div id="work" className="w-full">
        <VideoCarousel />
      </div>

      {/* static project grid */}
      <ProjectGrid />

      {/* 3d gallery */}
      <div id="models" className="w-full">
        <GalleryScene />
      </div>

      {/* footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-10 mt-8">
        <div className="h-px bg-[#1a3326]/8 mb-8" />
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#1a3326]/30"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            mayozoz
          </p>
          <a
            href="https://mayozoz.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.15em] text-[#1a3326]/25 hover:text-[#7a9e8a] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← portfolio v1
          </a>
        </div>
      </footer>
    </main>
  );
}
