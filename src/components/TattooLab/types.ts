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
};
