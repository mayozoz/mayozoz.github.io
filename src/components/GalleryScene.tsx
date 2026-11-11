"use client";

import { Suspense, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshReflectorMaterial,
  Environment,
  Float,
  Html,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";
import { models, useModelScene, type ModelEntry } from "@/components/galleryModels";
import ModelViewer from "@/components/ModelViewer";

const SPACING = 2.4;
const OFFSET = ((models.length - 1) / 2) * SPACING;

const CAMERA_MIN_X = -OFFSET;
const CAMERA_MAX_X =  OFFSET;

function Model({ model }: { model: ModelEntry }) {
  const { anim } = model;
  const { scene, animations, modelScale, modelPos } = useModelScene(model);
  const { actions, names, mixer } = useAnimations(animations, scene);

  const cycleIndexRef = useRef(0);
  useEffect(() => {
    if (anim.type !== "cycle" || !names.length || !mixer) return;
    cycleIndexRef.current = 0;
    const playAt = (idx: number) => {
      Object.values(actions).forEach((a) => a?.stop());
      const a = actions[names[idx]];
      if (!a) return;
      a.reset().setLoop(THREE.LoopOnce, 1).play();
    };
    const onFinished = () => {
      cycleIndexRef.current = (cycleIndexRef.current + 1) % names.length;
      playAt(cycleIndexRef.current);
    };
    mixer.addEventListener("finished", onFinished);
    playAt(0);
    return () => {
      mixer.removeEventListener("finished", onFinished);
      Object.values(actions).forEach((a) => a?.stop());
    };
  }, [anim.type, actions, names, mixer]);

  useEffect(() => {
    if (anim.type !== "loop") return;
    const a = actions[(anim as { type: "loop"; name: string }).name];
    if (!a) return;
    a.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.3).play();
    return () => { a.fadeOut(0.3); };
  }, [anim, actions]);

  useEffect(() => {
    if (anim.type !== "first" || !names.length) return;
    const a = actions[names[0]];
    if (!a) return;
    a.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.3).play();
    return () => { a.fadeOut(0.3); };
  }, [anim.type, actions, names]);

  const meshRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!meshRef.current || anim.type !== "none") return;
    meshRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={meshRef} scale={modelScale} position={modelPos}>
      <primitive object={scene} />
    </group>
  );
}

function Pedestal({
  position,
  modelData,
  loaded,
  onOpen,
}: {
  position: [number, number, number];
  modelData: ModelEntry;
  loaded: boolean;
  onOpen: (model: ModelEntry) => void;
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = "pointer";
    return () => { document.body.style.cursor = ""; };
  }, [hovered]);

  return (
    <group position={position}>
      <mesh receiveShadow position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.38, 0.44, 0.06, 32]} />
        <meshPhysicalMaterial
          color="#c8ebe6"
          roughness={0.05}
          transmission={0.7}
          thickness={0.5}
          ior={1.5}
        />
      </mesh>
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.38, 16]} />
        <meshPhysicalMaterial
          color="#dff0ea"
          roughness={0.1}
          transmission={0.8}
          thickness={0.3}
          ior={1.4}
        />
      </mesh>

      <group
        position={[0, 0.12, 0]}
        onClick={(e) => { e.stopPropagation(); onOpen(modelData); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <Float speed={1.2} floatIntensity={hovered ? 0.5 : 0.2} rotationIntensity={0.05}>
          {loaded && (
            <Suspense fallback={null}>
              <Model model={modelData} />
            </Suspense>
          )}
        </Float>
      </group>

      <Html center position={[0, -0.58, 0]} distanceFactor={6} zIndexRange={[10, 0]}>
        <div
          className="text-center whitespace-nowrap text-[11px] tracking-widest uppercase text-[#1a3326]/50 pointer-events-none select-none"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {modelData.name}
        </div>
      </Html>
    </group>
  );
}

function CameraRig({ targetX }: { targetX: number }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (targetX - camera.position.x) * 0.08;
  });
  return null;
}

function GalleryFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]} receiveShadow>
      <planeGeometry args={[32, 8]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={0.5}
        roughness={0.4}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#e8f5f0"
        metalness={0}
        mirror={0.5}
      />
    </mesh>
  );
}

function GalleryContent({ targetX, onOpen }: { targetX: number; onOpen: (model: ModelEntry) => void }) {
  // Track which model indices have ever been within view — once loaded, stay loaded
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() => new Set([2, 3, 4]));

  const centerIndex = Math.round((targetX + OFFSET) / SPACING);

  useEffect(() => {
    const lo = Math.max(0, centerIndex - 1);
    const hi = Math.min(models.length - 1, centerIndex + 1);
    setLoadedIndices((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (let i = lo; i <= hi; i++) {
        if (!next.has(i)) { next.add(i); changed = true; }
      }
      return changed ? next : prev;
    });
  }, [centerIndex]);

  return (
    <>
      <Environment preset="dawn" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 6, 3]} intensity={1.0} color="#fce8e8" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 3, -2]} intensity={0.4} color="#c8ebe6" />
      <CameraRig targetX={targetX} />
      <GalleryFloor />
      {models.map((m, i) => (
        <Pedestal
          key={m.file}
          position={[i * SPACING - OFFSET, 0, 0]}
          modelData={m}
          loaded={loadedIndices.has(i)}
          onOpen={onOpen}
        />
      ))}
    </>
  );
}

export default function GalleryScene() {
  const [targetX, setTargetX] = useState(0);
  const [inView, setInView] = useState(false);
  const [viewing, setViewing] = useState<ModelEntry | null>(null);
  const closeViewer = useCallback(() => setViewing(null), []);
  const containerRef = useRef<HTMLDivElement>(null);

  // Don't mount the Canvas until the section scrolls near the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Wheel panning
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(dx) < 5) return;
      e.preventDefault();
      setTargetX((x) => Math.max(CAMERA_MIN_X, Math.min(CAMERA_MAX_X, x + dx * 0.012)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const atStart = targetX <= CAMERA_MIN_X + 0.1;
  const atEnd   = targetX >= CAMERA_MAX_X - 0.1;

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16">
      <p className="text-xs tracking-[0.25em] uppercase text-[#7a9e8a] mb-8" style={{ fontFamily: "var(--font-mono)" }}>
        [ 3d models ]
      </p>

      <div className="relative">
        <button
          onClick={() => setTargetX((x) => Math.max(CAMERA_MIN_X, x - SPACING))}
          disabled={atStart}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-9 h-9 flex items-center justify-center glass rounded-full text-[#1a3326]/50 hover:text-[#1a3326] disabled:opacity-20 transition-all"
          aria-label="Scroll left"
        >
          ←
        </button>

        <div ref={containerRef} className="glass rounded-2xl overflow-hidden" style={{ height: 420 }}>
          {inView ? (
            <Canvas
              camera={{ position: [0, 1.2, 5.5], fov: 45 }}
              shadows
              gl={{ antialias: true }}
              style={{ background: "transparent" }}
              frameloop={viewing ? "never" : "always"}
            >
              <GalleryContent targetX={targetX} onOpen={setViewing} />
            </Canvas>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs tracking-[0.25em] uppercase text-[#1a3326]/25" style={{ fontFamily: "var(--font-mono)" }}>
                loading models
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setTargetX((x) => Math.min(CAMERA_MAX_X, x + SPACING))}
          disabled={atEnd}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-9 h-9 flex items-center justify-center glass rounded-full text-[#1a3326]/50 hover:text-[#1a3326] disabled:opacity-20 transition-all"
          aria-label="Scroll right"
        >
          →
        </button>
      </div>

      <p className="text-[13px] text-[#1a3326]/40 mt-4 text-center" style={{ fontFamily: "var(--font-mono)" }}>
        scroll or use arrows · click a model to view
      </p>
      {viewing && <ModelViewer key={viewing.file} model={viewing} onClose={closeViewer} />}
    </section>
  );
}
