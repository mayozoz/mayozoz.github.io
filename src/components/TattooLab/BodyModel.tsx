"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { Decal } from "@react-three/drei";
import type { PlacedDecal } from "./types";

// Placeholder mannequin: swap for the real .glb by replacing this component's
// contents with a useGLTF() load. Keep each mesh named (mesh.name) so
// PointerController's raycast-by-name logic keeps working, and keep the
// per-mesh renderDecalFor(...) nesting pattern so decals stay parented
// correctly to whichever surface they're placed on.

const MATTE_PROPS = { color: "#86888c", roughness: 0.82, metalness: 0.05 } as const;

const DECAL_SCALE: [number, number, number] = [0.16, 0.16, 0.08];

type Props = {
  decal: PlacedDecal | null;
  texture: THREE.Texture | null;
};

const BodyModel = forwardRef<THREE.Group, Props>(function BodyModel({ decal, texture }, ref) {
  const material = useMemo(() => new THREE.MeshStandardMaterial(MATTE_PROPS), []);

  const renderDecalFor = (part: string) => {
    if (!decal || !texture || decal.part !== part) return null;
    return (
      <Decal
        name="tattoo-decal"
        position={decal.localPosition}
        rotation={decal.seed}
        scale={DECAL_SCALE}
        map={texture}
        depthTest
      />
    );
  };

  return (
    <group ref={ref}>
      <mesh name="head" position={[0, 1.62, 0]} material={material} castShadow receiveShadow>
        <sphereGeometry args={[0.13, 32, 32]} />
        {renderDecalFor("head")}
      </mesh>
      <mesh name="neck" position={[0, 1.46, 0]} material={material} castShadow receiveShadow>
        <cylinderGeometry args={[0.045, 0.055, 0.12, 24]} />
        {renderDecalFor("neck")}
      </mesh>
      <mesh name="torso" position={[0, 1.14, 0]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.19, 0.42, 10, 32]} />
        {renderDecalFor("torso")}
      </mesh>
      <mesh name="hips" position={[0, 0.78, 0]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.2, 0.1, 10, 32]} />
        {renderDecalFor("hips")}
      </mesh>

      <mesh name="armUpperL" position={[-0.25, 1.18, 0]} rotation={[0, 0, 0.14]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        {renderDecalFor("armUpperL")}
      </mesh>
      <mesh name="armLowerL" position={[-0.31, 0.89, 0.02]} rotation={[0, 0, 0.2]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.042, 0.28, 8, 16]} />
        {renderDecalFor("armLowerL")}
      </mesh>

      <mesh name="armUpperR" position={[0.25, 1.18, 0]} rotation={[0, 0, -0.14]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        {renderDecalFor("armUpperR")}
      </mesh>
      <mesh name="armLowerR" position={[0.31, 0.89, 0.02]} rotation={[0, 0, -0.2]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.042, 0.28, 8, 16]} />
        {renderDecalFor("armLowerR")}
      </mesh>

      <mesh name="thighL" position={[-0.1, 0.46, 0]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.075, 0.36, 8, 20]} />
        {renderDecalFor("thighL")}
      </mesh>
      <mesh name="shinL" position={[-0.1, 0.1, 0]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.055, 0.32, 8, 20]} />
        {renderDecalFor("shinL")}
      </mesh>

      <mesh name="thighR" position={[0.1, 0.46, 0]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.075, 0.36, 8, 20]} />
        {renderDecalFor("thighR")}
      </mesh>
      <mesh name="shinR" position={[0.1, 0.1, 0]} material={material} castShadow receiveShadow>
        <capsuleGeometry args={[0.055, 0.32, 8, 20]} />
        {renderDecalFor("shinR")}
      </mesh>
    </group>
  );
});

export default BodyModel;
