"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useModelScene, defaultClip, type ModelEntry } from "@/components/galleryModels";

const FADE = 0.25;

function ViewerModel({
  model,
  playing,
  onClips,
}: {
  model: ModelEntry;
  playing: Set<string>;
  onClips: (names: string[]) => void;
}) {
  const { scene, animations, modelScale, modelPos } = useModelScene(model);
  const { actions, names } = useAnimations(animations, scene);

  useEffect(() => { onClips(names); }, [names, onClips]);

  // Diff the toggled set against what is already running, fading clips in/out
  const runningRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const running = runningRef.current;
    for (const name of names) {
      const a = actions[name];
      if (!a) continue;
      if (playing.has(name) && !running.has(name)) {
        a.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(FADE).play();
        running.add(name);
      } else if (!playing.has(name) && running.has(name)) {
        a.fadeOut(FADE);
        running.delete(name);
      }
    }
  }, [playing, actions, names]);

  useEffect(() => () => { Object.values(actions).forEach((a) => a?.stop()); }, [actions]);

  return (
    <group scale={modelScale} position={modelPos}>
      <primitive object={scene} />
    </group>
  );
}

export default function ModelViewer({ model, onClose }: { model: ModelEntry; onClose: () => void }) {
  const [clips, setClips] = useState<string[]>([]);
  const [playing, setPlaying] = useState<Set<string>>(new Set());

  const handleClips = useCallback((names: string[]) => {
    setClips(names);
    const first = defaultClip(model.anim, names);
    setPlaying(first ? new Set([first]) : new Set());
  }, [model.anim]);

  // At most one clip at a time; clicking the active one turns it off
  const toggle = (name: string) =>
    setPlaying((prev) => (prev.has(name) ? new Set() : new Set([name])));

  // Escape closes; page scroll is locked while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={model.name}
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#f0f7f4] to-[#dceee6]"
    >
      <Canvas camera={{ position: [0, 0.9, 2.6], fov: 40 }} shadows gl={{ antialias: true }}>
        <Environment preset="dawn" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 6, 3]} intensity={1.0} color="#fce8e8" castShadow />
        <pointLight position={[-4, 3, -2]} intensity={0.4} color="#c8ebe6" />
        <Suspense fallback={null}>
          <ViewerModel model={model} playing={playing} onClips={handleClips} />
        </Suspense>
        <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={4} blur={2.4} far={2} />
        <OrbitControls
          target={[0, 0.5, 0]}
          enablePan={false}
          minDistance={1.2}
          maxDistance={6}
          autoRotate={clips.length === 0}
          autoRotateSpeed={1.2}
        />
      </Canvas>

      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] pointer-events-none">
        <p className="text-xs tracking-[0.25em] uppercase text-[#7a9e8a]" style={{ fontFamily: "var(--font-mono)" }}>
          [ {model.name} ]
        </p>
        <button
          onClick={onClose}
          className="pointer-events-auto w-9 h-9 flex items-center justify-center glass rounded-full text-[#1a3326]/60 hover:text-[#1a3326] transition-colors"
          aria-label="Back to gallery"
        >
          ✕
        </button>
      </div>

      <div className="absolute bottom-0 inset-x-0 px-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] pointer-events-none">
        {clips.length > 0 ? (
          <div className="pointer-events-auto max-w-3xl mx-auto flex flex-wrap justify-center gap-2 max-h-[30vh] overflow-y-auto">
            {clips.map((name) => {
              const on = playing.has(name);
              return (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  aria-pressed={on}
                  className={`px-3 py-1.5 rounded-full text-[11px] tracking-widest uppercase transition-colors ${
                    on ? "bg-[#1a3326] text-white border border-[#1a3326]" : "glass text-[#1a3326]/60 hover:text-[#1a3326]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {name}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-[13px] text-[#1a3326]/40" style={{ fontFamily: "var(--font-mono)" }}>
            drag to orbit · scroll to zoom
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}
