import * as THREE from "three";
import type { FlashId } from "./tattooDesigns";

// At most one placement per design — re-placing the same design moves it and
// forces it visible again; the sidebar can independently toggle visibility
// without discarding the placement.
export type PlacedInk = {
  design: FlashId;
  localPosition: THREE.Vector3;
  seed: number;
  visible: boolean;
  size: number; // multiplier on the base decal size, 1 = default
  opacity: number; // 0-1
};

export const DEFAULT_INK_STYLE = { size: 1, opacity: 1 } as const;
