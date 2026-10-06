"use client";

import { useFrame } from "@react-three/fiber";
import type { MutableRefObject, RefObject } from "react";
import * as THREE from "three";

const DAMPING = 0.9;
const MAX_VELOCITY = 3.2;
const STOP_THRESHOLD = 0.0008;

// Keeps pitch away from the poles so momentum can't flip the body fully
// upside down — yaw stays unrestricted (that's the "left/right" axis).
const PITCH_LIMIT = 1.05; // ~60°

type Props = {
  groupRef: RefObject<THREE.Group | null>;
  angularVelocityYRef: MutableRefObject<number>;
  angularVelocityXRef: MutableRefObject<number>;
  isRotatingRef: MutableRefObject<boolean>;
};

// Applies (and decays) angular velocity to the body group every frame, so
// both wheel bursts and released drags coast to a smooth stop instead of
// snapping. Skips applying velocity while a pointer drag is actively
// rotating (that path sets rotation directly for 1:1 tracking).
export default function RotationRig({ groupRef, angularVelocityYRef, angularVelocityXRef, isRotatingRef }: Props) {
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    angularVelocityYRef.current = THREE.MathUtils.clamp(angularVelocityYRef.current, -MAX_VELOCITY, MAX_VELOCITY);
    angularVelocityXRef.current = THREE.MathUtils.clamp(angularVelocityXRef.current, -MAX_VELOCITY, MAX_VELOCITY);

    if (!isRotatingRef.current) {
      group.rotation.y += angularVelocityYRef.current * delta;
      group.rotation.x = THREE.MathUtils.clamp(
        group.rotation.x + angularVelocityXRef.current * delta,
        -PITCH_LIMIT,
        PITCH_LIMIT
      );
    }

    const decay = Math.pow(DAMPING, delta * 60);
    angularVelocityYRef.current *= decay;
    angularVelocityXRef.current *= decay;
    if (Math.abs(angularVelocityYRef.current) < STOP_THRESHOLD) angularVelocityYRef.current = 0;
    if (Math.abs(angularVelocityXRef.current) < STOP_THRESHOLD) angularVelocityXRef.current = 0;
  });

  return null;
}
