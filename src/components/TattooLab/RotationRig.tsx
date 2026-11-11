"use client";

import { useFrame } from "@react-three/fiber";
import type { MutableRefObject, RefObject } from "react";
import * as THREE from "three";

const DAMPING = 0.9;
const MAX_VELOCITY = 3.2;
const STOP_THRESHOLD = 0.0008;
const RESET_LERP = 0.12;
const RESET_STOP_THRESHOLD = 0.002;

// Keeps pitch away from the poles so momentum can't flip the body fully
// upside down — yaw stays unrestricted (that's the "left/right" axis).
const PITCH_LIMIT = 1.05; // ~60°

// Collapses an unbounded yaw angle (can wind up past multiple full spins) to
// its shortest-path equivalent in (-180°, 180°], so animating back to 0
// never visibly un-spins through every lap the user scrolled through.
function shortestAngleToZero(radians: number) {
  const twoPi = Math.PI * 2;
  let a = radians % twoPi;
  if (a > Math.PI) a -= twoPi;
  if (a < -Math.PI) a += twoPi;
  return a;
}

type Props = {
  groupRef: RefObject<THREE.Group | null>;
  angularVelocityYRef: MutableRefObject<number>;
  angularVelocityXRef: MutableRefObject<number>;
  resetRef: MutableRefObject<boolean>;
};

// Applies (and decays) angular velocity to the body group every frame, so a
// two-finger scroll burst coasts to a smooth stop instead of snapping.
// Rotation is wheel-only (see TattooLabCanvas's onWheel) — pointer drags are
// reserved entirely for placing/moving ink (see PointerController), so there's
// no competing direct-rotation code path to gate against here.
//
// When resetRef is flagged (the recenter button), this takes over instead:
// kills any in-flight momentum and eases both axes back to 0 along the
// shortest path, clearing the flag once it arrives.
export default function RotationRig({ groupRef, angularVelocityYRef, angularVelocityXRef, resetRef }: Props) {
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (resetRef.current) {
      angularVelocityYRef.current = 0;
      angularVelocityXRef.current = 0;
      group.rotation.y = shortestAngleToZero(group.rotation.y);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, RESET_LERP);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, RESET_LERP);
      if (Math.abs(group.rotation.y) < RESET_STOP_THRESHOLD && Math.abs(group.rotation.x) < RESET_STOP_THRESHOLD) {
        group.rotation.y = 0;
        group.rotation.x = 0;
        resetRef.current = false;
      }
      return;
    }

    angularVelocityYRef.current = THREE.MathUtils.clamp(angularVelocityYRef.current, -MAX_VELOCITY, MAX_VELOCITY);
    angularVelocityXRef.current = THREE.MathUtils.clamp(angularVelocityXRef.current, -MAX_VELOCITY, MAX_VELOCITY);

    group.rotation.y += angularVelocityYRef.current * delta;
    group.rotation.x = THREE.MathUtils.clamp(
      group.rotation.x + angularVelocityXRef.current * delta,
      -PITCH_LIMIT,
      PITCH_LIMIT
    );

    const decay = Math.pow(DAMPING, delta * 60);
    angularVelocityYRef.current *= decay;
    angularVelocityXRef.current *= decay;
    if (Math.abs(angularVelocityYRef.current) < STOP_THRESHOLD) angularVelocityYRef.current = 0;
    if (Math.abs(angularVelocityXRef.current) < STOP_THRESHOLD) angularVelocityXRef.current = 0;
  });

  return null;
}
