"use client";

import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { PlacedDecal } from "./types";

type Props = {
  bodyGroupRef: RefObject<THREE.Group | null>;
  decal: PlacedDecal | null;
  setDecal: React.Dispatch<React.SetStateAction<PlacedDecal | null>>;
  selectedDesignIdRef: MutableRefObject<string | null>;
  angularVelocityRef: MutableRefObject<number>;
  isRotatingRef: MutableRefObject<boolean>;
};

// Drag-to-rotate sensitivity (radians per pixel of pointer movement).
const DRAG_ROTATE_SENSITIVITY = 0.008;
// How much of a drag's last-frame speed carries over as coast velocity on release.
const DRAG_RELEASE_VELOCITY_SENSITIVITY = 0.35;

export default function PointerController({
  bodyGroupRef,
  decal,
  setDecal,
  selectedDesignIdRef,
  angularVelocityRef,
  isRotatingRef,
}: Props) {
  const { camera, gl, raycaster } = useThree();
  const decalRef = useRef(decal);

  useEffect(() => {
    decalRef.current = decal;
  }, [decal]);

  useEffect(() => {
    const dom = gl.domElement;
    const ndc = new THREE.Vector2();
    let mode: "idle" | "decal" | "rotate" = "idle";
    let lastX = 0;
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

    const raycastBody = () => {
      const hits = intersectBody();
      return hits.find((h) => h.object.name !== "tattoo-decal") ?? null;
    };

    const raycastDecalMesh = () => {
      const hits = intersectBody();
      return hits.find((h) => h.object.name === "tattoo-decal") ?? null;
    };

    const onPointerDown = (e: PointerEvent) => {
      setNdc(e);
      const decalHit = decalRef.current ? raycastDecalMesh() : null;

      if (decalHit) {
        mode = "decal";
      } else {
        const bodyHit = raycastBody();
        if (bodyHit && selectedDesignIdRef.current) {
          const mesh = bodyHit.object as THREE.Mesh;
          const local = mesh.worldToLocal(bodyHit.point.clone());
          setDecal({
            part: mesh.name,
            localPosition: local,
            seed: Math.random() * Math.PI * 2,
            designId: selectedDesignIdRef.current,
          });
          mode = "decal";
        } else {
          mode = "rotate";
          isRotatingRef.current = true;
          lastX = e.clientX;
        }
      }

      activePointerId = e.pointerId;
      dom.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId === null || e.pointerId !== activePointerId) return;
      setNdc(e);

      if (mode === "decal") {
        const bodyHit = raycastBody();
        if (bodyHit) {
          const mesh = bodyHit.object as THREE.Mesh;
          const local = mesh.worldToLocal(bodyHit.point.clone());
          setDecal((prev) => (prev ? { ...prev, part: mesh.name, localPosition: local } : prev));
        }
      } else if (mode === "rotate") {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        if (bodyGroupRef.current) {
          bodyGroupRef.current.rotation.y += dx * DRAG_ROTATE_SENSITIVITY;
        }
        angularVelocityRef.current = dx * DRAG_RELEASE_VELOCITY_SENSITIVITY;
      }
    };

    const endDrag = (e: PointerEvent) => {
      if (activePointerId !== null && e.pointerId === activePointerId) {
        try {
          dom.releasePointerCapture(e.pointerId);
        } catch {
          // pointer capture may already be released by the browser
        }
      }
      mode = "idle";
      isRotatingRef.current = false;
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
  }, [camera, gl, raycaster, bodyGroupRef, setDecal, selectedDesignIdRef, angularVelocityRef, isRotatingRef]);

  return null;
}
