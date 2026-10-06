"use client";

import { useEffect, type Dispatch, type MutableRefObject, type RefObject, type SetStateAction } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { PlacedInk } from "./types";
import type { FlashId } from "./tattooDesigns";

const PITCH_LIMIT = 1.05; // ~60°, matches RotationRig's momentum clamp
// Pointer movement (px) before a gesture that started on empty body/background
// is treated as a drag-to-rotate instead of a click-to-place.
const DRAG_THRESHOLD_PX = 4;
// Drag-to-rotate sensitivity (radians per pixel of pointer movement).
const DRAG_ROTATE_SENSITIVITY = 0.008;
// How much of a drag's last-frame speed carries over as coast velocity on release.
const DRAG_RELEASE_VELOCITY_SENSITIVITY = 0.35;

type Props = {
  bodyGroupRef: RefObject<THREE.Group | null>;
  setInks: Dispatch<SetStateAction<PlacedInk[]>>;
  selectedDesignIdRef: MutableRefObject<FlashId | null>;
  angularVelocityYRef: MutableRefObject<number>;
  angularVelocityXRef: MutableRefObject<number>;
  isRotatingRef: MutableRefObject<boolean>;
};

type Mode = "idle" | "pending" | "rotate" | "move-ink";

export default function PointerController({
  bodyGroupRef,
  setInks,
  selectedDesignIdRef,
  angularVelocityYRef,
  angularVelocityXRef,
  isRotatingRef,
}: Props) {
  const { camera, gl, raycaster } = useThree();

  useEffect(() => {
    const dom = gl.domElement;
    const ndc = new THREE.Vector2();
    let mode: Mode = "idle";
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let movingDesign: FlashId | null = null;
    let activePointerId: number | null = null;

    const setNdc = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const intersectBody = () => {
      const group = bodyGroupRef.current;
      if (!group) return [];
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObjects(group.children, true);
    };

    const raycastSurface = () => intersectBody().find((h) => h.object.name !== "tattoo-decal") ?? null;
    const raycastDecal = () => intersectBody().find((h) => h.object.name === "tattoo-decal") ?? null;

    const placeOrMoveSelected = (localPosition: THREE.Vector3) => {
      const design = selectedDesignIdRef.current;
      if (!design) return;
      setInks((prev) => {
        const idx = prev.findIndex((i) => i.design === design);
        if (idx === -1) {
          return [...prev, { design, localPosition, seed: Math.random() * Math.PI * 2, visible: true }];
        }
        const next = [...prev];
        next[idx] = { ...next[idx], localPosition, visible: true };
        return next;
      });
    };

    const moveInkTo = (design: FlashId, localPosition: THREE.Vector3) => {
      setInks((prev) => prev.map((i) => (i.design === design ? { ...i, localPosition } : i)));
    };

    const onPointerDown = (e: PointerEvent) => {
      setNdc(e);
      const decalHit = raycastDecal();

      if (decalHit) {
        mode = "move-ink";
        movingDesign = (decalHit.object.userData as { design?: FlashId }).design ?? null;
      } else {
        // Don't decide yet — a click-to-place and a drag-to-rotate both start
        // identically here; onPointerMove promotes this to "rotate" once the
        // pointer actually travels.
        mode = "pending";
        startX = e.clientX;
        startY = e.clientY;
      }

      lastX = e.clientX;
      lastY = e.clientY;
      activePointerId = e.pointerId;
      dom.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId === null || e.pointerId !== activePointerId) return;
      setNdc(e);

      if (mode === "move-ink") {
        if (movingDesign) {
          const hit = raycastSurface();
          if (hit) {
            const mesh = hit.object as THREE.Mesh;
            moveInkTo(movingDesign, mesh.worldToLocal(hit.point.clone()));
          }
        }
        return;
      }

      if (mode === "pending") {
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (dist < DRAG_THRESHOLD_PX) return;
        mode = "rotate";
        isRotatingRef.current = true;
        // fall through to apply this frame's delta immediately
      }

      if (mode === "rotate") {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        const group = bodyGroupRef.current;
        if (group) {
          group.rotation.y += dx * DRAG_ROTATE_SENSITIVITY;
          // Drag up tilts the top toward you (like rolling a ball with your
          // finger), clamped so it can't flip fully upside down.
          group.rotation.x = THREE.MathUtils.clamp(
            group.rotation.x - dy * DRAG_ROTATE_SENSITIVITY,
            -PITCH_LIMIT,
            PITCH_LIMIT
          );
        }
        angularVelocityYRef.current = dx * DRAG_RELEASE_VELOCITY_SENSITIVITY;
        angularVelocityXRef.current = -dy * DRAG_RELEASE_VELOCITY_SENSITIVITY;
      }
    };

    const endDrag = (e: PointerEvent) => {
      if (activePointerId === null || e.pointerId !== activePointerId) return;

      if (mode === "pending") {
        // Pointer never traveled past the threshold — a true click.
        setNdc(e);
        const hit = raycastSurface();
        if (hit) {
          const mesh = hit.object as THREE.Mesh;
          placeOrMoveSelected(mesh.worldToLocal(hit.point.clone()));
        }
      }

      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture may already be released by the browser
      }
      mode = "idle";
      isRotatingRef.current = false;
      movingDesign = null;
      activePointerId = null;
    };

    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointermove", onPointerMove);
    dom.addEventListener("pointerup", endDrag);
    dom.addEventListener("pointercancel", endDrag);

    return () => {
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerup", endDrag);
      dom.removeEventListener("pointercancel", endDrag);
    };
  }, [camera, gl, raycaster, bodyGroupRef, setInks, selectedDesignIdRef, angularVelocityYRef, angularVelocityXRef, isRotatingRef]);

  return null;
}
