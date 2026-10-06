import type { Metadata } from "next";
import Link from "next/link";
import { TattooLabScene } from "@/components/DynamicSections";

export const metadata: Metadata = {
  title: "tattoo lab — mayozoz",
  description: "Place tattoo flash on a 3D form. An interactive lab by Mei Yi Yang.",
};

export default function TattooLabPage() {
  return (
    <main className="min-h-screen w-full bg-[#0a0a0b] text-[#e4e4e6] flex flex-col">
      <header className="w-full max-w-6xl mx-auto px-6 pt-8 pb-6 flex items-center justify-between">
        <Link
          href="/#elsewhere"
          className="text-[11px] tracking-[0.2em] uppercase text-[#8a8a8f] hover:text-[#e4e4e6] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← back
        </Link>
        <p
          className="text-[11px] tracking-[0.3em] uppercase text-[#8a8a8f]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          [ tattoo lab ]
        </p>
        <a
          href="https://www.instagram.com/poke.mei/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-[0.2em] uppercase text-[#8a8a8f] hover:text-[#e4e4e6] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          @poke.mei ↗
        </a>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 pb-10">
        <TattooLabScene />
      </div>
    </main>
  );
}
