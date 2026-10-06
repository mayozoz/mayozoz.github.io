"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import BodyModel from "./BodyModel";
import PointerController from "./PointerController";
import RotationRig from "./RotationRig";
import RotationReadout from "./RotationReadout";
import DesignSidebar from "./DesignSidebar";
import ControlPanel from "./ControlPanel";
import { FLASH_DESIGNS, renderFlashTexture, type FlashId } from "./tattooDesigns";
import type { PlacedInk } from "./types";
import "./tattooLab.css";

const DEFAULT_DESIGN: FlashId = "moth";

function useDesignTextures() {
  return useMemo(() => {
    const map = new Map<FlashId, THREE.CanvasTexture>();
    if (typeof document === "undefined") return map;
    for (const design of FLASH_DESIGNS) {
      const canvas = renderFlashTexture(design, 512);
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
// proportions change).
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

// Positions the shadow catcher just under the body's actual lowest point,
// measured once on mount — since the body no longer grounds itself at a
// fixed y=0 (it rotates around its own Blender-set origin instead), a static
// position here would either float above the figure or clip through it
// depending on where that origin happens to sit.
function GroundShadowCatcher({ targetRef }: { targetRef: RefObject<THREE.Group | null> }) {
  const [y, setY] = useState<number | null>(null);

  useEffect(() => {
    const obj = targetRef.current;
    if (!obj) return;
    const box = new THREE.Box3().setFromObject(obj);
    setY(box.min.y - 0.01);
  }, [targetRef]);

  if (y === null) return null;
  return <ContactShadows position={[0, y, 0]} opacity={0.55} scale={2.4} blur={2.2} far={1.2} color="#000000" />;
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
  const bodyGroupRef = useRef<THREE.Group>(null);
  const angularVelocityYRef = useRef(0);
  const angularVelocityXRef = useRef(0);
  const isRotatingRef = useRef(false);
  const selectedDesignIdRef = useRef<FlashId>(DEFAULT_DESIGN);

  const [selectedDesignId, setSelectedDesignId] = useState<FlashId>(DEFAULT_DESIGN);
  const [inks, setInks] = useState<PlacedInk[]>([]);
  const [orientation, setOrientation] = useState({ yaw: 0, pitch: 0 });

  const textures = useDesignTextures();

  useEffect(() => {
    selectedDesignIdRef.current = selectedDesignId;
  }, [selectedDesignId]);

  // Always arms the clicked design for the next placement; if it's already
  // placed somewhere, also toggles its current visibility — placement
  // itself happens by clicking the body (see PointerController).
  function handleFlashCardClick(id: FlashId) {
    setSelectedDesignId(id);
    setInks((prev) => {
      const idx = prev.findIndex((i) => i.design === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], visible: !next[idx].visible };
      return next;
    });
  }

  const displayYaw = ((orientation.yaw % 360) + 360) % 360;

  return (
    <main className="lab-shell">
      <header className="topbar">
        <div className="brand" aria-label="Tattoo Lab">
          <span className="brand-mark">TL</span>
          <span>
            <strong>Tattoo Lab</strong>
            <small>Digital fitting study</small>
          </span>
        </div>
        <div className="session-meta" aria-label="Session information">
          <span>Session 004</span>
          <i />
          <span>Body 01</span>
        </div>
        <div className="live-indicator">
          <span /> Live canvas
        </div>
      </header>

      <section className="workspace">
        <DesignSidebar inks={inks} selectedId={selectedDesignId} onCardClick={handleFlashCardClick} />

        <div className="viewer">
          <div className="viewer-grid" />
          <div className="axis axis-x" />
          <div className="axis axis-y" />
          <div className="viewer-label label-top-left">Anterior study / 01</div>
          <div className="viewer-label label-top-right">{Math.round(displayYaw)}°</div>

          <div className="figure-stage">
            <Canvas
              camera={{ position: [0, 0.9, 3], fov: 35 }}
              gl={{ antialias: true }}
              shadows
              style={{ background: "transparent" }}
            >
              <SceneLighting />
              <Suspense fallback={null}>
                <BodyModel ref={bodyGroupRef} inks={inks} textures={textures} />
              </Suspense>
              <AutoFrameCamera targetRef={bodyGroupRef} />
              <GroundShadowCatcher targetRef={bodyGroupRef} />
              <PointerController
                bodyGroupRef={bodyGroupRef}
                setInks={setInks}
                selectedDesignIdRef={selectedDesignIdRef}
                angularVelocityYRef={angularVelocityYRef}
                angularVelocityXRef={angularVelocityXRef}
                isRotatingRef={isRotatingRef}
              />
              <RotationRig
                groupRef={bodyGroupRef}
                angularVelocityYRef={angularVelocityYRef}
                angularVelocityXRef={angularVelocityXRef}
                isRotatingRef={isRotatingRef}
              />
              <RotationReadout groupRef={bodyGroupRef} onChange={(yaw, pitch) => setOrientation({ yaw, pitch })} />
            </Canvas>
          </div>

          <div className="floor-ring">
            <span />
          </div>
          <div className="instruction">
            <span className="mouse-glyph">
              <i />
            </span>
            <span>
              <strong>Drag to rotate</strong>Click figure to apply ink
            </span>
          </div>
        </div>

        <ControlPanel inks={inks} selectedId={selectedDesignId} yawDeg={orientation.yaw} onClear={() => setInks([])} />
      </section>

      <footer className="bottombar">
        <Link href="/#elsewhere">← back</Link>
        <span className="coordinates">
          X {orientation.pitch.toFixed(2)}&nbsp;&nbsp; Y {orientation.yaw.toFixed(2)}&nbsp;&nbsp; Z 0.00
        </span>
        <a href="https://www.instagram.com/poke.mei/" target="_blank" rel="noopener noreferrer">
          @poke.mei ↗
        </a>
      </footer>
    </main>
  );
}
