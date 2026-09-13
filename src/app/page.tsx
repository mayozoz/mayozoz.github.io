import Link from "next/link";
import ProjectGrid from "@/components/ProjectGrid";
import GameDevSection from "@/components/GameDevSection";
import SkillsSection from "@/components/SkillsSection";
import { LotusHero, GalleryScene } from "@/components/DynamicSections";

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
        <Link
          href="/contact"
          className="text-xs tracking-[0.2em] uppercase text-[#1a3326]/40 hover:text-[#1a3326] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          contact me
        </Link>
      </nav>

      {/* hero */}
      <section className="w-full max-w-3xl mx-auto px-6 pt-10 pb-4 flex flex-col items-center text-center gap-2">
        <h1
          className="text-6xl md:text-8xl leading-[1.0] text-[#3a3735]"
          style={{ fontFamily: "var(--font-name)" }}
        >
          Mei Yi Yang
        </h1>

        {/* lotus — centered, fills max-w-3xl, links to resume */}
        <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="w-full block mt-2">
          <LotusHero />
        </Link>

        <p
          className="text-xs leading-relaxed text-[#1a3326]/50 max-w-xs mt-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          CS student at the University of Michigan. I build iOS apps, game
          engines, AI systems, and research tools. I like shipping finished things.
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
            href="https://runnyeggpie.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.15em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            itch.io ↗
          </a>
          <a
            href="https://www.instagram.com/poke.mei/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.15em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            tattoos ↗
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
      {/* <div id="work" className="w-full">
        <VideoCarousel />
      </div> */}

      {/* static project grid */}
      <div id="work" className="w-full">
        <ProjectGrid />
      </div>

      {/* game dev */}
      <div id="game-dev" className="w-full">
        <GameDevSection />
      </div>

      {/* skills */}
      <SkillsSection />

      {/* 3d gallery */}
      <div id="models" className="w-full">
        <GalleryScene />
      </div>

      {/* elsewhere */}
      <section className="w-full max-w-5xl mx-auto px-6 py-8">
        <p
          className="text-xs tracking-[0.25em] uppercase text-[#7a9e8a] mb-8"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          [ elsewhere ]
        </p>
        <a
          href="https://www.instagram.com/poke.mei/"
          target="_blank"
          rel="noopener noreferrer"
          className="flip-card group block h-36 sm:h-28 rounded-xl"
        >
          <div className="flip-card-inner rounded-xl">
            {/* front — decorative image */}
            <div
              className="flip-card-face rounded-xl bg-cover bg-center opacity-25"
              style={{ backgroundImage: "url(/lotus-glassy.jpg)" }}
            />

            {/* back — revealed on hover */}
            <div className="flip-card-face flip-card-back glass rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-center gap-3 text-center sm:text-left">
              <p
                className="text-[11px] leading-relaxed text-[#1a3326]/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Outside of code, I draw and tattoo.
              </p>
              <span
                className="text-[10px] tracking-[0.15em] uppercase text-[#7a9e8a] group-hover:text-[#1a3326] transition-colors shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                @poke.mei on instagram ↗
              </span>
            </div>
          </div>
        </a>
      </section>

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
