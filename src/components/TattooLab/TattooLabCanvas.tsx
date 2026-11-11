"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import BodyModel from "./BodyModel";
import PointerController from "./PointerController";
import RotationRig from "./RotationRig";
import RotationReadout from "./RotationReadout";
import DesignSidebar from "./DesignSidebar";
import ControlPanel from "./ControlPanel";
import { FLASH_DESIGNS, renderFlashTexture, type FlashId } from "./tattooDesigns";
import { DEFAULT_INK_STYLE, type PlacedInk } from "./types";
import "./tattooLab.css";

type InkStyle = { size: number; opacity: number };

const DEFAULT_DESIGN: FlashId = "moth";
const WHEEL_SENSITIVITY = 0.045;
const MAX_WHEEL_DELTA = 60;
const ZOOM_SENSITIVITY = 0.012;
const MIN_ZOOM = 0.45;
const MAX_ZOOM = 2.5;

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

// Frames the camera to the body's actual bounding box once (instead of
// hand-tuned position/fov guesswork, which drifts the moment body
// proportions change), then continuously applies `zoomRef` as a multiplier
// on that fitted distance every frame — smoothed so a pinch gesture (or
// ctrl+wheel) eases toward its target instead of snapping.
function CameraRig({
  targetRef,
  zoomRef,
}: {
  targetRef: RefObject<THREE.Group | null>;
  zoomRef: MutableRefObject<number>;
}) {
  const { camera } = useThree();
  const baseDistance = useRef(0);
  const center = useRef(new THREE.Vector3());
  const framed = useRef(false);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    if (!framed.current) {
      const obj = targetRef.current;
      if (!obj) return;
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center.current);

      const vFov = (camera.fov * Math.PI) / 180;
      const fitHeightDistance = size.y / 2 / Math.tan(vFov / 2);
      const fitWidthDistance = size.x / 2 / Math.tan(vFov / 2) / camera.aspect;
      baseDistance.current = Math.max(fitHeightDistance, fitWidthDistance) * 1.45;
      camera.near = baseDistance.current / 100;
      camera.far = baseDistance.current * 10;
      camera.updateProjectionMatrix();
      framed.current = true;
    }

    const targetDistance = baseDistance.current * zoomRef.current;
    const currentDistance = camera.position.distanceTo(center.current) || targetDistance;
    const nextDistance = THREE.MathUtils.lerp(currentDistance, targetDistance, 0.15);

    const dir = camera.position.clone().sub(center.current);
    if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
    dir.normalize();

    camera.position.copy(center.current).add(dir.multiplyScalar(nextDistance));
    camera.lookAt(center.current);
  });

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
  const viewerRef = useRef<HTMLDivElement>(null);
  const angularVelocityYRef = useRef(0);
  const angularVelocityXRef = useRef(0);
  const zoomRef = useRef(1);
  const resetRef = useRef(false);
  const selectedDesignIdRef = useRef<FlashId>(DEFAULT_DESIGN);
  const styleByDesignRef = useRef<Partial<Record<FlashId, InkStyle>>>({});

  const [selectedDesignId, setSelectedDesignId] = useState<FlashId>(DEFAULT_DESIGN);
  const [inks, setInks] = useState<PlacedInk[]>([]);
  const [orientation, setOrientation] = useState({ yaw: 0, pitch: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [styleByDesign, setStyleByDesign] = useState<Partial<Record<FlashId, InkStyle>>>({});

  const textures = useDesignTextures();

  useEffect(() => {
    selectedDesignIdRef.current = selectedDesignId;
  }, [selectedDesignId]);

  useEffect(() => {
    styleByDesignRef.current = styleByDesign;
  }, [styleByDesign]);

  // Two-finger trackpad scroll (and mouse wheel) rotates — horizontal delta
  // feeds yaw, vertical feeds pitch, both added as velocity for RotationRig
  // to apply/decay every frame rather than snapping directly. A trackpad
  // pinch gesture (or ctrl+wheel) arrives as the same wheel event but with
  // ctrlKey set — browsers synthesize pinch this way — so it's routed to
  // zoom instead of rotation.
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = THREE.MathUtils.clamp(e.deltaY, -MAX_WHEEL_DELTA, MAX_WHEEL_DELTA);
        zoomRef.current = THREE.MathUtils.clamp(zoomRef.current + delta * ZOOM_SENSITIVITY, MIN_ZOOM, MAX_ZOOM);
        return;
      }
      if (Math.abs(e.deltaX) < 1 && Math.abs(e.deltaY) < 1) return;
      e.preventDefault();
      const dx = THREE.MathUtils.clamp(e.deltaX, -MAX_WHEEL_DELTA, MAX_WHEEL_DELTA);
      const dy = THREE.MathUtils.clamp(e.deltaY, -MAX_WHEEL_DELTA, MAX_WHEEL_DELTA);
      angularVelocityYRef.current += dx * WHEEL_SENSITIVITY;
      angularVelocityXRef.current -= dy * WHEEL_SENSITIVITY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

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

  // Size/opacity act on whichever design is currently selected — live on its
  // placed ink if it has one, otherwise remembered as that design's default
  // for the moment it does get placed (see PointerController's upsertInk).
  const activeInk = inks.find((i) => i.design === selectedDesignId);
  const activeStyle: InkStyle = activeInk ?? styleByDesign[selectedDesignId] ?? DEFAULT_INK_STYLE;

  function handleStyleChange(next: Partial<InkStyle>) {
    setStyleByDesign((prev) => ({
      ...prev,
      [selectedDesignId]: { ...(prev[selectedDesignId] ?? DEFAULT_INK_STYLE), ...next },
    }));
    setInks((prev) => prev.map((i) => (i.design === selectedDesignId ? { ...i, ...next } : i)));
  }

  function handleRecenter() {
    zoomRef.current = 1;
    resetRef.current = true;
  }

  // Shortest-path angle so a user who's spun several full laps still reads
  // as "off center" only by the visually meaningful remainder, not the raw
  // accumulated total.
  const yawShortest = (((orientation.yaw % 360) + 540) % 360) - 180;
  const isOffCenter = Math.abs(yawShortest) > 1 || Math.abs(orientation.pitch) > 1 || Math.abs(zoomLevel - 1) > 0.03;

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

        <div className="viewer" ref={viewerRef}>
          <div className="viewer-grid" />
          <div className="axis axis-x" />
          <div className="axis axis-y" />
          <div className="viewer-label label-top-left">Anterior study / 01</div>
          <div className="viewer-label label-top-right">{Math.round(displayYaw)}°</div>
          {isOffCenter && (
            <button className="recenter-button" onClick={handleRecenter}>
              Recenter
            </button>
          )}

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
              <CameraRig targetRef={bodyGroupRef} zoomRef={zoomRef} />
              <GroundShadowCatcher targetRef={bodyGroupRef} />
              <PointerController
                bodyGroupRef={bodyGroupRef}
                setInks={setInks}
                selectedDesignIdRef={selectedDesignIdRef}
                styleByDesignRef={styleByDesignRef}
              />
              <RotationRig
                groupRef={bodyGroupRef}
                angularVelocityYRef={angularVelocityYRef}
                angularVelocityXRef={angularVelocityXRef}
                resetRef={resetRef}
              />
              <RotationReadout
                groupRef={bodyGroupRef}
                zoomRef={zoomRef}
                onChange={(yaw, pitch, zoom) => {
                  setOrientation({ yaw, pitch });
                  setZoomLevel(zoom);
                }}
              />
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
              <strong>Two-finger scroll to rotate</strong>Click &amp; drag to place or move ink
            </span>
          </div>
        </div>

        <ControlPanel
          inks={inks}
          selectedId={selectedDesignId}
          yawDeg={orientation.yaw}
          style={activeStyle}
          onStyleChange={handleStyleChange}
          onClear={() => setInks([])}
        />
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
