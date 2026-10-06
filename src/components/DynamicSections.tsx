"use client";

import dynamic from "next/dynamic";

export const LotusHero = dynamic(() => import("@/components/LotusHero"), { ssr: false });
export const GalleryScene = dynamic(() => import("@/components/GalleryScene"), { ssr: false });
// ssr:false prevents hydration mismatch from framer-motion's server/client style diff
export const VideoCarousel = dynamic(() => import("@/components/VideoCarousel"), { ssr: false });

export const TattooLabScene = dynamic(() => import("@/components/TattooLab/TattooLabCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 min-h-[480px] rounded-2xl border border-white/10 bg-[#121214] flex items-center justify-center">
      <span className="text-[11px] tracking-[0.25em] uppercase text-white/30" style={{ fontFamily: "var(--font-mono)" }}>
        loading lab
      </span>
    </div>
  ),
});
