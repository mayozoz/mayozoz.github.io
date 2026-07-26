"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, Float } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

const FULL_DURATION = 5.8333;
const PEAK_TIME = FULL_DURATION / 2; // frame 70

type Phase = "idle" | "opening" | "open" | "closing";

function LotusModel({ mouseX, mouseY, hovered }: { mouseX: number; mouseY: number; hovered: boolean }) {
  const { scene: rawScene, animations } = useGLTF("/glb_models/lotus_flower.glb");
  const scene = useMemo(() => SkeletonUtils.clone(rawScene), [rawScene]);
  const { actions, names } = useAnimations(animations, scene);

  // Apply glass material to every mesh
  useEffect(() => {
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      // Slight tint difference between the two objects
      const isLily = mesh.parent?.name === "Grote_Lily";
      mesh.material = new THREE.MeshPhysicalMaterial({
        transmission: 0.96,
        roughness: 0.04,
        thickness: 0.55,
        ior: 1.52,
        color: new THREE.Color(isLily ? "#d4eee6" : "#f0dde8"),
        side: THREE.DoubleSide,
        envMapIntensity: 1.8,
        specularIntensity: 1,
        specularColor: new THREE.Color("#ffffff"),
      });
      mesh.castShadow = true;
    });
  }, [scene]);

  const phaseRef = useRef<Phase>("idle");
  const hoveredRef = useRef(false);
  hoveredRef.current = hovered;

  const groupRef = useRef<THREE.Group>(null);
  const targetRotY = useRef(0);
  const targetRotX = useRef(0);
  const targetRotZ = useRef(0);

  // Init all actions with LoopOnce
  useEffect(() => {
    names.forEach((n) => {
      const a = actions[n];
      if (!a) return;
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = false;
    });
  }, [actions, names]);

  useEffect(() => {
    if (!names.length) return;

    if (hovered && phaseRef.current === "idle") {
      names.forEach((n) => {
        const a = actions[n];
        if (!a) return;
        (a as any)._fadingOut = false;
        a.reset();
        a.time = 0;
        a.timeScale = 1;
        a.paused = false;
        a.fadeIn(0.35);
        a.play();
      });
      phaseRef.current = "opening";
    } else if (hovered && phaseRef.current === "closing") {
      // Interrupt close — push forward again
      names.forEach((n) => {
        const a = actions[n];
        if (!a) return;
        a.timeScale = 1;
        a.paused = false;
      });
      phaseRef.current = "opening";
    } else if (!hovered && phaseRef.current === "open") {
      // Release from peak — play the closing half (70→140)
      names.forEach((n) => {
        const a = actions[n];
        if (!a) return;
        a.paused = false;
      });
      phaseRef.current = "closing";
    }
    // if opening and user unhovers: useFrame catches it at peak and continues to close
  }, [hovered, names, actions]);

  useFrame(() => {
    // Mouse tracking — Y, X, and subtle Z for a natural tilt feel
    if (groupRef.current) {
      targetRotY.current += (mouseX * 0.6 - targetRotY.current) * 0.05;
      targetRotX.current += (-mouseY * 0.35 - targetRotX.current) * 0.05;
      targetRotZ.current += (-mouseX * mouseY * 0.15 - targetRotZ.current) * 0.05;
      groupRef.current.rotation.y = targetRotY.current;
      groupRef.current.rotation.x = targetRotX.current;
      groupRef.current.rotation.z = targetRotZ.current;
    }

    if (phaseRef.current === "idle" || !names.length) return;
    const sample = actions[names[0]];
    if (!sample) return;

    if (phaseRef.current === "opening" && sample.time >= PEAK_TIME) {
      // Clamp all to peak
      names.forEach((n) => {
        const a = actions[n];
        if (!a) return;
        a.time = PEAK_TIME;
        a.paused = true;
      });
      phaseRef.current = "open";

      // If user left during opening, immediately start closing
      if (!hoveredRef.current) {
        names.forEach((n) => {
          const a = actions[n];
          if (!a) return;
          a.paused = false;
        });
        phaseRef.current = "closing";
      }
    } else if (phaseRef.current === "closing" && sample.time >= FULL_DURATION - 0.4) {
      names.forEach((n) => {
        const a = actions[n];
        if (!a) return;
        if ((a as any)._fadingOut) return;
        (a as any)._fadingOut = true;
        a.fadeOut(0.4);
      });
    } else if (phaseRef.current === "closing" && sample.time >= FULL_DURATION - 0.05) {
      names.forEach((n) => {
        const a = actions[n];
        if (!a) return;
        a.stop();
        a.reset();
        (a as any)._fadingOut = false;
      });
      phaseRef.current = "idle";
    }
  });

  return (
    <group ref={groupRef} scale={0.18} position={[0, -0.5, 0]}>
      <Float speed={1.1} floatIntensity={0.3} rotationIntensity={0.04}>
        <primitive object={scene} />
      </Float>
    </group>
  );
}

export default function LotusHero() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 2);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ height: "min(55vw, 480px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 1.2, 5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Environment preset="dawn" />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 3]} intensity={1.4} color="#fce8e8" />
        <pointLight position={[-3, 2, -2]} intensity={0.6} color="#c8ebe6" />
        <LotusModel mouseX={mouseX} mouseY={mouseY} hovered={hovered} />
      </Canvas>

      {/* hover label */}
      <div
        className={`absolute inset-0 flex items-end justify-center pb-4 pointer-events-none transition-opacity duration-400 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          className="text-xs tracking-[0.22em] uppercase text-[#1a3326]/55"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          view resume
        </span>
      </div>
    </div>
  );
}
