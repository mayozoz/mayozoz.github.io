"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import BodyModel from "./BodyModel";
import PointerController from "./PointerController";
import RotationRig from "./RotationRig";
import DesignSidebar from "./DesignSidebar";
import { TATTOO_DESIGNS, renderDesignCanvas } from "./tattooDesigns";
import type { PlacedDecal } from "./types";

// --- Real-asset swap points ---
// 1. Body: replace BodyModel's primitive meshes with a useGLTF(...) load of
//    the real .glb (keep every mesh named, and keep the renderDecalFor()
//    nesting pattern so decals stay parented to the right surface).
// 2. Designs: replace TATTOO_DESIGNS / renderDesignCanvas in tattooDesigns.ts
//    with a list of { id, name, src } pointing at real transparent PNGs, and
//    load textures with useTexture(src) instead of CanvasTexture.
// 3. DECAL_SCALE in BodyModel.tsx will likely need retuning once real body
//    proportions replace the placeholder mannequin.

const WHEEL_SENSITIVITY = 0.045;
const MAX_WHEEL_DELTA = 60;

function useDesignTextures() {
  return useMemo(() => {
    const map = new Map<string, THREE.CanvasTexture>();
    if (typeof document === "undefined") return map;
    for (const design of TATTOO_DESIGNS) {
      const canvas = renderDesignCanvas(design, 512);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      map.set(design.id, texture);
    }
    return map;
  }, []);
}

// Frames the camera to the body's actual bounding box once on mount, instead
// of hand-tuned position/fov guesswork (which drifts the moment body
// proportions change, e.g. once the real .glb replaces the placeholder).
function AutoFrameCamera({ targetRef }: { targetRef: RefObject<THREE.Group | null> }) {
  const { camera } = useThree();

  useEffect(() => {
    const obj = targetRef.current;
    if (!obj || !(camera instanceof THREE.PerspectiveCamera)) return;

    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const vFov = (camera.fov * Math.PI) / 180;
    const fitHeightDistance = size.y / 2 / Math.tan(vFov / 2);
    const fitWidthDistance = size.x / 2 / Math.tan(vFov / 2) / camera.aspect;
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.45;

    camera.position.set(center.x, center.y, center.z + distance);
    camera.near = distance / 100;
    camera.far = distance * 10;
    camera.lookAt(center);
    camera.updateProjectionMatrix();
  }, [targetRef, camera]);

  return null;
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#cfd2d6" />
      <directionalLight position={[1.4, 2.4, 2]} intensity={1.3} color="#f4f4f6" castShadow />
      <directionalLight position={[-1.8, 1.2, -1.6]} intensity={0.5} color="#5a6472" />
      <pointLight position={[0, 0.4, 1.6]} intensity={0.3} color="#8fa0b3" />
    </>
  );
}

export default function TattooLabCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const angularVelocityRef = useRef(0);
  const isRotatingRef = useRef(false);
  const selectedDesignIdRef = useRef<string | null>(null);

  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(TATTOO_DESIGNS[0]?.id ?? null);
  const [decal, setDecal] = useState<PlacedDecal | null>(null);

  const textures = useDesignTextures();
  const activeTexture = decal ? textures.get(decal.designId) ?? null : null;

  useEffect(() => {
    selectedDesignIdRef.current = selectedDesignId;
  }, [selectedDesignId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const primary = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(primary) < 1) return;
      e.preventDefault();
      const clamped = THREE.MathUtils.clamp(primary, -MAX_WHEEL_DELTA, MAX_WHEEL_DELTA);
      angularVelocityRef.current += clamped * WHEEL_SENSITIVITY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[560px]">
      <div
        ref={containerRef}
        className="relative flex-1 rounded-2xl border border-white/10 bg-[#121214] overflow-hidden"
        style={{ minHeight: 480, touchAction: "none" }}
      >
        <Canvas
          camera={{ position: [0, 0.9, 3], fov: 35 }}
          gl={{ antialias: true }}
          shadows
          style={{ background: "transparent" }}
        >
          <SceneLighting />
          <Suspense fallback={null}>
            <BodyModel ref={bodyGroupRef} decal={decal} texture={activeTexture} />
          </Suspense>
          <AutoFrameCamera targetRef={bodyGroupRef} />
          <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={2.4} blur={2.2} far={1.2} color="#000000" />
          <PointerController
            bodyGroupRef={bodyGroupRef}
            decal={decal}
            setDecal={setDecal}
            selectedDesignIdRef={selectedDesignIdRef}
            angularVelocityRef={angularVelocityRef}
            isRotatingRef={isRotatingRef}
          />
          <RotationRig groupRef={bodyGroupRef} angularVelocityRef={angularVelocityRef} isRotatingRef={isRotatingRef} />
        </Canvas>

        <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center px-4">
          <p
            className="text-[10px] tracking-[0.15em] uppercase text-white/35 text-center"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            two-finger scroll to rotate · click body to place · drag ink to move
          </p>
        </div>
      </div>

      <DesignSidebar
        designs={TATTOO_DESIGNS}
        textures={textures}
        selectedId={selectedDesignId}
        onSelect={setSelectedDesignId}
        hasPlacement={!!decal}
        onClear={() => setDecal(null)}
      />
    </div>
  );
}
