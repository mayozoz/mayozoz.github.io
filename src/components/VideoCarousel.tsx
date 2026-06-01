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

  // Track YouTube player state without causing re-renders
  const isPlayingRef = useRef(false);
  const waitingRef = useRef(false); // timer fired while video was playing
  const activeRef = useRef(0);
  activeRef.current = active;

  const goNext = useCallback(() => {
    const nextIdx = (activeRef.current + 1) % videoProjects.length;
    setDirection(1);
    setActive(nextIdx);
  }, []);

  // Keep a stable ref so the message handler can call the latest version
  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  // Listen for YouTube player state via postMessage (requires enablejsapi=1)
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event !== "onStateChange") return;
        // YouTube states: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering
        isPlayingRef.current = data.info === 1;
        if (!isPlayingRef.current && waitingRef.current) {
          // Video stopped while we were waiting to advance — go now
          waitingRef.current = false;
          goNextRef.current();
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Reset play state when slide changes (new iframe, fresh state)
  useEffect(() => {
    isPlayingRef.current = false;
    waitingRef.current = false;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        waitingRef.current = true; // hold until video stops
      } else {
        goNextRef.current();
      }
    }, AUTOPLAY_INTERVAL);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active]);

  const go = (idx: number) => {
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
        <button onClick={goNext} className="text-[#1a3326]/40 hover:text-[#1a3326] transition-colors text-lg" aria-label="Next">→</button>
      </div>
    </section>
  );
}
