"use client";

import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  MeshReflectorMaterial,
  Environment,
  Float,
  Html,
  useAnimations,
} from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

const SPACING = 2.4;
const OFFSET = ((7 - 1) / 2) * SPACING; // 7.2, derived from models.length

type AnimMode =
  | { type: "cycle" }
  | { type: "loop"; name: string }
  | { type: "first" }
  | { type: "none" }

const models = [
  { file: "dew-drop_character.glb",    name: "Dew Drop",   scaleMult: 1.0, anim: { type: "cycle" } as AnimMode },
  { file: "pebble_character.glb",      name: "Pebble",     scaleMult: 1.0, anim: { type: "loop", name: "Roll" } as AnimMode },
  { file: "Fish.glb",                  name: "Fish",        scaleMult: 1.0, anim: { type: "first" } as AnimMode },
  { file: "pink_bunny.glb",            name: "Pink Bunny",  scaleMult: 0.6, anim: { type: "first" } as AnimMode },
  { file: "daily_model_2025-09-22.glb", name: "Sushi",      scaleMult: 1.0, anim: { type: "none" } as AnimMode },
  { file: "daily_model_2025-09-26.glb", name: "Health Pot", scaleMult: 1.0, anim: { type: "none" } as AnimMode },
  { file: "daily_model_2025-10-15.glb", name: "Regen Pot",  scaleMult: 1.0, anim: { type: "none" } as AnimMode },
];

const CAMERA_MIN_X = -OFFSET;
const CAMERA_MAX_X =  OFFSET;

function Model({ file, scaleMult, anim }: { file: string; scaleMult: number; anim: AnimMode }) {
  const { scene: rawScene, animations } = useGLTF(`/glb_models/${file}`);
  const scene = useMemo(() => SkeletonUtils.clone(rawScene), [rawScene]);
  const { actions, names, mixer } = useAnimations(animations, scene);

  const { modelScale, modelPos } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = (maxDim > 0 ? 1.1 / maxDim : 1) * scaleMult;
    return {
      modelScale: s,
      modelPos: [-center.x * s, -box.min.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene, scaleMult]);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).castShadow = true;
    });
  }, [scene]);

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
  index,
  activeIndex,
  loaded,
  onClick,
}: {
  position: [number, number, number];
  modelData: (typeof models)[0];
  index: number;
  activeIndex: number | null;
  loaded: boolean;
  onClick: (i: number) => void;
}) {
  const isActive = activeIndex === index;
  const isDimmed = activeIndex !== null && !isActive;

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
          opacity={isDimmed ? 0.3 : 1}
          transparent
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
          opacity={isDimmed ? 0.3 : 1}
          transparent
        />
      </mesh>

      <group
        position={[0, 0.12, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(index); }}
      >
        <Float speed={1.2} floatIntensity={isActive ? 0.5 : 0.2} rotationIntensity={0.05}>
          {loaded && (
            <Suspense fallback={null}>
              <Model file={modelData.file} scaleMult={modelData.scaleMult} anim={modelData.anim} />
            </Suspense>
          )}
        </Float>
      </group>

      {!isDimmed && (
        <Html center position={[0, -0.58, 0]} distanceFactor={6}>
          <div
            className="text-center whitespace-nowrap text-[11px] tracking-widest uppercase text-[#1a3326]/50 pointer-events-none select-none"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {modelData.name}
          </div>
        </Html>
      )}
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

function GalleryContent({ targetX }: { targetX: number }) {
  const [active, setActive] = useState<number | null>(null);

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
          index={i}
          activeIndex={active}
          loaded={loadedIndices.has(i)}
          onClick={(idx) => setActive(active === idx ? null : idx)}
        />
      ))}
    </>
  );
}

export default function GalleryScene() {
  const [targetX, setTargetX] = useState(0);
  const [inView, setInView] = useState(false);
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
            >
              <GalleryContent targetX={targetX} />
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

      <p className="text-[11px] text-[#1a3326]/40 mt-4 text-center" style={{ fontFamily: "var(--font-mono)" }}>
        scroll or use arrows · click a model to focus
      </p>
    </section>
  );
}
