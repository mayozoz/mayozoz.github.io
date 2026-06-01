"use client";

import dynamic from "next/dynamic";

export const LotusHero = dynamic(() => import("@/components/LotusHero"), { ssr: false });
export const GalleryScene = dynamic(() => import("@/components/GalleryScene"), { ssr: false });
// ssr:false prevents hydration mismatch from framer-motion's server/client style diff
export const VideoCarousel = dynamic(() => import("@/components/VideoCarousel"), { ssr: false });
