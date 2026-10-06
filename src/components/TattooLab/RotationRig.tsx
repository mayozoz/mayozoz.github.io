"use client";

import { useFrame } from "@react-three/fiber";
import type { MutableRefObject, RefObject } from "react";
import * as THREE from "three";

const DAMPING = 0.9;
const MAX_VELOCITY = 3.2;
const STOP_THRESHOLD = 0.0008;

type Props = {
  groupRef: RefObject<THREE.Group | null>;
  angularVelocityRef: MutableRefObject<number>;
  isRotatingRef: MutableRefObject<boolean>;
};

// Applies (and decays) angular velocity to the body group every frame, so
// both wheel bursts and released drags coast to a smooth stop instead of
// snapping. Skips applying velocity while a pointer drag is actively
// rotating (that path sets rotation.y directly for 1:1 tracking).
export default function RotationRig({ groupRef, angularVelocityRef, isRotatingRef }: Props) {
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    angularVelocityRef.current = THREE.MathUtils.clamp(angularVelocityRef.current, -MAX_VELOCITY, MAX_VELOCITY);

    if (!isRotatingRef.current) {
      group.rotation.y += angularVelocityRef.current * delta;
    }

    const decay = Math.pow(DAMPING, delta * 60);
    angularVelocityRef.current *= decay;
    if (Math.abs(angularVelocityRef.current) < STOP_THRESHOLD) {
      angularVelocityRef.current = 0;
    }
  });

  return null;
}
