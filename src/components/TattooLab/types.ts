import * as THREE from "three";

export type PlacedDecal = {
  part: string;
  localPosition: THREE.Vector3;
  seed: number;
  designId: string;
};
