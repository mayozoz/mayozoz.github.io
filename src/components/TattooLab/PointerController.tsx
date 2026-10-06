"use client";

import { useEffect, type Dispatch, type MutableRefObject, type RefObject, type SetStateAction } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { PlacedInk } from "./types";
import type { FlashId } from "./tattooDesigns";

type Props = {
  bodyGroupRef: RefObject<THREE.Group | null>;
  setInks: Dispatch<SetStateAction<PlacedInk[]>>;
  selectedDesignIdRef: MutableRefObject<FlashId | null>;
};

// Pointer drags are reserved entirely for ink — rotation is a separate,
// two-finger-scroll-only gesture (see TattooLabCanvas's onWheel), which
// arrives as wheel events and never competes with these pointer events.
// Pressing on the body places (or re-grabs) the selected design and follows
// the cursor live until release; pressing directly on an existing decal
// grabs that one instead, regardless of what's currently selected.
export default function PointerController({ bodyGroupRef, setInks, selectedDesignIdRef }: Props) {
  const { camera, gl, raycaster } = useThree();

  useEffect(() => {
    const dom = gl.domElement;
    const ndc = new THREE.Vector2();
    let activeDesign: FlashId | null = null;
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

    const upsertInk = (design: FlashId, localPosition: THREE.Vector3) => {
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

    const onPointerDown = (e: PointerEvent) => {
      setNdc(e);
      const decalHit = raycastDecal();

      if (decalHit) {
        activeDesign = (decalHit.object.userData as { design?: FlashId }).design ?? null;
      } else {
        const bodyHit = raycastSurface();
        const design = selectedDesignIdRef.current;
        if (bodyHit && design) {
          activeDesign = design;
          const mesh = bodyHit.object as THREE.Mesh;
          upsertInk(design, mesh.worldToLocal(bodyHit.point.clone()));
        } else {
          activeDesign = null;
        }
      }

      if (!activeDesign) return; // missed the body and/or nothing selected — nothing to track
      activePointerId = e.pointerId;
      dom.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId === null || e.pointerId !== activePointerId || !activeDesign) return;
      setNdc(e);
      const hit = raycastSurface();
      if (hit) {
        const mesh = hit.object as THREE.Mesh;
        upsertInk(activeDesign, mesh.worldToLocal(hit.point.clone()));
      }
    };

    const endDrag = (e: PointerEvent) => {
      if (activePointerId === null || e.pointerId !== activePointerId) return;
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture may already be released by the browser
      }
      activeDesign = null;
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
  }, [camera, gl, raycaster, bodyGroupRef, setInks, selectedDesignIdRef]);

  return null;
}
