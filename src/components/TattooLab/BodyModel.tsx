"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { useGLTF, Decal } from "@react-three/drei";
import type { PlacedInk } from "./types";
import type { FlashId } from "./tattooDesigns";

const MATTE_PROPS = { color: "#86888c", roughness: 0.82, metalness: 0.05 } as const;
// Desired decal size relative to the human-scale TARGET_HEIGHT below (i.e. in
// the same units the rest of the scene — lighting, ContactShadows — is tuned
// for), not the mesh's own raw units. Converted to raw mesh-local units via
// `scale` before use, since <Decal> is nested directly on the raw mesh and
// its position/scale are interpreted in that mesh's own coordinate space.
const DECAL_WORLD_SIZE: [number, number, number] = [0.14, 0.14, 0.07];

// The raw export (body.blend -> body.glb) is a single unscaled mesh, roughly
// as wide/deep as it is tall (492 x 299 x 293) — a torso/bust, not a full
// standing figure. Target height matches the placeholder mannequin's own
// torso span (hips to neck, ~0.68-0.78m) rather than a full ~1.8m body, so
// the scene's light distances stay proportionate.
const TARGET_HEIGHT = 0.75;

type Props = {
  inks: PlacedInk[];
  textures: Map<FlashId, THREE.Texture>;
};

const BodyModel = forwardRef<THREE.Group, Props>(function BodyModel({ inks, textures }, ref) {
  const { scene: rawScene } = useGLTF("/tattoo_models/body.glb");
  const material = useMemo(() => new THREE.MeshStandardMaterial(MATTE_PROPS), []);

  // Clone once per load (not per ink/texture change — this mesh is dense
  // enough that re-cloning on every placement would be a real cost) and find
  // the actual mesh so <Decal> can be nested directly on it. No re-centering
  // here — the source file already has "geometry to origin" applied in
  // Blender, so the raw mesh's own local origin is the correct rotation
  // pivot; overriding it (as an earlier version did, grounding the bottom at
  // y=0) is exactly what pulled rotation off-center.
  const { mesh, scale } = useMemo(() => {
    const scene = rawScene.clone();
    let found: THREE.Mesh | null = null;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !found) found = child as THREE.Mesh;
    });
    const bodyMesh = found ?? new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    bodyMesh.name = "body";
    bodyMesh.material = material;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;

    const box = new THREE.Box3().setFromObject(bodyMesh);
    const size = new THREE.Vector3();
    box.getSize(size);

    return {
      mesh: bodyMesh,
      scale: size.y > 0 ? TARGET_HEIGHT / size.y : 1,
    };
  }, [rawScene, material]);

  const decalScale = useMemo(
    (): [number, number, number] => [
      DECAL_WORLD_SIZE[0] / scale,
      DECAL_WORLD_SIZE[1] / scale,
      DECAL_WORLD_SIZE[2] / scale,
    ],
    [scale]
  );

  const visibleInks = inks.filter((ink) => ink.visible && textures.has(ink.design));

  return (
    <group ref={ref} scale={scale}>
      <primitive object={mesh}>
        {visibleInks.map((ink) => (
          <Decal
            key={ink.design}
            name="tattoo-decal"
            userData={{ design: ink.design }}
            position={ink.localPosition}
            rotation={ink.seed}
            scale={decalScale}
            map={textures.get(ink.design)}
            depthTest
          />
        ))}
      </primitive>
    </group>
  );
});

export default BodyModel;

useGLTF.preload("/tattoo_models/body.glb");
