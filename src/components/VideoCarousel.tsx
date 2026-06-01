"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { videoProjects } from "@/data/projects";

const AUTOPLAY_INTERVAL = 6000;

export default function VideoCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // True once the user clicks into the iframe — stops auto-advance until they navigate manually
  const pausedRef = useRef(false);
  const activeRef = useRef(0);
  activeRef.current = active;

  const goNext = useCallback(() => {
    const nextIdx = (activeRef.current + 1) % videoProjects.length;
    setDirection(1);
    setActive(nextIdx);
  }, []);

  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  // window.blur fires when the iframe captures focus (user clicked the video)
  useEffect(() => {
    const onBlur = () => {
      pausedRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  // Restart the auto-advance timer whenever the active slide changes
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pausedRef.current) return;

    timerRef.current = setTimeout(goNextRef.current, AUTOPLAY_INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active]);

  const go = (idx: number) => {
    pausedRef.current = false; // manual navigation resumes auto-advance
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };

  const prev = () => go((active - 1 + videoProjects.length) % videoProjects.length);

  const project = videoProjects[active];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16">
      <p className="text-xs tracking-[0.25em] uppercase text-[#7a9e8a] mb-8" style={{ fontFamily: "var(--font-mono)" }}>
        [ video work ]
      </p>

      <div className="relative overflow-hidden rounded-2xl glass shadow-sm">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={project.slug}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid md:grid-cols-[1fr_auto] gap-0"
          >
            {/* video — enablejsapi=1 lets the iframe send postMessage state events */}
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                key={project.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full rounded-tl-2xl rounded-bl-2xl"
              />
            </div>

            {/* info panel */}
            <div className="md:w-64 p-7 flex flex-col justify-between border-l border-white/50">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((t) => (
                    <span key={t} className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#e8b4c0]/30 text-[#1a3326]/60" style={{ fontFamily: "var(--font-mono)" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-3xl font-light text-[#1a3326] mb-3 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {project.title}
                </h2>
                <p className="text-xs leading-relaxed text-[#1a3326]/60" style={{ fontFamily: "var(--font-mono)" }}>
                  {project.oneliner}
                </p>
              </div>
              <Link
                href={`/work/${project.slug}`}
                className="mt-6 text-xs tracking-[0.15em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                view case study →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="flex items-center gap-4 mt-5">
        <button onClick={prev} className="text-[#1a3326]/40 hover:text-[#1a3326] transition-colors text-lg" aria-label="Previous">←</button>
        <div className="flex gap-2">
          {videoProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "bg-[#7a9e8a] w-4" : "bg-[#1a3326]/20"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={() => go((active + 1) % videoProjects.length)} className="text-[#1a3326]/40 hover:text-[#1a3326] transition-colors text-lg" aria-label="Next">→</button>
      </div>
    </section>
  );
}
