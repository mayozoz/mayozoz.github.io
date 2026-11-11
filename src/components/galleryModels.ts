"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

export type AnimMode =
  | { type: "cycle" }
  | { type: "loop"; name: string }
  | { type: "first" }
  | { type: "none" }

export type ModelEntry = {
  file: string;
  name: string;
  scaleMult: number;
  anim: AnimMode;
  materials?: Record<string, THREE.Material>;
};

// Dew Drop's Blender shaders (mix + glossy) don't survive glTF export, so its
// materials are rebuilt here from the URP Lit values in the Unity project.
const dewMaterials: Record<string, THREE.Material> = {
  body: new THREE.MeshStandardMaterial({
    color: new THREE.Color().setRGB(0.904, 0.759, 1, THREE.SRGBColorSpace),
    opacity: 0.545,
    transparent: true,
    depthWrite: false,
    roughness: 0,
    metalness: 0,
    side: THREE.DoubleSide,
  }),
  eyes: new THREE.MeshStandardMaterial({
    color: new THREE.Color().setRGB(0.483, 0.579, 0.66, THREE.SRGBColorSpace),
    roughness: 0,
    metalness: 0,
    side: THREE.DoubleSide,
  }),
};

export const models: ModelEntry[] = [
  { file: "dew-drop_character.glb",    name: "Dew Drop",   scaleMult: 1.0, anim: { type: "cycle" }, materials: dewMaterials },
  { file: "pebble_character.glb",      name: "Pebble",     scaleMult: 1.0, anim: { type: "loop", name: "Roll" } },
  { file: "Fish.glb",                  name: "Fish",        scaleMult: 1.0, anim: { type: "first" } },
  { file: "pink_bunny.glb",            name: "Pink Bunny",  scaleMult: 0.6, anim: { type: "first" } },
  { file: "daily_model_2025-09-22.glb", name: "Sushi",      scaleMult: 1.0, anim: { type: "none" } },
  { file: "daily_model_2025-09-26.glb", name: "Health Pot", scaleMult: 1.0, anim: { type: "none" } },
  { file: "daily_model_2025-10-15.glb", name: "Regen Pot",  scaleMult: 1.0, anim: { type: "none" } },
];

// Loads a private clone of the model (so several views can animate independently),
// applies material overrides, and sizes it to ~1.1 units sitting on y = 0.
export function useModelScene({ file, scaleMult, materials }: ModelEntry) {
  const { scene: rawScene, animations } = useGLTF(`/glb_models/${file}`);

  const scene = useMemo(() => {
    const clone = SkeletonUtils.clone(rawScene);
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      const override = materials && materials[(mesh.material as THREE.Material).name];
      if (override) mesh.material = override;
    });
    return clone;
  }, [rawScene, materials]);

  const { modelScale, modelPos } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = (maxDim > 0 ? 1.1 / maxDim : 1) * scaleMult;
    return {
      modelScale: s,
      modelPos: [-center.x * s, -box.min.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene, scaleMult]);

  return { scene, animations, modelScale, modelPos };
}

// The clip a model plays by default, used as the viewer's starting toggle.
export function defaultClip(anim: AnimMode, names: string[]): string | null {
  if (!names.length || anim.type === "none") return null;
  if (anim.type === "loop" && names.includes(anim.name)) return anim.name;
  return names.includes("Idle") ? "Idle" : names[0];
}
